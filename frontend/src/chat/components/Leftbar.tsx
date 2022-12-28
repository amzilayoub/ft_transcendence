import React from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import face from "../assets/face.jpg";
import { BiUser } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { BiSmile } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";
import dashboard from "../pages/dashboard/[id]";
import { Context } from "../context";
import Link from "next/link";

const icons =
  "h-14 w-14 text-[#A6B0CF] hover:bg-[#3E4A56] p-3 rounded-lg cursor-pointer";

const Leftbar = () => {
  const { username, id } = React.useContext(Context);
  const router = useRouter();
  const redirect = (id: string) => {
    router.push(`${id}`);
  };

  return (
    <div
      className=" w-30 h-screen bg-[#36404A] flex flex-col 
      justify-around drop-shadow-lg"
    >
      <div className="flex justify-center items-center">
        <Image src={logo.src} alt="test" width={40} height={40} />
      </div>
      <div
        className="w-full h-full flex flex-col justify-center 
              space-y-4 items-center"
      >
        <Link href={"/dashboard"}>
          <BiUser className={icons} />
        </Link>
        <Link href={"/friends"}>
          <BiSmile className={icons} />
        </Link>
        <Link href={"/chat"}>
          <BsChatDots className={icons} />
        </Link>
        <Link href={"/rooms"}>
          <FiUsers className={icons} />
        </Link>
        <Link href={"/settings"}>
          <FiSettings className={icons} />
        </Link>
      </div>
      <div className="rounded-full cursor-pointer">
        <Image
          src={face.src}
          alt="test"
          width={100}
          height={100}
          className=" rounded-full p-3 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Leftbar;
