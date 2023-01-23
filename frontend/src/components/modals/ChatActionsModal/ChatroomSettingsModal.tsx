import React, { useState } from "react";

import { Tab } from "@headlessui/react";
import BaseModal from "@ui/BaseModal";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import cn from "classnames";
import { IConversation, IRoom, IRoomMember } from "global/types";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";

const MemberListItem = ({ member }: { member: IRoomMember }) => {
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
              <p className="text-sm font-medium">{member.username}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const ChatroomSettingsModal = ({
  roomData,
  isOpen = false,
  onClose = () => {},
}: {
  roomData: IRoom;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);
  const searchError = false;
  const searchLoading = false;
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = roomData.members.filter((member: IRoomMember) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShouldSearch(false);
  };
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 min-h-[calc(50vh)] w-[25vw] max-h-96">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-md border">
            {["Room Preferences", "Room members"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  cn(
                    "w-full rounded-lg py-2.5 text-md font-medium leading-5 cursor-pointer",
                    {
                      " ring-1 ring-primary/90 cursor-default ring-offset-1 text-primary bg-white shadow":
                        selected,
                      "text-gray-400 hover:bg-white/[0.12] hover:text-gray-600":
                        !selected,
                      "rounded-r-sm": tab === "Room Preferences",
                      "rounded-l-sm": tab === "Room members",
                    }
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <div className="flex flex-row gap-y-4">
                <h1 className="text-gray-800 font-bold">{roomData.name}</h1>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div>
                <h2 className="text-2xl text-gray-800">Chatroom Members:</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log("search");
                  }}
                  className="group relative h-10 w-full"
                >
                  <label className="absolute top-3 left-3 flex items-center justify-center text-gray-400">
                    <button
                      type="submit"
                      className="h-full w-full cursor-default"
                    >
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
                    searchResults?.map((member: IRoomMember, index: number) => (
                      <MemberListItem key={index} member={member} />
                    ))}
                  {searchLoading &&
                    [...new Array(6)].map((i) => (
                      <UserListItemLoading key={i} />
                    ))}
                  {!searchError && searchResults?.length === 0 && (
                    <p className="py-10 text-center text-gray-400">
                      No results found
                    </p>
                  )}
                </ul>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BaseModal>
  );
};

export const ChatdmSettingsModal = ({
  conversationData,
  roomData,
  isOpen = false,
  onClose = () => {},
}: {
  conversationData: IConversation;
  roomData: IRoom;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h1>test</h1>
    </BaseModal>
  );
};

export default ChatroomSettingsModal;
