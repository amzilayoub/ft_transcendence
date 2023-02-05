import Image from "next/image";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

import DropDown from "@ui/DropDown";
import { useUIContext } from "context/ui.context";
import { truncateString } from "@utils/format";

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
  const { setIsSettingsOpen } = useUIContext();

  if (props.isLoading) {
    return (
      <div className="flex h-11 w-11 cursor-wait items-center justify-center overflow-hidden rounded-full outline-none hover:ring-1 hover:ring-secondary">
        <div className="flex animate-pulse space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      <DropDown
        menuButton={
          <div className="relative flex h-11 w-11 justify-center overflow-hidden rounded-full p-1 outline-none hover:bg-gray-100 hover:ring-1 hover:ring-secondary">
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
          className="group flex w-full cursor-pointer items-center rounded-md p-2 text-sm text-gray-700 hover:bg-secondary hover:text-white"
        >
          <CgProfile
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-secondary group-hover:text-white"
          />
          <div className="flex flex-col">
            <p className="flex items-center font-semibold ">
              <span className="text-sm">
                {truncateString(props.first_name + " " + props.last_name, 16)}
              </span>
            </p>
            <p className="flex items-center text-gray-500 hover:text-white group-hover:text-gray-300">
              @{props.username}
            </p>
          </div>
        </Link>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="group flex w-full items-center rounded-md p-2 text-sm text-gray-900 hover:bg-secondary hover:text-white"
        >
          <IoSettingsOutline
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-secondary group-hover:text-white"
          />
          Settings
        </button>
        <div
          onClick={props.onLogout}
          className="group flex w-full cursor-pointer items-center rounded-md p-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
        >
          <IoLogOutOutline
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-red-500 group-hover:text-white"
          />
          Logout
        </div>
      </DropDown>
    </>
  );
};

export default ProfileNavMenu;
