import React, { useEffect, useRef, useState } from "react";

import { useChatContext } from "context/chat.context";

import ChatBox from "./ChatBox";
import ChatSidebar from "./ChatSidebar";
import { io } from "socket.io-client";
import { getToken } from "@utils/auth-token";

const ChatStuff = () => {
  const {
    deleteBox,
    activeBoxes,
    activateBox,
    conversationsMetadata,
    showChatSidebar,
    setShowChatSidebar,
  } = useChatContext();

  //   let socket = useRef(null);
  let [newMessage, setNewMessage] = useState("");
  let [socketIO, setSocketIO] = useState(null);

  useEffect(() => {
    let socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
      auth: {
        token: getToken(),
      },
    });
    setSocketIO(socket);

    return () => {
      socket.close();
    };
  }, [setSocketIO]);

  return (
    <div className="absolute bottom-0 right-0  max-h-[calc(100vh-10rem)] px-6">
      <ChatSidebar
        showChatSidebar={showChatSidebar}
        setShowChatSidebar={setShowChatSidebar}
        onConversationClick={activateBox}
        conversationsMetadata={conversationsMetadata}
        onNewConversationClick={() => console.log("new conversation")}
        socket={socketIO}
      />
      ch
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
