import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Leftbar from "../../components/Leftbar";
import { Context } from "../../context";
import Image from "next/image";
import face from "../../assets/face.jpg";
import { RiRadioButtonLine } from "react-icons/ri";
import { BiUser } from "react-icons/bi";
import Lottie from "react-lottie";
import animationData from "../../assets/pong.json";

function CoronaVirus() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <Lottie options={defaultOptions} height={320} width={450} />;
}

const About = () => {
  const { username, firstName, lastName, email } = React.useContext(Context);
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="w-5/6">
      <div className=" mt-8 cursor-pointer gap-2 flex justify-center items-center text-xl text-center text-white bg-[#36404A] w-full rounded-t-lg ">
        <BiUser className="h-4 w-4 text-[#A6B0CF] rounded-t-lg cursor-pointer" />
        <h1>about</h1>
      </div>
      <div className="bg-[#262E35] border-2 p-4 space-y-4 border-[#36404A] w-full h-fit">
        <div className=" ">
          <h1 className="text-[#9AA1B9]">Name</h1>
          <h2 className="text-white">
            {firstName} {lastName}
          </h2>
        </div>
        <div>
          <h1 className="text-[#9AA1B9]">Username</h1>
          <h2 className="text-white">{username}</h2>
        </div>
        <div>
          <h1 className="text-[#9AA1B9]">Email</h1>
          <h2 className="text-white">{email}</h2>
        </div>
      </div>
    </div>
  );
};

const dashboard = () => {
  const { username, firstName, lastName, email } = React.useContext(Context);
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="flex">
      <Head>
        <title>dashboard</title>
      </Head>
      <Leftbar />
      <div className="w-[500px] h-screen flex justify-center items-center bg-[#303841]">
        <div className="  w-full flex flex-col justify-start items-center h-full">
          <div className=" border-b pb-8">
            <Image
              src={face.src}
              alt="test"
              width={200}
              height={200}
              className="rounded-full p-3 cursor-pointer"
            />
            <div className=" flex te justify-center items-center gap-4 align-middle">
              <RiRadioButtonLine className="text-4xl text-green-500 w-4 h-4 align-middle" />
              <h1 className="text-xl text-white text-center">
                {firstName} {lastName}
              </h1>
            </div>
          </div>
          <About />
        </div>
      </div>
      <div className="w-full h-screen bg-[#262E35]">
        <div className="flex justify-center items-center h-20 border-b-2 ">
          <div className="text-4xl text-white">Dashboard</div>
        </div>
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col space-y-8 items-center text-4xl text-white">
            <CoronaVirus />
            <button className=" w-2/3 bg-[#A6B0CF] text-[#36404A] rounded-full p-3">Play with a friend</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
