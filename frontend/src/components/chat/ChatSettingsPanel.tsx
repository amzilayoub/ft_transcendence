import React, { useState } from "react";

import PasswordModal from "@components/modals/ChatActionsModal/RoomPasswordModal";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { IRoom, RoomType } from "global/types";
import Image from "next/image";
import Select from "react-select";

export const OwnerPanel = ({ roomData }: { roomData: IRoom }) => {
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
    <div className="p-8 w-full">
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
      <div className="flex flex-row justify-between items-center w-full gap-4">
        <div className="flex flex-col justify-center items-start gap-4 w-full">
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
          className="group  w-1/4 bg-black transition rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <Image
            src="/public/images/default-avatar.jpg"
            width={150}
            height={150}
            alt={"ss"}
            className="rounded-full shadow-inner hover:opacity-50 duration-300"
          />
          <h1 className="text-white absolute hidden group-hover:block  duration-300 pointer-events-none">
            upload a photo
          </h1>
        </div>
      </div>
      <textarea
        className="w-full h-24 mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90 focus:border-transparent"
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
          <h2 className="text-2xl font-bold mt-8">Security</h2>
          <div className="h-px bg-gray-200 " />
          <div className="flex flex-col gap-4 mt-4 gap-4">
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
                showPasswordModal={showPasswordModal}
                defaultOption={defaultOption}
                setShowPasswordModal={setShowPasswordModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPanel = ({ roomData }: { roomData: IRoom }) => {
  const [roomCurrentData, setRoomCurrentData] = useState<IRoom>(roomData);

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Room info</h2>
        <p className="text-gray-400">{roomCurrentData.type}</p>
      </div>
      <div className="h-px bg-gray-200 " />
      <div className="flex flex-row justify-between items-center w-full gap-4">
        <div className="flex flex-col justify-center items-start gap-4 w-full">
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
          className="group  w-1/4 bg-black transition rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <Image
            src="/public/images/default-avatar.jpg"
            width={150}
            height={150}
            alt={"ss"}
            className="rounded-full shadow-inner hover:opacity-50 duration-300"
          />
          <h1 className="text-white absolute hidden group-hover:block  duration-300 pointer-events-none">
            upload a photo
          </h1>
        </div>
      </div>
      <textarea
        className="w-full h-24 mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90 focus:border-transparent"
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
    </div>
  );
};

export const MemberPanel = ({ roomData }: { roomData: IRoom }) => {
  const [roomCurrentData, setRoomCurrentData] = useState<IRoom>(roomData);

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Room info</h2>
        <p className="text-gray-400">{roomCurrentData.type}</p>
      </div>
      <div className="h-px bg-gray-200 " />
      <div className="flex flex-row justify-between items-center w-full gap-4">
        <div className="flex flex-col justify-center items-start gap-4 w-full">
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
          className="group  w-1/4 bg-black transition rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <Image
            src="/public/images/default-avatar.jpg"
            width={150}
            height={150}
            alt={"ss"}
            className="rounded-full shadow-inner hover:opacity-50 duration-300"
          />
          <h1 className="text-white absolute hidden group-hover:block  duration-300 pointer-events-none">
            upload a photo
          </h1>
        </div>
      </div>
      <textarea
        className="w-full h-24 mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90 focus:border-transparent"
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
    </div>
  );
};
