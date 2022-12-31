import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
interface IProps {
  title: string;
  children: React.ReactNode;
}
const MiddleBar = ({ title, children }: IProps) => {
  // looks like a sidebar for online users
  return (
    <div className="w-1/4 h-full flex flex-col justify-between bg-[#303841] space-y-5">
      <div className="w-full h-[3vh] flex flex-col justify-center items-center">
        <h1 className="text-white text-3xl w-full text-center bg-slate-500 h-[3vh] flex flex-col justify-center items-center">
          {title}
        </h1>
      </div>
      <div className="flex bg-[#262E35] rounded-lg">
        <BiSearchAlt2 className="h-10 w-10  rounded-lg cursor-pointer" />
        <input
          className="w-60 h-10 bg-[#262E35] text-white rounded-lg"
          placeholder="Search"
        />
      </div>
      <div className="w-full h-[97vh] flex flex-col p-4">{children}</div>
    </div>
  );
};

export default MiddleBar;
