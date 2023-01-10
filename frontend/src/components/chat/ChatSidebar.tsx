import React, { useEffect, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots, BsVolumeMute } from "react-icons/bs";
import { MdBlockFlipped } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";

import { truncateString } from "@utils/format";
import { IConversationMetaData, IFriendMetaData } from "global/types";

const SeekNewConversation = ({
  searchQuery,
  searchResults,
  setSearchResults,
  onNewConversationClick,
}: {
  searchQuery: string;
  // Omit<IConversationMetaData, "lastMessage", "lastMessageTime", "unreadMessages">[];
  searchResults: IFriendMetaData[] | IConversationMetaData[];
  setSearchResults: React.Dispatch<
    React.SetStateAction<IFriendMetaData[] | IConversationMetaData[]>
  >;
  onNewConversationClick: () => void;
}) => {
  useEffect(() => {
    const fetchFriends = async () => {
      // const resp = await fetch(`/api/friends/search?query=${searchQuery}`);
      // const data = await resp.json();
      // setSearchResults([
      //   {
      //     id: "414111",
      //     avatar_url: "https://martinfowler.com/mf.jpg",
      //     name: "Michael Scott",
      //   },
      // ]);
    };
    if (searchQuery) fetchFriends();
  }, [searchQuery, setSearchResults]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-8">
      <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
        <AiOutlineUserAdd className="text-2xl text-gray-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-gray-500">
        {searchResults?.length === 0 && <span>No results found</span>}
      </h1>
      {searchResults?.length > 0 && (
        <button
          onClick={onNewConversationClick}
          className="flex items-center justify-center px-4 py-2 mt-4 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700"
        >
          <SlArrowDown className="mr-2" />
          New Conversation
        </button>
      )}
    </div>
  );
};

const ConversationMetadata = ({
  avatar,
  name,
  lastMessage,
  lastMessageTime,
  unreadMessages,
  onConversationClick,
  onMuteClick,
  onBlockClick,
  socket,
}: {
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadMessages: number;
  onConversationClick: () => void;
  onMuteClick: () => void;
  onBlockClick: () => void;
  socket: any;
}) => {
  return (
    <div
      onClick={onConversationClick}
      className="flex items-center justify-between w-full px-3 pt-2 pb-1 border-b border-gray-200 cursor-pointer hover:bg-slate-200"
    >
      <div className="group w-full cursor-pointer">
        <div className="flex items-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}${avatar}`}
            alt={`${name} avatar`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col w-full ml-2">
            <div className="flex justify-between w-full h-7">
              <h1 className="text-sm font-semibold">{name}</h1>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-xs text-gray-500 group-hover:hidden">
                  {new Date(lastMessageTime).toDateString()}
                </h1>
                {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
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
              {lastMessage && truncateString(lastMessage, 32)}
            </p>
          </div>
        </div>
        <div className="flex justify-end h-4 mt-1">
          {unreadMessages > 0 && (
            <div className="flex items-center justify-center w-4 h-full bg-red-500 rounded-full">
              <p className="text-xs text-white">{unreadMessages}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatSidebar = ({
  showChatSidebar,
  conversationsMetadata,
  onConversationClick,
  onNewConversationClick,
  setShowChatSidebar,
  socket,
}: {
  showChatSidebar: boolean;
  conversationsMetadata: IConversationMetaData[];
  onConversationClick: (convMetaData: any) => void;
  onNewConversationClick: () => void;
  setShowChatSidebar: (showChatSidebar: boolean) => void;
  socket: any;
}) => {
  const [searchQuery, setsearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    IConversationMetaData[] | IFriendMetaData[]
  >([]);

  useEffect(() => {
    setSearchResults(
      conversationsMetadata.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, conversationsMetadata]);

  const allUnreadMessages = 5;
  return (
    <div
      className={cn(
        "transition-height ease-in-out delay-150 flex flex-col w-72 items-center bg-white border border-gray-300 overflow-hidden shadow-lg rounded-t-2xl",
        {
          "h-[calc(100vh-32vh)]": showChatSidebar,
          "h-14": !showChatSidebar,
        }
      )}
    >
      <div
        onClick={() => setShowChatSidebar(!showChatSidebar)}
        className="flex items-center justify-between w-full p-3 border-b cursor-pointer "
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
        className={cn("w-full overflow-y-scroll no-scrollbar", {
          block: showChatSidebar,
          hidden: !showChatSidebar,
        })}
      >
        <div className="flex items-center justify-between w-full p-2">
          <input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <AiOutlineUserAdd
            className="h-8 p-1 ml-2 duration-300 rounded-full cursor-pointer bg-slate-300 hover:bg-slate-400 w-9"
            onClick={onNewConversationClick}
          />
        </div>
        {searchResults && searchResults.length > 0 && searchQuery.length > 0 ? (
          searchResults.map((item) => (
            <ConversationMetadata
              key={item.id}
              avatar={item.avatarUrl}
              onConversationClick={() => onConversationClick(item)}
              name={item.name}
              lastMessage={item.lastMessage}
              lastMessageTime={item.lastMessageTime}
              unreadMessages={item.unreadMessagesCount}
              onMuteClick={() => {}}
              onBlockClick={() => {}}
              socket={socket}
            />
          ))
        ) : searchQuery.length > 0 ? (
          <SeekNewConversation
            searchQuery={searchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            onNewConversationClick={onNewConversationClick}
          />
        ) : (
          conversationsMetadata.map((item, idx) => (
            <ConversationMetadata
              key={idx}
              avatar={item.avatarUrl}
              onConversationClick={() => onConversationClick(item)}
              name={item.name}
              lastMessage={item.lastMessage}
              lastMessageTime={item.lastMessageTime}
              unreadMessages={item.unreadMessagesCount}
              onMuteClick={() => {}}
              onBlockClick={() => {}}
            />
          ))
        )}
        <div className="h-52" />
      </ul>
    </div>
  );
};

export default ChatSidebar;
