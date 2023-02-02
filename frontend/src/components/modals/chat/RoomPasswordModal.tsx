import React, { useState } from "react";

import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { IRoom, RoomType } from "global/types";
import basicFetch from "@utils/basicFetch";

const PasswordModal = ({
  setCurrentOption,
  defaultOption,
  showPasswordModal,
  setShowPasswordModal,
  setRoomCurrentData,
  roomCurrentData,
}: {
  defaultOption: any;
  setCurrentOption: React.Dispatch<React.SetStateAction<any>>;
  showPasswordModal: boolean;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomCurrentData: React.Dispatch<React.SetStateAction<IRoom>>;
  roomCurrentData: IRoom;
}) => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
  };
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      console.log("passwords don't match");
    } else {
      await setRoomPassword(
        roomCurrentData.room_id,
        password,
        passwordConfirmation
      );
      setShowPasswordModal(false);
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PROTECTED,
      });
    }
  };

  const setRoomPassword = async (
    roomId: number,
    password: string,
    confirmPassword: string
  ) => {
    const resp = await basicFetch.post(
      "/chat/room/change-password",
      {},
      {
        roomId,
        password,
        confirmPassword,
      }
    );
    if (resp.status == 201) {
      setShowPasswordModal(false);
    } else if (resp.status == 401) {
      /*
       ** Not the owner
       */
      alert("You're not the owner");
    } else if (resp.status == 403) {
      /*
       ** password incorrect
       */
      alert("message incorrect");
    }
  };
  return (
    <BaseModal
      isOpen={showPasswordModal}
      onClose={() => setShowPasswordModal(false)}
    >
      <div className="p-8">
        <form onSubmit={handlePasswordSubmit}>
          <div className="flex flex-col items-center justify-center gap-4 ">
            <h1 className="text-2xl font-bold">Set the room password</h1>
            <div className="w-full flex flex-col gap-4">
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                inputClassName="w-full max-w-none"
              />
              <TextInput
                label="Confirm password"
                type="password"
                value={passwordConfirmation}
                onChange={handlePasswordConfirmationChange}
                required
                inputClassName="w-full max-w-none"
              />
            </div>
            <div className="flex">
              <Button type="submit">Set password</Button>
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default PasswordModal;
