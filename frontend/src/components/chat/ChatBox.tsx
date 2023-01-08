import React, { useCallback, useEffect, useRef, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

import basicFetch from "@utils/basicFetch";
import { IConversation, IMessage } from "global/types";


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
        src={senderAvatar}
        alt="Sender Avatar"
        width={24}
        height={24}
        className="rounded-full bg-red-400"
      />
    </div>
  </li>
);

const ChatBox = ({
  conversationMetaData,
  onClose,
}: {
  conversationMetaData: any;
  onClose: any;
}) => {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [input, setInput] = useState("");
  const bottomDiv = useRef<HTMLDivElement>(null);

  const handleSendMessage = React.useCallback(
    (e: any) => {
      e.preventDefault();
      if (!input || input.length > 1000 || input.trim() === "") return;
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
      `/chat/room-members/${conversationMetaData.room_id}`
    );

    if (data.status == 200) {
      return await data.json();
    } else return [];
  }, [conversationMetaData.room_id]);

  const loadMembersRef = useRef(false);

  const loadMessages = useCallback(async () => {
    const res = await basicFetch.get(
      `/chat/messages/${conversationMetaData.room_id}`
    );
    if (res.status == 200) {
      return await res.json();
    }
    return [];
  }, [conversationMetaData.room_id]);

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

    return () => {
      textarea?.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, conversationMetaData.room_id, loadMessages, loadMembers]);
  return (
    <section className="relative flex flex-col bg-white border border-gray-200 h-[500px] rounded-t-xl w-[340px]">
      <div className="flex justify-between p-3 border-b-2 border-gray-200 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute bottom-0 right-0 text-green-500">
              <svg width="16" height="16">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <Image
              src={conversationMetaData?.avatar_url}
              alt={`${conversationMetaData?.name || "User"}'s avatar`}
              width={40}
              height={40}
              className="rounded-full sm:w-16 sm:h-16"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center mt-1 text-2xl">
              <span className="mr-3 text-gray-700">
                {conversationMetaData.name}
              </span>
            </div>
          </div>
        </div>
        <span
          onClick={onClose}
          className="absolute p-1 text-gray-400 duration-300 rounded-full cursor-pointer hover:text-slate-600 top-3 right-3 hover:bg-gray-200"
        >
          <RxCross2 className="w-5 h-5" />
        </span>
      </div>
      <div className="justify-items-stretch flex flex-col h-full overflow-hidden">
        <ul
          id="messages"
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="scrolling-touch scrollbar-thumb scrollbar-thumb-rounded scrollbar-track scrollbar-w-2 flex flex-col h-full p-3 space-y-4 overflow-y-scroll"
        >
          {conversation?.messages?.map((message: IMessage, index: number) => (
            <Message
              key={`message-${message.id}-${index}`}
              message={message.message}
              senderAvatar={
                // conversation.members[0]?.avatar_url ||
                message?.userLink?.avatar_url || "/images/default-avatar.png"
              }
              isMe={index % 2 === 0}
            />
          ))}
          <div ref={bottomDiv}></div>
        </ul>
        {/* inputa */}
        <div className="w-full p-3 border-gray-200 sm:mb-0">
          <form className="relative flex" onSubmit={handleSendMessage}>
            <textarea
              id="textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              placeholder="Write your message!"
              className="w-full py-3 pl-3 text-gray-600 bg-gray-200 rounded-md placeholder:text-gray-600 focus:outline-none focus:placeholder:text-gray-400 resize-none"
            />
          </form>
          <div className="justify-end flex py-1">
            <button
              onClick={handleSendMessage}
              type="button"
              className="inline-flex items-center justify-center px-3 py-1 text-white transition duration-500 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none"
            >
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
