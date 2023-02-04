import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const TOAST_CONFIG = {
  position: "bottom-left",
  autoClose: 1900,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "light",
};

export const toastNewMessage = (
  avatar_url: string,
  username: string,
  message: string
) => {
  // //console.log("toastNewMessage", avatar_url, username, message);
  toast(
    <div className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatar_url}
        alt="avatar"
        className="w-8 h-8 rounded-full mr-2"
      />
      <div className="flex flex-col">
        <span className="font-semibold">{username}</span>
        <span>{message}</span>
      </div>
    </div>,
    TOAST_CONFIG
  );
};

export const toastGameChallenge = (message: string) => {
  toast(message, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
};

export default ToastContainer;
