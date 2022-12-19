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
  firstName: string;
  lastName: string;
  avatarUrl: string;
  isLoading: boolean;
  onLogout: () => void;
}

const ProfileNavMenu: React.FC<Props> = (props) => {
  if (props.isLoading) {
    return (
      <div className="hover:ring-secondary relative h-11 w-11 overflow-hidden flex justify-center rounded-full p-1 outline-none hover:bg-gray-100 hover:ring-1" />
    );
  }
  return (
    <DropDown
      menuButton={
        <div className="hover:ring-secondary relative h-11 w-11 overflow-hidden flex justify-center rounded-full p-1 outline-none hover:bg-gray-100 hover:ring-1">
          <Image
            src={props.avatarUrl || "/images/default-avatar.png"}
            alt={props.username}
            fill
            className="cursor-pointer"
          />
        </div>
      }
    >
      <Link
        href={`/u/${props.username}`}
        className="group hover:bg-secondary hover:text-white text-gray-700 flex w-full items-center rounded-md p-2 text-sm cursor-pointer"
      >
        <CgProfile
          aria-hidden="true"
          className="text-secondary mr-3 h-5 w-5 group-hover:text-white"
        />
        <div className="flex flex-col">
          <p className="flex items-center font-semibold ">
            <span className="text-sm">{props.firstName}</span>
            <span className="ml-1 text-sm">{props.lastName}</span>
          </p>
          <p className="flex items-center text-gray-500 hover:text-white group-hover:text-gray-300">
            @{props.username}
          </p>
        </div>
      </Link>
      <Link
        href="/settings"
        className="group hover:bg-secondary hover:text-white text-gray-900 flex w-full items-center rounded-md p-2 text-sm"
      >
        <IoSettingsOutline
          aria-hidden="true"
          className="text-secondary mr-3 h-5  w-5 group-hover:text-white"
        />
        Settings
      </Link>
      <li
        onClick={props.onLogout}
        className="group hover:bg-red-500 text-red-500 hover:text-white flex w-full items-center rounded-md p-2 text-sm cursor-pointer"
      >
        <IoLogOutOutline
          aria-hidden="true"
          className="text-red-500 mr-3 h-5  w-5 group-hover:text-white"
        />
        Logout
      </li>
    </DropDown>
  );
};

export default ProfileNavMenu;
