import React, { useState } from "react";

import Image from "next/image";
import { TbCameraPlus } from "react-icons/tb";
import Select from "react-select";

import PasswordModal from "@components/modals/chat/RoomPasswordModal";
import Button from "@ui/Button";
import TextInput, { TextArea, TextInputLabel } from "@ui/TextInput";
import { IRoom, RoomType } from "global/types";

export const RoomInfo = ({
  roomData,
  setAvatar,
  setSettings,
  myRole,
}: {
  roomData: IRoom;
  setAvatar: (url: any) => void;
  setSettings: (settings: any) => void;
  myRole: string;
}) => {
  const [roomCurrentData, setRoomCurrentData] = useState<IRoom>(roomData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const roomTypeOptions = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "protected", label: "Protected" },
  ];

  const [currentRoomTypeOptions, setCurrentRoomTypeOptions] = useState(
    roomData.type
  );

  const [roomAvatar, setRoomAvatar] = useState<File | null>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (selectedOption: any) => {
    //console.log(`Selected: ${selectedOption.value}`);
    setCurrentRoomTypeOptions(selectedOption.value);
    if (selectedOption.value === "protected") {
      setShowPasswordModal(true);
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PROTECTED,
      });
      setSettings((state) => {
        return { ...state, roomeType: RoomType.PROTECTED };
      });
    } else if (selectedOption.value === "private") {
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PRIVATE,
      });
      setSettings((state) => {
        return { ...state, roomeType: RoomType.PRIVATE };
      });
    } else {
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PUBLIC,
      });
      setSettings((state) => {
        return { ...state, roomeType: RoomType.PUBLIC };
      });
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setRoomAvatar(files[0]);
      setAvatar(files[0]);
    }
  };

  return (
    <div className="w-full p-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Room info</h2>
      </div>
      <div className="h-px bg-gray-200 " />
      <div className="flex w-full flex-row items-center justify-between gap-4 pt-4 relative">
        <div className="flex w-full justify-between">
          <div className="flex w-full flex-col gap-y-4 pr-4">
            <div className="flex w-full gap-x-4 ">
              <TextInput
                label="Room Name"
                type="text"
                disabled={String(myRole).toLocaleLowerCase() != "owner"}
                value={roomCurrentData.name}
                onChange={(e) => {
                  e.preventDefault();
                  setRoomCurrentData({
                    ...roomCurrentData,
                    name: e.target.value,
                  });
                  setSettings((state) => {
                    return { ...state, name: e.target.value };
                  });
                }}
                required
                inputClassName="py-[6px] w-full"
              />
              <div className="w-40">
                <TextInputLabel label="Room Type" />

                <Select
                  value={{
                    label:
                      currentRoomTypeOptions.charAt(0).toUpperCase() +
                      currentRoomTypeOptions.slice(1),
                    value: currentRoomTypeOptions,
                  }}
                  options={roomTypeOptions}
                  onChange={handleChange}
                  isDisabled={String(myRole).toLocaleLowerCase() != "owner"}
                />
              </div>
            </div>
            <TextArea
              label="Room Description"
              placeholder="Room Description"
              value={roomCurrentData.description}
              disabled={String(myRole).toLocaleLowerCase() != "owner"}
              onChange={(e) => {
                e.preventDefault();
                setRoomCurrentData({
                  ...roomCurrentData,
                  description: e.target.value,
                });
                setSettings((state) => {
                  return { ...state, description: e.target.value };
                });
              }}
            />
          </div>

          <figure
            className="group relative flex h-[160px] w-[400px] cursor-pointer items-center justify-center rounded-2xl bg-black transition"
            onClick={() => avatarInputRef.current?.click()}
          >
            <Image
              src={
                avatarInputRef.current?.files?.length > 0
                  ? URL.createObjectURL(avatarInputRef.current?.files[0])
                  : roomCurrentData.avatar_url || "/images/default-avatar.png"
              }
              alt={`avatar for ${roomCurrentData.name}`}
              fill
              className="object-cover opacity-70 shadow-inner duration-300 rounded-2xl hover:opacity-50"
            />
            <span className="pointer-events-none absolute rounded-full bg-black/50 p-2 text-white duration-300 group-hover:block">
              <TbCameraPlus className="h-5 w-5" />
            </span>
            <input
              ref={avatarInputRef}
              onChange={(event) => handleFileInputChange(event, "avatar")}
              accept="image/jpeg,image/png,image/webp"
              tabindex="-1"
              type="file"
              className="hidden"
            />
          </figure>
        </div>

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
                  setCurrentOption={setCurrentRoomTypeOptions}
                  defaultOption={currentRoomTypeOptions}
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
    </div>
  );
};
