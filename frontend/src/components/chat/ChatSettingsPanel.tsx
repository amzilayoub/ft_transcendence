import React, { useState } from "react";

import Image from "next/image";
import Select from "react-select";

import PasswordModal from "@components/modals/chat/RoomPasswordModal";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { IRoom, RoomType } from "global/types";

export const RoomInfo = ({ roomData }: { roomData: IRoom }) => {
  const [roomCurrentData, setRoomCurrentData] = useState<IRoom>(roomData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const options = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "protected", label: "Protected" },
  ];

  const [defaultOption, setDefaultOption] = useState(options[0]);
  const [currentOption, setCurrentOption] = useState(defaultOption);

  const handleChange = (selectedOption: any) => {
    console.log(`Selected: ${selectedOption.value}`);
    setCurrentOption(selectedOption);
    console.log({ selectedOption });
    if (selectedOption.value === "protected") {
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PROTECTED,
      });
      setShowPasswordModal(true);
    } else if (selectedOption.value === "private") {
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PRIVATE,
      });
    } else {
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PUBLIC,
      });
    }
  };

  return (
    <div className="w-full p-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Room info</h2>
        <Select
          defaultValue={defaultOption}
          options={options}
          value={currentOption}
          onChange={handleChange}
        />
      </div>
      <div className="h-px bg-gray-200 " />
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <div className="flex w-full flex-col items-start justify-center gap-4">
          <div className="w-5/6">
            <TextInput
              label="Room Name"
              type="text"
              value={roomCurrentData.name}
              onChange={(e) => {
                e.preventDefault();
                setRoomCurrentData({
                  ...roomCurrentData,
                  name: e.target.value,
                });
              }}
              required
            />
          </div>
        </div>
        <div
          className="group  flex w-1/4 cursor-pointer items-center justify-center rounded-full bg-black transition"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <Image
            src="/public/images/default-avatar.jpg"
            width={150}
            height={150}
            alt={"ss"}
            className="rounded-full shadow-inner duration-300 hover:opacity-50"
          />
          <h1 className="pointer-events-none absolute hidden text-white  duration-300 group-hover:block">
            upload a photo
          </h1>
        </div>
      </div>
      <textarea
        className="mt-5 h-24 w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-primary/90"
        placeholder="Enter room description"
        value={roomCurrentData.description}
        onChange={(e) => {
          e.preventDefault();
          setRoomCurrentData({
            ...roomCurrentData,
            description: e.target.value,
          });
        }}
      />
      {roomCurrentData.type === RoomType.PROTECTED && showPasswordModal && (
        <div className="">
          <h2 className="mt-8 text-2xl font-bold">Security</h2>
          <div className="h-px bg-gray-200 " />
          <div className="mt-4 flex flex-col gap-4">
            <TextInput
              label="New Password"
              type="password"
              value={roomCurrentData.password}
              onChange={(e) => {
                e.preventDefault();
                setRoomCurrentData({
                  ...roomCurrentData,
                  password: e.target.value,
                });
              }}
              required
            />
            <TextInput
              label="Confirm Password"
              type="password"
              value={roomCurrentData.password}
              onChange={(e) => {
                e.preventDefault();
                setRoomCurrentData({
                  ...roomCurrentData,
                  password: e.target.value,
                });
              }}
              required
            />
            <Button variant="secondary" size="small">
              Change Password
            </Button>
            {showPasswordModal && (
              <PasswordModal
                setCurrentOption={setCurrentOption}
                defaultOption={defaultOption}
                showPasswordModal={showPasswordModal}
                setShowPasswordModal={setShowPasswordModal}
                setRoomCurrentData={setRoomCurrentData}
                roomCurrentData={roomCurrentData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
