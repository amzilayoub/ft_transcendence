import { useState } from "react";

import Image from "next/image";
import { BiHide, BiShowAlt } from "react-icons/bi";

import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { LANDING_IMAGE } from "@utils/constants";

const SiginFields = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section className="group w-full flex justify-center cursor-wait flex-col relative">
      <div className="flex-col flex blur-sm gap-y-4 cursor-wait w-full">
        <TextInput
          label="Username or Email"
          placeholder="Username or Email"
          name="username"
          onChange={() => {}}
          inputClassName="h-10 cursor-wait"
        />
        <div className="relative">
          <TextInput
            label="Password"
            placeholder="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={() => {}}
            inputClassName="h-10 cursor-wait"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-gray-700 absolute right-1 bottom-1.5 duration-300 hover:bg-gray-200 rounded-lg p-1.5"
          >
            {showPassword ? <BiHide /> : <BiShowAlt />}
          </button>
        </div>
        <Button onClick={() => {}} className="min-w-full">
          Sign In
        </Button>
      </div>
      <p className="group-hover:block hidden text-gray-600 text-3xl font-semibold text-center w-full cursor-wait absolute">
        Soon...?
      </p>
    </section>
  );
};

export default function Home() {
  return (
    <div className="grid grid-cols-5 divide-x-2 min-h-screen">
      <div className="grid xl:col-span-2 items-center justify-center col-span-5">
        <section className="flex flex-col items-center px-10 py-16 gap-y-8 shadow-lg max-w-md border rounded-xl p-6">
          <header className="flex items-center flex-col gap-y-2">
            <h1 className="text-3xl font-bold">Sign in to Pong</h1>
            <p className="text-gray-500">
              Login to play Pong with your friends
            </p>
          </header>
          <SiginFields />
          <p className="text-gray-500">
            <span className="h-px mb-1 w-32 bg-gray-200 inline-block" />
            <span className="mx-2">OR</span>
            <span className="h-px mb-1 w-32 bg-gray-200 inline-block" />
          </p>

          <button
            type="button"
            className="flex items-center justify-center gap-x-4 px-10 py-2 rounded-xl bg-orange-500
              hover:scale-105 hover:bg-orange-600 transition duration-300 ease-in-out w-full
            "
          >
            <Image src={"/42-logo.svg"} width={36} height={36} alt="42 logo" />
            <p className="pb-1 font-semibold text-lg">Sign In with 42</p>
          </button>
        </section>
      </div>
      <figure className="sm:col-span-3 hidden xl:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LANDING_IMAGE}
          alt="Pong image"
          className="object-cover w-full h-full max-h-screen"
        />
      </figure>
    </div>
  );
}
