import React, { useEffect, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots, BsVolumeMute } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";
import { RiMailAddLine } from "react-icons/ri";
import { SlArrowDown } from "react-icons/sl";

import ChatActionsModal from "@components/modals/ChatActionsModal";
import TextInput from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";
import { truncateString } from "@utils/format";
import { IConversationMetaData, IFriendMetaData } from "global/types";

const conversationsMetadataSample: IConversationMetaData[] = [
  {
    id: 1,
    avatar_url: "https://martinfowler.com/mf.jpg",
    name: "Michael Scott",
    lastMessage: "Hello",
    lastMessageTime: new Date(),
    unreadMessages: 0,
    type: "dm",
    userId: 1,
    muted: false,
    isBlocked: false,
  },
];

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
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <AiOutlineUserAdd className="text-2xl text-gray-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-gray-500">
        {searchResults?.length === 0 && <span>No results found</span>}
      </h1>
      {searchResults?.length > 0 && (
        <button
          onClick={onNewConversationClick}
          className="mt-4 flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
  type,
  id,
  userId,
  muted,
  isBlocked,
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
  type: string;
  id: number;
  userId: number;
  muted: boolean;
  isBlocked: boolean;
}) => {
  return (
    <div
      onClick={onConversationClick}
      className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 px-3 pt-2 pb-1 hover:bg-slate-200"
    >
      <div className="group w-full cursor-pointer">
        <div className="flex items-center">
          <Image
            src={`${avatar}`}
            alt={`${name} avatar`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-2 flex w-full flex-col">
            <div className="flex h-7 w-full justify-between">
              <h1 className="text-sm font-semibold">{name}</h1>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-xs text-gray-500 group-hover:hidden">
                  {new Date(lastMessageTime).toDateString()}
                </h1>
                {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                {type == "dm" ? (
                  <div className="group/dots relative hidden h-7 w-7 items-center justify-center text-xs duration-200 hover:bg-gray-300 group-hover:flex">
                    <BsThreeDots />
                    <div className="absolute top-0 right-0 hidden w-full min-w-min flex-col overflow-hidden rounded-l-lg bg-white group-hover/dots:flex">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onMuteClick(!muted);
                        }}
                        className="flex w-full min-w-min items-center gap-x-2 bg-white px-4 py-2 font-semibold text-red-500 hover:bg-gray-100 hover:text-red-500"
                      >
                        <BsVolumeMute />
                        {muted ? "Unmute" : "Mute"}
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onBlockClick(isBlocked);
                        }}
                        className="flex min-w-min items-center gap-x-2 px-4 py-2 font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <MdBlockFlipped />
                        {isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {lastMessage && truncateString(lastMessage, 32)}
            </p>
          </div>
        </div>
        <div className="mt-1 flex h-4 justify-end">
          {unreadMessages > 0 && (
            <div className="flex h-full w-4 items-center justify-center rounded-full bg-red-500">
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
  setConversationsMetadata,
}: {
  showChatSidebar: boolean;
  conversationsMetadata: IConversationMetaData[];
  onConversationClick: (convMetaData: any) => void;
  onNewConversationClick: () => void;
  setShowChatSidebar: (showChatSidebar: boolean) => void;
  socket: any;
  setConversationsMetadata: () => void;
}) => {
  const [searchQuery, setsearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    IConversationMetaData[] | IFriendMetaData[]
  >([]);
  const [showChatActionsModal, setShowChatActionsModal] = useState(false);

  const loadSearch = async () => {
    if (searchQuery == "") return;
    let res = await basicFetch.get(`/chat/room/search/${searchQuery}`);

    if (res.status == 200) {
      return await res.json();
    }
    throw new Error("Error In loadSearch");
  };

  useEffect(() => {
    const setSearchData = async () => {
      // const data = await loadSearch();
      setSearchResults(await loadSearch());
    };
    setSearchData();
  }, [searchQuery, conversationsMetadata]);

  const muteUser = async (roomId: number, userId: number, muted: boolean) => {
    const resp = await basicFetch.post(
      "/chat/room/mute",
      {},
      {
        roomId: roomId,
        userId: userId,
        muted,
      }
    );
    if (resp.status == 200) {
      const data = await resp.json();
    }
  };

  /*
   ** @param status true it means block, false unblock
   */
  const changeBlockStatus = async (blockedUserId: number, status: boolean) => {
    let uri = "/chat/room/";
    if (status == false) uri += "block";
    else uri += "unblock";
    const resp = await basicFetch.post(
      uri,
      {},
      {
        blockedUserId: blockedUserId,
      }
    );
    if (resp.status == 200) {
      const data = await resp.json();
    }
  };
  const allUnreadMessages = 0;
  return (
    <>
      <div
        className={cn(
          "transition-height ease-in-out delay-150 flex flex-col w-[360px] items-center bg-white border border-gray-300 overflow-hidden shadow-lg shadow-gray-400 rounded-t-2xl",
          {
            "h-[calc(100vh-32vh)]": showChatSidebar,
            "h-14": !showChatSidebar,
          }
        )}
      >
        <div
          onClick={() => setShowChatSidebar(!showChatSidebar)}
          className="flex w-full cursor-pointer items-center justify-between border-b p-3 "
        >
          <p className="font-semibold ">Messages</p>
          <div className="flex items-center justify-between gap-x-2">
            <div className="flex justify-end">
              {allUnreadMessages > 0 && (
                <div className="flex h-4 w-4 cursor-default items-center justify-center rounded-full bg-red-500">
                  <p className="text-xs text-white">{allUnreadMessages}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-x-2 ">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChatActionsModal(true);
                }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full duration-200 hover:bg-gray-200"
              >
                <RiMailAddLine className={cn("")} />
              </button>
              <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full duration-200 hover:bg-gray-200">
                <SlArrowDown
                  className={cn({
                    "transform rotate-180": !showChatSidebar,
                  })}
                />
              </button>
            </div>
          </div>
        </div>
        <ul
          className={cn("w-full overflow-y-scroll no-scrollbar", {
            block: showChatSidebar,
            hidden: !showChatSidebar,
          })}
        >
          <div className=" px-3 py-2">
            <div className="group relative h-10 w-full">
              <label className="absolute top-3 left-3 flex items-center justify-center text-gray-400">
                <button type="submit" className="h-full w-full cursor-default">
                  <IoSearchOutline className="h-6 w-6 text-gray-400 group-focus-within:text-secondary group-hover:text-secondary" />
                </button>
              </label>
              <TextInput
                value={searchQuery}
                onChange={(e) => setsearchQuery(e.target.value)}
                placeholder="Search conversations"
                inputClassName="pl-12 py-[8px] "
              />
            </div>
          </div>
          {searchResults &&
          searchResults.length > 0 &&
          searchQuery.length > 0 ? (
            searchResults.map((item) => (
              <ConversationMetadata
                key={item.id}
                avatar={item.avatar_url}
                onConversationClick={() => onConversationClick(item)}
                name={item.name}
                lastMessage={item.lastMessage}
                lastMessageTime={item.lastMessageTime}
                unreadMessages={item.unreadMessagesCount}
                onMuteClick={async (muted) => {
                  await muteUser(item.room_id, item.user_id, muted);
                  setConversationsMetadata((state) => {
                    let newState = [...state];

                    newState.forEach((obj) => {
                      if (obj.id == item.id) {
                        obj.muted = muted;
                      }
                    });
                    return newState;
                  });
                }}
                onBlockClick={async (status) => {
                  await changeBlockStatus(item.user_id, status);
                  setConversationsMetadata((state) => {
                    let newState = [...state];

                    newState.forEach((obj) => {
                      if (obj.id == item.id) {
                        obj.is_blocked = !status;
                      }
                    });
                    return newState;
                  });
                }}
                socket={socket}
                type={item.type}
                id={item.room_id}
                userId={item.user_id}
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
            conversationsMetadataSample.map((item, idx) => (
              <ConversationMetadata
                key={idx}
                avatar={item.avatar_url}
                onConversationClick={() => onConversationClick(item)}
                name={item.name}
                lastMessage={item.lastMessage}
                lastMessageTime={item.lastMessageTime}
                unreadMessages={item.unreadMessagesCount}
                muted={item.muted}
                onMuteClick={async (muted) => {
                  await muteUser(item.room_id, item.user_id, muted);
                  setConversationsMetadata((state) => {
                    let newState = [...state];

                    newState.forEach((obj) => {
                      if (obj.id == item.id) {
                        obj.muted = muted;
                      }
                    });
                    return newState;
                  });
                }}
                onBlockClick={async (status) => {
                  await changeBlockStatus(item.user_id, status);
                  setConversationsMetadata((state) => {
                    let newState = [...state];

                    newState.forEach((obj) => {
                      if (obj.id == item.id) {
                        obj.is_blocked = !status;
                      }
                    });
                    return newState;
                  });
                }}
                socket={socket}
                type={item.type}
                id={item.room_id}
                userId={item.user_id}
                isBlocked={item.is_blocked}
              />
            ))
          )}
          <div className="h-52" />
        </ul>
      </div>
      {showChatActionsModal && (
        <ChatActionsModal
          isOpen={showChatActionsModal}
          onClose={() => setShowChatActionsModal(false)}
          socket={socket}
          // onMuteClick={onMuteClick}
          // onBlockClick={onBlockClick}
        />
      )}
    </>
  );
};

export default ChatSidebar;
