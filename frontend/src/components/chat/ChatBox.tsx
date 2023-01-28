import React, { useCallback, useEffect, useRef, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

import ChatroomSettingsModal from "@components/modals/chat/ChatroomSettingsModal";
import { ChatdmSettingsModal } from "@components/modals/chat/ChatroomSettingsModal";
import basicFetch from "@utils/basicFetch";
import {
  IConversation,
  IMessage,
  IRoom,
  MemberGameStatus,
  MembershipStatus,
  RoomType,
} from "global/types";

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
          <span className={cn("inline-block px-4 py-2", {})}>
            {message.split("\n").map((item, key) => (
              <span key={key}>
                {item}
                <br />
              </span>
            ))}
          </span>
        </div>
      </div>
      <Image
        src={senderAvatar || "/public/images/default_avatar.jpg"}
        alt="Sender Avatar"
        width={24}
        height={24}
        className="rounded-full bg-red-400"
      />
    </div>
  </li>
);

// ** Example of the message object
// const sampleWholeConversation = {
//   id: "1",
//   members: [
//     {
//       id: "1",
//       name: "John Doe",
//       avatarUrl: "https://martinfowler.com/mf.jpg",
//     },
//     {
//       id: "2",
//       name: "Mike Doe",
//       avatarUrl: "https://martinfowler.com/mf.jpg",
//     },
//   ],
//   messages: [
//     {
//       id: "1",
//       senderId: "1",
//       text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quodZ.",
//       time: "12:00",
//     },
//   ],
// };

const ChatBox = ({
  conversationMetaData,
  onClose,
  socket,
  setConversationsMetadata,
  allConversation,
}: {
  conversationMetaData: any;
  onClose: any;
  socket: any;
  setConversationsMetadata: () => void;
  allConversation: any;
}) => {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [input, setInput] = useState("");
  const bottomDiv = useRef<HTMLDivElement>(null);
  const [ShowChatSettingModal, setShowChatSettingModal] = useState(false);

  const [conversationData, setConversationData] = useState<IConversation>();
  // --------------- room data sample ----------------
  const [roomData, setRoomData] = useState<IRoom>({
    id: 1,
    name: "Spagueeetti",
    description: "this is a testing room",
    avatar_url: "/public/images/default-avatar.jpg",
    type: RoomType.PUBLIC,
    created_at: new Date(),
    members: [
      {
        id: 1,
        username: "mbif",
        avatar_url: "/public/images/default_avatar.jpg",
        isOnline: true,
        gameStatus: MemberGameStatus.IDLE,
        membershipStatus: MembershipStatus.MODERATOR,
        isBanned: false,
        isMuted: false,
        mutedUntil: new Date(),
      },
      {
        id: 2,
        username: "tetetet",
        avatar_url: "/public/images/default_avatar.jpg",
        isOnline: true,
        gameStatus: MemberGameStatus.IDLE,
        membershipStatus: MembershipStatus.OWNER,
        isBanned: false,
        isMuted: false,
        mutedUntil: new Date(),
      },
    ],
    // updated_at: Date;
  });
  // ------------------------------ // ------------------------------ //
  const handleSendMessage = React.useCallback(
    (e: any) => {
      e.preventDefault();
      if (!input || input.length > 1000 || input.trim() === "") return;
      socket.emit(
        "createMessage",
        { roomId: conversationMetaData.room_id, message: input },
        (msg) => {
          if (msg.status != 200) return;
          msg.data.isMe = true;
          setConversation((state) => {
            return { ...state, messages: [...state?.messages, msg.data] };
          });
        }
      );
      setInput("");
      // send message
    },
    [input]
  );
  // scroll to bottom
  const scrollToBottom = () => {
    bottomDiv?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // on Enter keydown
  // make it a callback to avoid infinite loop
  const handleKeyDown = React.useCallback(
    (event: any) => {
      // if only enter key is pressed without shift key
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage(event);
      }
    },
    [handleSendMessage]
  );

  const loadMembers = useCallback(async () => {
    const data = await basicFetch.get(
      `/chat/room/${conversationMetaData.room_id}/members`
    );

    if (data.status == 200) {
      return await data.json();
    } else return [];
  }, [conversationMetaData.room_id]);

  const loadMembersRef = useRef(false);

  const loadMessages = useCallback(async () => {
    const res = await basicFetch.get(
      `/chat/room/${conversationMetaData.room_id}/messages`
    );
    if (res.status == 200) {
      return await res.json();
    }
    return [];
  }, [conversationMetaData.room_id]);

  const setSocketEvents = () => {
    socket.on("createMessage", (msg) => {
      if (conversationMetaData.room_id == msg.roomId)
        setConversation((state) => {
          return { ...state, messages: [...state?.messages, msg] };
        });
    });

    if (conversationMetaData.user_id != -1)
      socket.emit(
        "joinRoom",
        {
          roomId: conversationMetaData.room_id,
          userId: conversationMetaData.user_id,
        },
        (res) => {
          if (res.status != 200) return;
        }
      );
  };
  useEffect(() => {
    const textarea = document.getElementById("textarea");
    textarea?.addEventListener("keydown", handleKeyDown);

    const prepareData = async () => {
      try {
        const messages = await loadMessages();
        const members = await loadMembers();

        setConversation({
          id: conversationMetaData.room_id,
          members,
          messages,
        });
      } catch (error) {}
      // console.log(conversation);
    };

    if (loadMembersRef.current) return;
    loadMembersRef.current = true;

    prepareData();
    setSocketEvents();

    return () => {
      textarea?.removeEventListener("keydown", handleKeyDown);
      //   socket.off("createMessage");
    };
  }, [handleKeyDown, conversationMetaData.room_id, loadMessages, loadMembers]);
  socket.on("block", (resp) => {
    const newState = [...allConversation];

    console.log({ resp });
    newState.forEach((item) => {
      if (item.user_id == conversationMetaData.user_id) {
        item.amIBlocked = resp.data.value;
      }
      console.log({ newState });
      setConversationsMetadata(newState);
    });
  });
  return (
    <section className="relative flex h-[500px] w-[340px] flex-col rounded-t-xl border border-gray-200 bg-white">
      <div className="flex justify-between border-b-2 border-gray-200 p-3 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute bottom-0 right-0 text-green-500">
              <svg width="16" height="16">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <Image
              src={
                conversationMetaData?.avatar_url ||
                "/public/images/default_avatar.jpg"
              }
              alt={`${conversationMetaData?.name || "User"}'s avatar`}
              width={40}
              height={40}
              className="rounded-full sm:h-16 sm:w-16"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="mt-1 flex items-center text-2xl">
              <span className="mr-3 text-gray-700">
                {conversationMetaData.name}
              </span>
            </div>
          </div>
        </div>
        <span
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer rounded-full p-1 text-gray-400 duration-300 hover:bg-gray-200 hover:text-slate-600"
        >
          <RxCross2 className="h-5 w-5" />
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setShowChatSettingModal(true);
            console.log("clicked");
          }}
          className="absolute top-3 right-10 cursor-pointer rounded-full p-1 text-gray-400 duration-300 hover:bg-gray-200 hover:text-slate-600"
        >
          <BsThreeDots className="h-5 w-5" />
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setShowChatSettingModal(true);
            console.log("clicked");
          }}
          className="absolute top-3 right-10 cursor-pointer rounded-full p-1 text-gray-400 duration-300 hover:bg-gray-200 hover:text-slate-600"
        >
          <BsThreeDots className="h-5 w-5" />
        </span>
      </div>
      <div className="flex h-full flex-col justify-items-stretch overflow-hidden">
        <ul
          id="messages"
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="scrolling-touch scrollbar-thumb scrollbar-thumb-rounded scrollbar-track scrollbar-w-2 flex h-full flex-col space-y-4 overflow-y-scroll p-3"
        >
          {conversation?.messages?.map((message: IMessage, index: number) => (
            <Message
              key={`message-${message.id}-${index}`}
              message={message.message}
              senderAvatar={
                // conversation.members[0]?.avatar_url ||
                message?.avatar_url || "/images/default-avatar.jpg"
              }
              isMe={message.isMe}
            />
          ))}
          <div ref={bottomDiv}></div>
        </ul>
        {/* inputa */}
        <div className="w-full border-gray-200 p-3 sm:mb-0">
          <form className="relative flex" onSubmit={handleSendMessage}>
            {conversationMetaData.isBlocked ||
            conversationMetaData.amIBlocked ? (
              ""
            ) : (
              <textarea
                id="textarea"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                placeholder="Write your message!"
                className="w-full resize-none rounded-md bg-gray-200 py-3 pl-3 text-gray-600 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-gray-400"
              />
            )}
            <div>
              {conversationMetaData.isBlocked
                ? "You blocked this user"
                : conversationMetaData.amIBlocked
                ? "You cannot contact this user"
                : ""}
            </div>
          </form>
          <div className="flex justify-end py-1">
            {conversationMetaData.isBlocked ||
            conversationMetaData.amIBlocked ? (
              ""
            ) : (
              <button
                onClick={handleSendMessage}
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-3 py-1 text-white transition duration-500 ease-in-out hover:bg-blue-400 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-2 h-6 w-6 rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
        <div>
          {ShowChatSettingModal && roomData.type != "direct" && (
            <ChatroomSettingsModal
              roomData={conversationMetaData}
              isOpen={ShowChatSettingModal}
              onClose={() => setShowChatSettingModal(false)}
            />
          )}
        </div>
        <div>
          {ShowChatSettingModal && roomData.type === RoomType.DIRECT && (
            <ChatdmSettingsModal
              roomData={roomData}
              isOpen={ShowChatSettingModal}
              onClose={() => setShowChatSettingModal(false)}
            />
          )}
        </div>
      </div>

      <style>
        {`
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
      `}
      </style>
    </section>
  );
};

export default ChatBox;
