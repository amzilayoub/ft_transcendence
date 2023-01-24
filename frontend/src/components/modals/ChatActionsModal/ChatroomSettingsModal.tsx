import React, { useState } from "react";

import {
  OwnerPanel,
  AdminPanel,
  MemberPanel,
} from "@components/chat/ChatSettingsPanel";
import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import cn from "classnames";
import {
  IConversation,
  IRoom,
  IRoomMember,
  MemberGameStatus,
  MembershipStatus,
} from "global/types";
import Image from "next/image";
import { BiBlock } from "react-icons/bi";
import { IoPersonRemoveOutline, IoSearchOutline } from "react-icons/io5";
import { RiVolumeMuteLine } from "react-icons/ri";

const MemberListItem = ({ member }: { member: IRoomMember }) => {
  const CurrentUser: IRoomMember = {
    id: 1,
    username: "mbif",
    avatar_url: "https://i.imgur.com/0y0tj9X.png",
    isOnline: true,
    gameStatus: MemberGameStatus.IDLE,
    membershipStatus: MembershipStatus.MEMBER,
    isBanned: false,
    isMuted: false,
    mutedUntil: new Date(),
  };

  const handleMute = () => {
    console.log("mute");
  };

  const handleBlock = () => {
    console.log("block");
  };

  const handleKick = () => {
    console.log("kick");
  };

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
          <div className="w-full ml-2 flex flex-row justify-between items-center ">
            <div>
              <div className="ml-2 flex items-center gap-4 w-32">
                <Image
                  src={"/images/default-avatar.jpg"}
                  alt={member + " avatar"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p className="text-sm font-medium">{member.username}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">{member.membershipStatus}</p>
            </div>
            <div className="flex gap-2">
              <RiVolumeMuteLine
                onClick={handleMute}
                className="text-2xl text-red-800 bg-gray-200 hover:bg-gray-300 duration-300 rounded-full p-1 h-8 w-8"
              />
              <BiBlock
                onClick={handleBlock}
                className="text-2xl text-red-800 bg-gray-200 hover:bg-gray-300 duration-300 rounded-full p-1 h-8 w-8"
              />
              {CurrentUser.membershipStatus === MembershipStatus.OWNER && (
                <IoPersonRemoveOutline
                  onClick={handleKick}
                  className="text-2xl text-red-800 bg-gray-200 hover:bg-gray-300 duration-300 rounded-full p-1 h-8 w-8"
                />
              )}
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
  const CurrentUser: IRoomMember = {
    id: 1,
    username: "mbif",
    avatar_url: "https://i.imgur.com/0y0tj9X.png",
    isOnline: true,
    gameStatus: MemberGameStatus.IDLE,
    membershipStatus: MembershipStatus.OWNER,
    isBanned: false,
    isMuted: false,
    mutedUntil: new Date(),
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShouldSearch(false);
  };

  const RoomMembers = () => {
    return (
      <div className="p-8 h-2/3">
        <h2 className="text-2xl font-bold">Room Members</h2>
        <div className="h-px bg-gray-200 " />
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
            searchResults?.map((member: IRoomMember, index: number) => (
              <MemberListItem key={index} member={member} />
            ))}
          {searchLoading &&
            [...new Array(6)].map((i) => <UserListItemLoading key={i} />)}
          {!searchError && searchResults?.length === 0 && (
            <p className="py-10 text-center text-gray-400">No results found</p>
          )}
        </ul>
      </div>
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Save");
  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonText("Saving...");
    // Make API call or perform other logic here
    setTimeout(() => {
      setIsLoading(false);
      setButtonText("Save");
      console.log("data saved successfully");
    }, 2000);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className=" max-h-[1000px] w-[800px]">
        <div className="flex justify-between items-center h-1/3">
          {CurrentUser.membershipStatus === MembershipStatus.OWNER && (
            <OwnerPanel roomData={roomData} />
          )}
          {CurrentUser.membershipStatus === MembershipStatus.MODERATOR && (
            <AdminPanel roomData={roomData} />
          )}
          {CurrentUser.membershipStatus === MembershipStatus.MEMBER && (
            <MemberPanel roomData={roomData} />
          )}
        </div>
        <RoomMembers />
      </div>
      <div className="w-full flex flex-row justify-around items-center pb-4">
        <Button variant="danger">Delete Room</Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
          onClick={handleSave}
        >
          {buttonText}
        </Button>
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
