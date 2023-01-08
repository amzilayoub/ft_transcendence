import Image from "next/image";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

import DropDown from "@ui/DropDown";

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
  if (props.isLoading) {
    return (
      <div className="flex items-center justify-center overflow-hidden rounded-full outline-none cursor-wait hover:ring-secondary h-11 w-11 hover:ring-1">
        <svg
          className="animate-spin text-secondary/70"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }
  return (
    <DropDown
      menuButton={
        <div className="relative flex justify-center p-1 overflow-hidden rounded-full outline-none hover:ring-secondary h-11 w-11 hover:bg-gray-100 hover:ring-1">
          <Image
            src={props.avatar_url || "/images/default-avatar.png"}
            alt={props.username}
            fill
            className="cursor-pointer"
          />
        </div>
      }
    >
      <Link
        href={`/u/${props.username}`}
        className="group flex items-center w-full p-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-secondary hover:text-white"
      >
        <CgProfile
          aria-hidden="true"
          className="w-5 h-5 mr-3 text-secondary group-hover:text-white"
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
      <Link
        href="/settings"
        className="group flex items-center w-full p-2 text-sm text-gray-900 rounded-md hover:bg-secondary hover:text-white"
      >
        <IoSettingsOutline
          aria-hidden="true"
          className="w-5 h-5 mr-3 text-secondary group-hover:text-white"
        />
        Settings
      </Link>
      <li
        onClick={props.onLogout}
        className="group flex items-center w-full p-2 text-sm text-red-500 rounded-md cursor-pointer hover:bg-red-500 hover:text-white"
      >
        <IoLogOutOutline
          aria-hidden="true"
          className="w-5 h-5 mr-3 text-red-500 group-hover:text-white"
        />
        Logout
      </li>
    </DropDown>
  );
};

export default ProfileNavMenu;
