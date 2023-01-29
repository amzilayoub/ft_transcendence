import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

import basicFetch from "@utils/basicFetch";
import { useChatContext } from "context/chat.context";

import ChatBox from "./ChatBox";
import ChatSidebar from "./ChatSidebar";

const ChatStuff = () => {
  let [socketIO, setSocketIO] = useState(null);
  const {
    deleteBox,
    activeBoxes,
    activateBox,
    conversationsMetadata,
    showChatSidebar,
    setShowChatSidebar,
    setConversationsMetadata,
  } = useChatContext(socketIO);

  useEffect(() => {
    let socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
      withCredentials: true, // this is needed to send cookies
      transports: ["websocket"],
    });

    setSocketIO(socket);

    const getRoomInfo = async (id) => {
      const resp = await basicFetch.get(`/chat/room/${id}`);

      if (resp.status == 200) {
        return resp.json();
      }
    };

    if (socket) {
      socket.on("updateListConversations", async (obj) => {
        let targetedRoom = (await getRoomInfo(obj.data.room.room_id))[0];
        setConversationsMetadata((state) => {
          if (obj.data.action == "add") {
            const newState = state.filter((item) => {
              if (item.isActiveBox && item.room_id == obj.data.room.room_id) {
                socket.emit(
                  "setRead",
                  {
                    roomId: item.room_id,
                  },
                  () => {}
                );
                targetedRoom.unreadMessagesCount = 0;
                targetedRoom.isActiveBox = true;
              }
              return item.room_id != obj.data.room.room_id;
            });
            return [targetedRoom, ...newState];
          } else {
            const newState = [...state];

            for (let i in newState) {
              if (newState[i].room_id == obj.data.room.room_id) {
                targetedRoom.unreadMessagesCount = 0;
                targetedRoom.isActiveBox = true;
                newState[i] = targetedRoom;
              }
            }
            return newState;
          }
        });
      });
    }
    socket.on("userConnect", (resp) => {
      const userId = resp.data.userId;
      const mode = resp.data.mode;

      setConversationsMetadata((state) => {
        const newConv = [...state];
        newConv.forEach((item) => {
          if (item.user_id == userId) {
            item.isOnline = mode == "online";
          }
        });
        return newConv;
      });
    });
    return () => {
      socket.close();
    };
  }, [setSocketIO]); // a hack to stop infinite rendering
  return (
    <div className="fixed bottom-0 right-0 hidden px-6 md:block">
      <ChatSidebar
        showChatSidebar={showChatSidebar}
        setShowChatSidebar={setShowChatSidebar}
        onConversationClick={activateBox}
        conversationsMetadata={conversationsMetadata}
        onNewConversationClick={() => console.log("new conversation")}
        setConversationsMetadata={setConversationsMetadata}
        socket={socketIO}
        activeBoxes={activeBoxes}
      />
      <ul className="absolute bottom-0 right-[400px] flex gap-x-3">
        {activeBoxes?.map((item) => (
          <li key={item.id} className="w-full">
            <ChatBox
              conversationMetaData={item}
              allConversation={conversationsMetadata}
              setConversationsMetadata={setConversationsMetadata}
              onClose={() => deleteBox(item["id"])}
              socket={socketIO}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatStuff;
