import React, { useState } from "react";

import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { IRoom, RoomType } from "global/types";

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
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      console.log("passwords don't match");
    } else {
      console.log("passwords match");
      setShowPasswordModal(false);
      setRoomCurrentData({
        ...roomCurrentData,
        type: RoomType.PROTECTED,
      });
    }
  };

  return (
    <BaseModal
      isOpen={showPasswordModal}
      onClose={() => {
        setCurrentOption(defaultOption);
        setShowPasswordModal(false);
      }}
    >
      <div className="p-8">
        <form onSubmit={handlePasswordSubmit}>
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Set a password</h1>
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <TextInput
              label="Confirm password"
              type="password"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
              required
            />
            <Button type="submit" className="w-1/2">
              Set password
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default PasswordModal;
