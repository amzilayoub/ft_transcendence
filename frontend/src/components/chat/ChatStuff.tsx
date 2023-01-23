import React, { useEffect, useState } from "react";

import basicFetch from "@utils/basicFetch";
import { useChatContext } from "context/chat.context";
import { io } from "socket.io-client";

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
        console.log("obj = ", obj);
        return;
        let targetedRoom = (await getRoomInfo(obj.data.room.room_id))[0];
        setConversationsMetadata((state) => {
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
        });
      });
    }
    return () => {
      socket.close();
    };
  }, [setSocketIO]); // a hack to stop infinite rendering

  return (
    <div className="fixed bottom-0 right-0 px-6 hidden md:block">
      <ChatSidebar
        showChatSidebar={showChatSidebar}
        setShowChatSidebar={setShowChatSidebar}
        onConversationClick={activateBox}
        conversationsMetadata={conversationsMetadata}
        onNewConversationClick={() => console.log("new conversation")}
        socket={socketIO}
      />
      <ul className="absolute bottom-0 flex right-80 gap-x-3">
        {activeBoxes?.map((item) => (
          <li key={item.id} className="w-full">
            <ChatBox
              conversationMetaData={item}
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
