import React, { useEffect, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { BiBlock } from "react-icons/bi";
import { IoPersonRemoveOutline, IoSearchOutline } from "react-icons/io5";
import { RiVolumeMuteLine } from "react-icons/ri";

import { RoomInfo } from "@components/chat/ChatSettingsPanel";
import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";
import {
  IConversation,
  IRoom,
  IRoomMember,
  MemberGameStatus,
  MembershipStatus,
} from "global/types";

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
      <div className="flex w-full items-center justify-between gap-x-2">
        <div className="flex w-full justify-between gap-x-2">
          <div className="ml-2 flex w-full flex-row items-center justify-between ">
            <div>
              <div className="ml-2 flex w-32 items-center gap-4">
                <Image
                  src={member.avatar_url}
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
                className="h-8 w-8 rounded-full bg-gray-200 p-1 text-2xl text-red-800 duration-300 hover:bg-gray-300"
              />
              <BiBlock
                onClick={handleBlock}
                className="h-8 w-8 rounded-full bg-gray-200 p-1 text-2xl text-red-800 duration-300 hover:bg-gray-300"
              />
              {CurrentUser.membershipStatus === MembershipStatus.OWNER && (
                <IoPersonRemoveOutline
                  onClick={handleKick}
                  className="h-8 w-8 rounded-full bg-gray-200 p-1 text-2xl text-red-800 duration-300 hover:bg-gray-300"
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
  const [searchResults, setSearchResults] = useState([]);
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

  const getRoomMembers = async () => {
    const resp = await basicFetch.get(`/chat/room/${roomData.room_id}/members`);

    if (resp.status == 200) {
      return await resp.json();
    }
    return [];
  };

  useEffect(() => {
    getRoomMembers().then((data) => {
      setSearchResults(data);
    });
  }, [true]);

  const RoomMembers = () => {
    return (
      <div className="h-2/3 p-8">
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
              <IoSearchOutline className="h-6 w-6 text-gray-400 group-focus-within:text-secondary group-hover:text-secondary" />
            </button>
          </label>
          <TextInput
            name="search"
            placeholder="Search for a member"
            onChange={(e) => handleSearchChange(e)}
            inputClassName="pl-12 py-[8px] "
          />
        </form>
        <ul className="no-scrollbar mt-4 flex h-[calc(60vh-160px)] flex-col gap-y-1 overflow-y-scroll scroll-smooth">
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
        <div className="flex h-1/3 items-center justify-between">
          {CurrentUser.membershipStatus === MembershipStatus.OWNER && (
            <RoomInfo roomData={roomData} />
          )}
        </div>
        <RoomMembers />
      </div>
      <div className="flex w-full flex-row items-center justify-around pb-4">
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
