import React, { useState } from "react";

import cn from "classnames";
import { BsThreeDots, BsVolumeMute } from "react-icons/bs";
import { MdBlockFlipped } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";

import { truncateString } from "@utils/format";
import { IConversationMetaData } from "global/types";

const Conversation = ({
  avatar,
  name,
  lastMessage,
  lastMessageTime,
  unreadMessages,
  onConversationClick,
  onMuteClick,
  onBlockClick,
}: {
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
  onConversationClick: () => void;
  onMuteClick: () => void;
  onBlockClick: () => void;
}) => {
  return (
    <div onClick={onConversationClick} className="group w-full cursor-pointer">
      <div className="flex items-center">
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
              <div className="group/dots relative items-center justify-center hidden text-xs duration-200 w-7 h-7 hover:bg-gray-300 group-hover:flex">
                <BsThreeDots />
                <div className="absolute top-0 right-0 flex-col hidden w-full overflow-hidden bg-white rounded-l-lg min-w-min group-hover/dots:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMuteClick();
                    }}
                    className="flex items-center w-full px-4 py-2 font-semibold text-red-500 bg-white gap-x-2 hover:text-red-500 hover:bg-gray-100 min-w-min"
                  >
                    <BsVolumeMute />
                    Mute
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBlockClick();
                    }}
                    className="flex items-center px-4 py-2 font-semibold text-red-600 gap-x-2 hover:text-white hover:bg-red-500 min-w-min"
                  >
                    <MdBlockFlipped />
                    Block
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {truncateString(lastMessage, 32)}
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

const ChatSidebar = ({
  conversations,
  onConversationClick,
}: {
  conversations: IConversationMetaData[];
  onConversationClick: (convoId: string) => void;
}) => {
  const [showChatSidebar, setShowChatSidebar] = useState(true);

  const allUnreadMessages = 5;
  return (
    <div
      className={cn(
        "flex flex-col w-72 items-center bg-white border border-gray-300 overflow-hidden shadow-lg rounded-t-2xl",
        {
          "h-[calc(100vh-32vh)]": showChatSidebar,
        }
      )}
    >
      <div
        onClick={() => setShowChatSidebar(!showChatSidebar)}
        className="flex cursor-pointer items-center justify-between w-full p-3 border-b "
      >
        <p className="font-semibold ">Messages</p>
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex justify-end">
            {allUnreadMessages > 0 && (
              <div className="flex items-center justify-center w-4 h-4 bg-red-500 rounded-full cursor-default">
                <p className="text-xs text-white">{allUnreadMessages}</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center text-xs duration-100 rounded-full cursor-pointer w-7 h-7 hover:bg-gray-200 ">
            <SlArrowDown
              className={cn({ "transform rotate-180": !showChatSidebar })}
            />
          </div>
        </div>
      </div>
      <ul
        className={cn("w-full overflow-y-scroll ", {
          block: showChatSidebar,
          hidden: !showChatSidebar,
        })}
      >
        {conversations.map((item, idx) => (
          <li
            key={idx}
            onClick={() => onConversationClick(item.id)}
            className="flex items-center justify-between cursor-pointer w-full px-3 py-3.5 border-b border-gray-200 hover:bg-slate-200"
          >
            <Conversation
              avatar={item.avatarUrl}
              onConversationClick={() => {}}
              name={item.name}
              lastMessage={item.lastMessage}
              lastMessageTime={item.lastMessageTime}
              unreadMessages={item.unreadMessages}
              onMuteClick={() => console.log("mute clicked")}
              onBlockClick={() => console.log("block clicked")}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
