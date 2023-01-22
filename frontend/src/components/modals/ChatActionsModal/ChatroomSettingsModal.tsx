import React, { useState } from "react";

import BaseModal from "@ui/BaseModal";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import cn from "classnames";
import { IConversationMetaData } from "global/types";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";

const MemberListItem = ({ member }: { member: string }) => {
  return (
    <li
      className={cn(
        "group flex items-center cursor-pointer rounded-lg border border-gray-200 justify-between p-4 hover:bg-gray-50 duration-150",
        {
          // "border-red-300": room.am_i_blocked, //tmp
        }
      )}
    >
      <div className="flex items-center gap-x-2 justify-between w-full">
        <div className="w-full flex justify-between gap-x-2">
          <div className="ml-2 flex justify-between items-center">
            <Image
              src={"/images/default-avatar.jpg"}
              alt={member + " avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-2">
              <p className="text-sm font-medium">{member}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const ChatroomSetingsModal = ({
  Metadata,
  isOpen = false,
  onClose = () => {},
}: {
  Metadata: IConversationMetaData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);
  const searchError = false;
  const searchLoading = false;
  const [searchQuery, setSearchQuery] = useState("");
  const [roomMembers, setRoomMembers] = useState<string[]>([
    "Mohamed Bifenzi",
    "Ayoub Amzil",
    "Yassine Hebbat",
    "Apex Apex",
    "Omar Magoury",
  ]);
  const searchResults = roomMembers.filter((member: string) =>
    member.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShouldSearch(false);
  };
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 min-h-[calc(60vh)] w-[20vw] max-w-6xl">
        <h2 className="text-2xl font-bold">Chatroom Settings</h2>
        <div className="h-px bg-gray-200 " />
        {Metadata.type === "group" && (
          <div className="flex flex-row justify-between">
            <h2>
              <span className="text-2xl text-gray-900">Chatroom Name:</span>
              <span className="text-2xl text-gray-900">{Metadata.name}</span>
            </h2>
          </div>
        )}
        <div>
          <h2 className="text-2xl text-gray-900">Chatroom Members:</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("search");
            }}
            className="group relative h-10 w-full"
          >
            <label className="absolute top-3 left-3 flex items-center justify-center text-gray-400">
              <button type="submit" className="h-full w-full cursor-default">
                <IoSearchOutline className="group-focus-within:text-secondary group-hover:text-secondary h-6 w-6 text-gray-400" />
              </button>
            </label>
            <TextInput
              name="search"
              placeholder="Search for a member"
              onChange={(e) => handleSearchChange(e)}
              inputClassName="pl-12 py-[8px] "
            />
          </form>
          <ul className="no-scrollbar mt-4 gap-y-1 flex flex-col overflow-y-scroll h-[calc(60vh-160px)] scroll-smooth">
            {!searchError &&
              !searchLoading &&
              searchResults &&
              searchResults?.map((member: string, index: number) => (
                <MemberListItem key={index} member={member} />
              ))}
            {searchLoading &&
              [...new Array(6)].map((i) => <UserListItemLoading key={i} />)}
            {!searchError && searchResults?.length === 0 && (
              <p className="py-10 text-center text-gray-400">
                No results found
              </p>
            )}
          </ul>
        </div>
      </div>
    </BaseModal>
  );
};

export default ChatroomSetingsModal;
