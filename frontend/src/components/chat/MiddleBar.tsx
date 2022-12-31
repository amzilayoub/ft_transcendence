import React from "react";

import { BiSearchAlt2 } from "react-icons/bi";
interface IProps {
  title: string;
  children: React.ReactNode;
}
const MiddleBar = ({ title, children }: IProps) => {
  // looks like a sidebar for online users
  return (
    <div className="w-1/4 flex flex-col justify-between bg-[#303841] space-y-5">
      <div className="w-full flex flex-col justify-center items-center">
        <h1 className="text-white p-4 text-3xl w-full text-center flex flex-col justify-center items-start">
          {title}
        </h1>
      </div>
      <div className="w-full h-full flex flex-col p-4 space-y-5">{children}</div>
    </div>
  );
};

export default MiddleBar;
