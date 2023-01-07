import React from "react";

import { useChatContext } from "context/chat.context";

import ChatBox from "./ChatBox";
import ChatSidebar from "./ChatSidebar";

const ChatStuff = () => {
  const { deleteBox, activeBoxes, activateBox, conversationsMetadata } =
    useChatContext();

  return (
    <div className="absolute bottom-0 right-0  max-h-[calc(100vh-10rem)] px-6">
      {true && (
        <ChatSidebar
          onConversationClick={activateBox}
          conversationsMetadata={conversationsMetadata}
        />
      )}
      <ul className="absolute bottom-0 flex right-80 gap-x-3">
        {activeBoxes?.map((item) => (
          <li key={item.id} className="w-full">
            <ChatBox
              conversationMetaData={item}
              onClose={() => deleteBox(item["id"])}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatStuff;
