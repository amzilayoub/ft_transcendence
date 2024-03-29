import React, { useCallback, useEffect, useRef, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsThreeDots } from "react-icons/bs";
import { GrGamepad } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";

import ChatroomSettingsModal from "@components/modals/chat/ChatroomSettingsModal";
import basicFetch from "@utils/basicFetch";
import { isURL, truncateString } from "@utils/format";
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
            "items-end text-white bg-primary rounded-br-none": isMe,
            "items-start text-gray-600 bg-gray-300 rounded-bl-none": !isMe,
          }
        )}
      >
        <span className={cn("inline-block px-4 py-2", {})}>
          {message.split("\n").map((item, key) => (
            <span key={key} className="break-all">
              {isURL(item) ? (
                <a
                  href={item.replace(window.location.origin, "")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  {item}
                </a>
              ) : (
                item
              )}
              <br />
            </span>
          ))}
        </span>
      </div>

      <Image
        src={senderAvatar || "/public/images/default_avatar.jpg"}
        alt="Sender Avatar"
        width={100}
        height={100}
        className="rounded-full h-6 w-6"
      />

      {/* <div className="relative">
            <Image
              src={
                conversationMetaData?.avatar_url ||
                "/public/images/default_avatar.jpg"
              }
              alt={`${conversationMetaData?.name || "User"}'s avatar`}
              // width={showChatBox ? 44 : 32}
              // height={showChatBox ? 44 : 32}
              width={100}
              height={100}
              className={cn("rounded-full", {
                "h-10 w-10": showChatBox,
                "h-9 w-9": !showChatBox,
              })}
            /> */}
    </div>
  </li>
);

const ChatBox = ({
  conversationMetaData,
  onClose,
  socket,
  setConversationsMetadata,
  allConversation,
  onConversationClick,
  setActiveBoxes,
}: {
  conversationMetaData: any;
  onClose: any;
  socket: any;
  setConversationsMetadata: () => void;
  allConversation: any;
  onConversationClick: () => void;
  setActiveBoxes: () => {};
}) => {
  const router = useRouter();
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [input, setInput] = useState("");
  const [showChatSettingModal, setShowChatSettingModal] = useState(false);
  const [showChatBox, setShowChatBox] = useState(true);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [conversationData, setConversationData] = useState<IConversation>();
  // --------------- room data sample ----------------
  const [roomData, setRoomData] = useState<IRoom>({
    id: 1,
    name: "Spagueeetti",
    description: "this is a testing room",
    avatar_url: "/public/images/default-avatar.png",
    type: RoomType.PUBLIC,
    created_at: new Date(),
    members: [
      {
        id: 1,
        username: "mbif",
        avatar_url: "/public/images/default_avatar.jpg",
        isOnline: true,
        gameStatus: MemberGameStatus.IDLE,
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

  const handleSendMessage = React.useCallback(
    (e: any) => {
      e.preventDefault();
      if (!input) {
        var payload = e.target.value || "";
      } else {
        var payload = input;
      }
      if (!payload || payload.length > 1000 || payload.trim() === "") return;
      setInput("");
      socket?.emit(
        "createMessage",
        { roomId: conversationMetaData.room_id, message: payload },
        (msg: any) => {
          if (msg.status != 200) {
            alert(msg.message);
            return;
          }
          msg.data.isMe = true;
          setConversation((state: IConversation) => {
            return { ...state, messages: [...state?.messages, msg.data] };
          });
        }
      );
    },
    [input]
  );
  const handleSendInvite = React.useCallback(
    (e: any) => {
      e.preventDefault();
      socket?.emit(
        "sendInvite",
        { roomId: conversationMetaData.user_id, message: router.asPath },
        (msg: any) => {
          if (msg.status != 200) {
            alert(msg.message);
            return;
          }
        }
      );
    },
    [input]
  );

  useEffect(() => {
    bottomDivRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event);
    }
  };

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
    socket?.on("createMessage", (msg: any) => {
      if (msg.status == 200) {
        if (conversationMetaData.room_id == msg.data.roomId) {
          if (msg.clients.includes(socket.id)) {
            msg.data.isMe = true;
          }
          setConversation((state: IConversation) => {
            return { ...state, messages: [...state?.messages, msg.data] };
          });
        }
      } else {
        alert(msg.message);
      }
    });

    // if (conversationMetaData.user_id != -1)
    //   socket.emit(
    //     "joinRoom",
    //     {
    //       roomId: conversationMetaData.room_id,
    //       userId: conversationMetaData.user_id,
    //       action: "update",
    //     },
    //     (res) => {
    //       if (res.status != 200) return;
    //     }
    //   );
  };
  useEffect(() => {
    textareaRef.current?.addEventListener("keydown", handleKeyDown);

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
    };

    if (loadMembersRef.current) return;
    loadMembersRef.current = true;

    prepareData();
    setSocketEvents();

    return () => {
      textareaRef.current?.removeEventListener("keydown", handleKeyDown);
      //   socket.off("createMessage");
    };
  }, [conversationMetaData.room_id, loadMessages, loadMembers]);
  socket?.on("block", (resp) => {
    // const newState = [...allConversation];

    // newState.forEach((item) => {
    //   if (item.user_id == conversationMetaData.user_id) {
    //     item.amIBlocked = resp.data.value;
    //     if (item.isActiveBox) onConversationClick(item);
    //   }

    //   setConversationsMetadata(newState);
    setConversationsMetadata((state) => {
      const newState = [...state];

      newState.forEach((item) => {
        if (item.user_id == conversationMetaData.user_id) {
          item.amIBlocked = resp.data.value;
          if (item.isActiveBox) {
            setActiveBoxes((boxState) => {
              const listBox = [...boxState];
              listBox.forEach((box) => {
                if (box.room_id == conversationMetaData.user_id) {
                  item.amIBlocked = resp.data.value;
                }
              });
              return listBox;
            });
          }
        }
      });
      return newState;
    });
  });

  const checkIfUserIsWaitingForGame = () =>
    router.query?.mode && router.query.mode !== "spectate";

  return (
    <section
      className={cn(
        "relative flex flex-col rounded-t-xl border border-gray-200 bg-white shadow-md",
        {
          "transition-close-bubble w-[340px] h-[500px]": showChatBox,
          "transition-open-bubble h-12 w-[240px]": !showChatBox,
          "shadow-primary/70": conversationMetaData.type !== "dm",
        }
      )}
    >
      <div
        onClick={() => setShowChatBox(!showChatBox)}
        className={cn(
          "cursor-pointer flex justify-between border-b-2 rounded-t-xl  border-gray-200  sm:items-center h-14",
          {
            "p-3": showChatBox,
            "p-2": !showChatBox,
            "bg-primary/90": conversationMetaData.type !== "dm",
          }
        )}
      >
        {/* <div className="relative flex items-center space-x-4"> */}
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <Image
              src={
                conversationMetaData?.avatar_url || "/images/default-avatar.png"
              }
              alt={`${conversationMetaData?.name || "User"}'s avatar`}
              // width={showChatBox ? 44 : 32}
              // height={showChatBox ? 44 : 32}
              width={100}
              height={100}
              className={cn("rounded-full", {
                "h-10 w-10": showChatBox,
                "h-9 w-9": !showChatBox,
              })}
            />
          </div>
          {showChatBox && conversationMetaData.type === "dm" ? (
            <Link
              href={`/u/${conversationMetaData.name}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex flex-col leading-tight"
            >
              <p className="flex items-center text-xl">
                <span className="mr-3 text-gray-800 font-semibold text-base hover:text-gray-600 hover:underline">
                  {truncateString(conversationMetaData.name, 20)}
                </span>
              </p>
            </Link>
          ) : (
            <div className="flex flex-col leading-tight">
              <p className="flex items-center text-xl">
                <span className="mr-3 text-gray-800 font-semibold text-base ">
                  {truncateString(conversationMetaData.name, 14)}
                </span>
              </p>
            </div>
          )}
        </div>
        <span
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer rounded-full p-1 text-gray-400 duration-300 hover:bg-gray-200 hover:text-slate-600"
        >
          <RxCross2 className="h-5 w-5" />
        </span>
        {conversationMetaData.type === "dm" && checkIfUserIsWaitingForGame() && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleSendInvite(e);
            }}
            className="absolute top-3 right-10 cursor-pointer rounded-full p-1 text-gray-400 duration-300  hover:bg-gray-200 hover:text-slate-600"
          >
            <GrGamepad className="h-5 w-5" />
          </span>
        )}

        {conversationMetaData.type !== "dm" && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setShowChatSettingModal(true);
            }}
            className="absolute top-3 right-10 cursor-pointer rounded-full p-1 text-gray-400 duration-300  hover:bg-gray-200 hover:text-slate-600"
          >
            <BsThreeDots className="h-5 w-5" />
          </span>
        )}
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
                message?.avatar_url ||
                message?.senderAvatar ||
                "/images/default-avatar.png"
              }
              isMe={message.isMe}
            />
          ))}
          <div ref={bottomDivRef}></div>
        </ul>
        {/* inputa */}
        <div className="w-full border-gray-200 p-3 sm:mb-0">
          <form className="relative flex" onSubmit={handleSendMessage}>
            {(conversationMetaData.isBlocked ||
              conversationMetaData.amIBlocked) &&
            conversationMetaData.type == "dm" ? (
              ""
            ) : (
              <textarea
                id="msg_input_textarea"
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your message!"
                className="w-full resize-none rounded-md bg-gray-200 py-3 pl-3 text-gray-600 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-gray-400"
              />
            )}
            <div
              className={cn({
                "p-2 border-t w-full text-center text-red-500":
                  (conversationMetaData.isBlocked ||
                    conversationMetaData.amIBlocked) &&
                  conversationMetaData.type == "dm",
              })}
            >
              {conversationMetaData.isBlocked &&
              conversationMetaData.type == "dm"
                ? "You blocked this user"
                : conversationMetaData.amIBlocked &&
                  conversationMetaData.type == "dm"
                ? "You cannot contact this user"
                : ""}
            </div>
          </form>
          <div className="flex justify-end py-1">
            {(conversationMetaData.isBlocked ||
              conversationMetaData.amIBlocked) &&
            conversationMetaData.type == "dm" ? (
              ""
            ) : (
              <button
                onClick={(e) => {
                  handleSendMessage(e);
                  textareaRef.current?.focus();
                }}
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1 text-white transition duration-500 ease-in-out hover:bg-primary/80 focus:outline-none"
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
          {showChatSettingModal && roomData.type != "direct" && (
            <ChatroomSettingsModal
              roomData={conversationMetaData}
              isOpen={showChatSettingModal}
              onClose={() => setShowChatSettingModal(false)}
              setConversationsMetadata={setConversationsMetadata}
              onCloseActiveBox={onClose}
              socket={socket}
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
