import React, { useState } from "react";

import { truncateString } from "@utils/format";
import cn from "classnames";
import { BsThreeDots } from "react-icons/bs";
import { SlArrowDown } from "react-icons/sl";

const sampleConvos = [
  {
    avatar: "https://martinfowler.com/mf.jpg",
    name: "John Doe",
    lastMessage:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    lastMessageTime: "12:00",
    unreadMessages: 1,
  },
  {
    avatar: "https://martinfowler.com/mf.jpg",
    name: "John Doe",
    lastMessage:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    lastMessageTime: "12:00",
    unreadMessages: 1,
  },
  {
    avatar: "https://martinfowler.com/mf.jpg",
    name: "John Doe",
    lastMessage:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    lastMessageTime: "12:00",
    unreadMessages: 1,
  },
  {
    avatar: "https://martinfowler.com/mf.jpg",
    name: "John Doe",
    lastMessage:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    lastMessageTime: "12:00",
    unreadMessages: 1,
  },
];

const Conversation = ({
  avatar,
  name,
  lastMessage,
  lastMessageTime,
  unreadMessages,
  onClick,
  onButtonClick,
}: {
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
  onClick: () => void;
  onButtonClick: () => void;
}) => {
  return (
    <div onClick={onClick} className="w-full cursor-pointer group">
      <div className="flex items-center ">
        <img
          src={avatar}
          alt={`${name} avatar`}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col w-full ml-2">
          <div className="flex justify-between w-full h-7">
            <h1 className="text-sm font-semibold">{name}</h1>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-xs text-gray-500 group-hover:hidden">
                {lastMessageTime}
              </h1>
              <button
                onClick={onButtonClick}
                className="items-center justify-center hidden text-xs duration-200 rounded-full w-7 h-7 hover:bg-gray-300 group-hover:flex"
              >
                <BsThreeDots />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {truncateString(lastMessage, 20)}
          </p>
        </div>
      </div>
      <div className="flex justify-end ">
        {unreadMessages > 0 && (
          <div className="flex items-center justify-center w-4 h-4 bg-red-500 rounded-full">
            <p className="text-xs text-white">{unreadMessages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatSidebar = () => {
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const allUnreadMessages = 5;
  return (
    <div
      className={cn(
        "flex flex-col w-72  items-center h-full bg-white border border-gray-300 shadow-lg rounded-t-2xl",
        {
          "min-h-[calc(100vh-40rem)]": showChatSidebar,
        }
      )}
    >
      <div className="flex items-center justify-between w-full p-3 border-b">
        <p className="font-semibold ">Massages</p>
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex justify-end">
            {allUnreadMessages > 0 && (
              <div className="flex items-center justify-center w-4 h-4 bg-red-500 rounded-full cursor-default">
                <p className="text-xs text-white">{allUnreadMessages}</p>
              </div>
            )}
          </div>
          <div
            onClick={() => setShowChatSidebar(!showChatSidebar)}
            className="flex items-center justify-center text-xs duration-200 rounded-full cursor-pointer w-7 h-7 hover:bg-gray-200 "
          >
            <SlArrowDown
              className={cn({ "transform rotate-180": !showChatSidebar })}
            />
          </div>
        </div>
      </div>
      {showChatSidebar && (
        <ul className="w-full overflow-scroll no-scrollbar ">
          {sampleConvos.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between w-full px-3 py-2 border-b border-gray-200 hover:bg-slate-200"
            >
              <Conversation
                avatar={item.avatar}
                name={item.name}
                lastMessage={item.lastMessage}
                lastMessageTime={item.lastMessageTime}
                unreadMessages={item.unreadMessages}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatSidebar;
