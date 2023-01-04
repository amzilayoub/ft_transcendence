import React, { useState } from "react";

import cn from "classnames";
import { RxCross2 } from "react-icons/rx";

import { IConversationMetaData, IMessage } from "global/types";

const Message = ({
  message,
  isMe,
  senderAvatar,
}: {
  message: string;
  isMe: boolean;
  senderAvatar: string;
}) => (
  <li className="">
    <div
      className={cn("flex items-end", {
        "flex-row-reverse pl-6": isMe,
        "pl-0 pr-6": !isMe,
      })}
    >
      <div
        className={cn(
          "flex flex-col order-2 max-w-xs mx-2 space-y-2  text-xs  rounded-lg",
          {
            "items-end text-white bg-blue-600 rounded-br-none": isMe,
            "items-start text-gray-600 bg-gray-300 rounded-bl-none": !isMe,
          }
        )}
      >
        <div>
          <span className={cn("inline-block px-4 py-2", {})}>{message}</span>
        </div>
      </div>
      <img src={senderAvatar} className="w-6 h-6 rounded-full" />
    </div>
  </li>
);

const sampleWholeConversation = {
  id: "1",
  members: [
    {
      id: "1",
      name: "John Doe",
      avatarUrl: "https://martinfowler.com/mf.jpg",
    },
    {
      id: "2",
      name: "Mike Doe",
      avatarUrl: "https://martinfowler.com/mf.jpg",
    },
  ],
  messages: [
    {
      id: "1",
      senderId: "1",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quodZ.",
      time: "12:00",
    },
    {
      id: "2",
      senderId: "2",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
      time: "12:00",
    },
  ],
};

const ChatBox = ({
  _conversationMetadata,
  onClose,
}: {
  _conversationMetadata: IConversationMetaData;
  onClose: any;
}) => {
  const [conversation, setConversation] = useState(sampleWholeConversation);
  const [input, setInput] = useState("");

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (!input || input.trim() === "" || input.length > 1000) return;
    const newMessage: IMessage = {
      id: "123",
      senderId: "123",
      text: input,
      time: "12:00",
    };
    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMessage],
    });
    setInput("");
  };

  return (
    <section className="relative flex flex-col bg-white border border-gray-200  h-[440px] rounded-t-xl w-[340px]">
      <div className="flex justify-between p-3 border-b-2 border-gray-200 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute bottom-0 right-0 text-green-500">
              <svg width="16" height="16">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <img
              src={conversation.members[0].avatarUrl}
              alt={`${conversation.members[0].name || "User"}'s avatar`}
              className="w-10 h-10 rounded-full sm:w-16 sm:h-16"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center mt-1 text-2xl">
              <span className="mr-3 text-gray-700">
                {conversation.members[0].name}
              </span>
            </div>
          </div>
        </div>
        <span
          onClick={onClose}
          className="absolute p-1 text-gray-400 duration-300 rounded-full cursor-pointer hover:text-slate-600 top-1 right-1 hover:bg-gray-200"
        >
          <RxCross2 className="w-5 h-5" />
        </span>
      </div>

      <ul
        id="messages"
        className="scrolling-touch scrollbar-thumb scrollbar-thumb-rounded scrollbar-track scrollbar-w-2 flex flex-col h-full p-3 space-y-4 overflow-y-scroll mb-14"
      >
        {conversation.messages.map((message: IMessage, index: number) => (
          <Message
            key={`message-${message.id}-${index}`}
            message={message.text}
            senderAvatar={conversation.members[0].avatarUrl}
            isMe={index % 2 === 0}
          />
        ))}
      </ul>
      {/* inputa */}
      <div className="absolute bottom-0 w-full h-16 pt-4 mb-2 border-gray-200 sm:mb-0">
        <form className="relative flex" onSubmit={handleSendMessage}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            type="text"
            placeholder="Write your message!"
            className="w-full py-3 pl-3 text-gray-600 bg-gray-200 rounded-md placeholder:text-gray-600 focus:outline-none focus:placeholder:text-gray-400"
          />
          <div className="absolute inset-y-0 right-0 items-center hidden sm:flex">
            <button
              onClick={handleSendMessage}
              type="button"
              className="inline-flex items-center justify-center px-4 py-3 text-white transition duration-500 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none"
            >
              send
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6 ml-2 rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <style>{`
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
`}</style>
    </section>
  );
};

export default ChatBox;
