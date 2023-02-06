/* eslint-disable no-console */
import React from "react";

import Image from "next/image";

import BaseModal from "@ui/BaseModal";
import { APP_NAME } from "@utils/constants";

const WelcomeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      styles={{
        modal: "w-[500px]",
      }}
    >
      <div className="h-full p-8">
        <div className="flex flex-col items-center justify-center py-6">
          <h1 className=" text-center text-5xl font-bold">
            <span className="bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              Welcome to the
            </span>
            <span className="bg-gradient-to-l from-red-900 to-primary bg-clip-text text-center text-6xl font-bold text-transparent ">
              {" "}
              {APP_NAME}!
            </span>
          </h1>
          <Image
            src="/images/default-avatar.png"
            alt="Andrew Tate"
            width={200}
            height={200}
            className="mt-10 duration-300 hover:scale-125 "
          />
        </div>
        <div className="flex flex-col gap-y-8 text-center text-xl text-gray-700">
          <p className="text-gray-500">
            Here you can play with your peers and have fun! You can also chat
            with them and make new friends!
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default WelcomeModal;
