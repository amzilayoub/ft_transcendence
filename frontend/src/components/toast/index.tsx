import Link from "next/link";
import { ToastContainer, ToastOptions } from "react-toastify";
import { toast } from "react-toastify";

import cn from "classnames";
import "react-toastify/dist/ReactToastify.css";

const TOAST_CONFIG: ToastOptions = {
  position: "bottom-left",
  autoClose: 1900,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "light",
};

export const ToastBase = ({ avatar_url, username, message, isGame }: {
  avatar_url: string;
  username: string;
  message: string;
  isGame?: boolean;
}) => (
  <div className={cn("flex items-center", {
    // "bg-primary": isGame,
  })}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={avatar_url}
      alt="avatar"
      className="w-8 h-8 rounded-full mr-2"
    />
    <div className="flex flex-col justify-center">
      <span className="font-semibold">{username}</span>
        {isGame
          ? 
          <div className="flex gap-x-4">
          <button className="bg-primary text-white rounded-md px-2 py-1">
          <Link href={message}>Play</Link> 
          </button>
          <button className=" text-gray-700 rounded-md px-2 py-1 hover:bg-gray-300">
            Cancel
          </button>
          </div>
          :

      <span>
           {message}
      </span>
        }
    </div>
  </div>
  );

export const toastNewMessage = (
  avatar_url: string,
  username: string,
  message: string
) => {
  // //console.log("toastNewMessage", avatar_url, username, message);
  toast(
    <ToastBase
      avatar_url={avatar_url}
      username={username}
      message={message}
    />,
    TOAST_CONFIG
  );
};

export const toastGameChallenge = (

  username: string,
  avatar_url: string,
  message: string

) => {
  toast(
    <ToastBase
    username={username}
      avatar_url={avatar_url}
      message={message}
      isGame
    />,TOAST_CONFIG,
  );
};


export default ToastContainer;
