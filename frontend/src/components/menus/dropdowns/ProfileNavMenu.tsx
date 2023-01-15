import { useState } from "react";

import SettingsModal from "@components/modals/Settings";
import DropDown from "@ui/DropDown";
import Image from "next/image";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

/**
 * TODO:
 * - Make it more flexible and (customizable?)
 */

interface Props {
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  isLoading: boolean;
  onLogout: () => void;
}

const ProfileNavMenu: React.FC<Props> = (props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  if (props.isLoading) {
    return (
      <div className="hover:ring-secondary flex items-center justify-center overflow-hidden rounded-full outline-none cursor-wait h-11 w-11 hover:ring-1">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      <DropDown
        menuButton={
          <div className="hover:ring-secondary relative flex justify-center p-1 overflow-hidden rounded-full outline-none h-11 w-11 hover:bg-gray-100 hover:ring-1">
            <Image
              src={props.avatar_url || "/images/default-avatar.jpg"}
              alt={props.username}
              fill
              className="cursor-pointer object-cover"
            />
          </div>
        }
      >
        <Link
          href={`/u/${props.username}`}
          className="group hover:bg-secondary flex items-center w-full p-2 text-sm text-gray-700 rounded-md cursor-pointer hover:text-white"
        >
          <CgProfile
            aria-hidden="true"
            className="text-secondary w-5 h-5 mr-3 group-hover:text-white"
          />
          <div className="flex flex-col">
            <p className="flex items-center font-semibold ">
              <span className="text-sm">{props.first_name}</span>
              <span className="ml-1 text-sm">{props.last_name}</span>
            </p>
            <p className="flex items-center text-gray-500 hover:text-white group-hover:text-gray-300">
              @{props.username}
            </p>
          </div>
        </Link>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="group hover:bg-secondary flex items-center w-full p-2 text-sm text-gray-900 rounded-md hover:text-white"
        >
          <IoSettingsOutline
            aria-hidden="true"
            className="text-secondary w-5 h-5 mr-3 group-hover:text-white"
          />
          Settings
        </button>
        <div
          onClick={props.onLogout}
          className="group flex items-center w-full p-2 text-sm text-red-500 rounded-md cursor-pointer hover:bg-red-500 hover:text-white"
        >
          <IoLogOutOutline
            aria-hidden="true"
            className="w-5 h-5 mr-3 text-red-500 group-hover:text-white"
          />
          Logout
        </div>
      </DropDown>
      {isSettingsOpen && (
        <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
};

export default ProfileNavMenu;
