import React, { useState } from "react";

import BaseModal from "@ui/BaseModal";
import TextInput from "@ui/TextInput";
import cn from "classnames";
import { IUser } from "global/types";
import Image from "next/image";

import avatar from "/public/images/default-avatar.jpg";

import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";

const users: IUser[] = [
  {
    username: "johndoe",
    first_name: "John",
    last_name: "Doe",
    twitterUsername: "johndoe",
    intraUsername: "johndoe",
    email: "johndoe@example.com",
    bio: "Software developer with a passion for open-source projects.",
    avatar_url: avatar.src,
    cover_url: avatar.src,
    is_following: true,
    is_follower: false,
    followers_count: 100,
    following_count: 50,
  },
  {
    username: "janedoe",
    first_name: "Jane",
    last_name: "Doe",
    intraUsername: "janedoe",
    email: "janedoe@example.com",
    bio: "UX designer with a focus on user research.",
    avatar_url: avatar.src,
    cover_url: avatar.src,
    is_following: false,
    is_follower: true,
    followers_count: 200,
    following_count: 25,
  },
];

const UserListItem = ({ user }: { user: IUser }) => {
  const handleAddUser = () => {
    alert("Add user");
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
                  src={user.avatar_url}
                  alt={user + " avatar"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p className="text-sm font-medium">{user.username}</p>
              </div>
            </div>
            <div>
              {user.is_following && (
                <p className="text-sm font-medium text-green-800">Following</p>
              )}
            </div>
            <div className="flex gap-2">
              <AiOutlineUsergroupAdd
                onClick={handleAddUser}
                className="h-8 w-8 rounded-full bg-gray-200 p-1 text-2xl text-blue-800 duration-300 hover:bg-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const AddUserModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [searchResults, setSearchResults] = React.useState<IUser[]>(users);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [searchLoading, setSearchLoading] = React.useState<boolean>(false);
  const [searchError, setSearchError] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const results = users.filter((user) =>
      user.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddUser = () => {
    alert("Add user");
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="h-[calc(60vh)] w-[420px] p-8">
        <h1 className="text-2xl font-bold">FriendList</h1>
        <div className="h-px w-full bg-gray-200 " />
        <form className="group relative h-10 w-full">
          <label className="absolute top-3 left-3 flex items-center justify-center text-gray-400">
            <button type="submit" className="h-full w-full cursor-default">
              <IoSearchOutline className="group-focus-within:text-secondary group-hover:text-secondary h-6 w-6 text-gray-400" />
            </button>
          </label>
          <TextInput
            name="search"
            placeholder="Search for people"
            onChange={(e) => handleSearchChange(e)}
            inputClassName="pl-12 py-[8px] "
          />
        </form>
        <ul className="no-scrollbar mt-4 flex h-[calc(60vh-160px)] w-full flex-col gap-y-1 overflow-y-scroll scroll-smooth">
          {!searchError &&
            !searchLoading &&
            searchResults?.map((user) => (
              <UserListItem user={user} key={user.username} />
            ))}
        </ul>
      </div>
    </BaseModal>
  );
};

export default AddUserModal;
