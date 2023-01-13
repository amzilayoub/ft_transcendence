import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

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
  } = useChatContext(socketIO);

  useEffect(() => {
    let socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
      withCredentials: true, // this is needed to send cookies
    });

    setSocketIO(socket);

    return () => {
      socket.close();
    };
  }, [setSocketIO]); // a hack to stop infinite rendering

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
