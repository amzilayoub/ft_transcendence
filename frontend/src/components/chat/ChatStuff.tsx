import React from "react";

import { useChatContext } from "context/chat.context";

import ChatBox from "./ChatBox";
import ChatSidebar from "./ChatSidebar";

const ChatStuff = () => {
  const { deleteBox, activeBoxes, activateBox, conversations } =
    useChatContext();

  return (
    <div className="absolute bottom-0 right-0  max-h-[calc(100vh-10rem)] px-6">
      {true && (
        <ChatSidebar
          onConversationClick={activateBox}
          conversations={conversations}
        />
      )}
      <ul className="absolute bottom-0 flex right-80 gap-x-3">
        {activeBoxes?.map((i) => (
          <li key={i} className="w-full">
            <ChatBox onClose={() => deleteBox(i)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatStuff;
