import React, { useState } from "react";

import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";

const PasswordModal = ({
  setCurrentOption,
  showPasswordModal,
  setShowPasswordModal,
}: {
  setCurrentOption: React.Dispatch<React.SetStateAction<any>>;
  showPasswordModal: boolean;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
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
      setPasswordSuccess(true);
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
      <form onSubmit={handlePasswordSubmit}>
        <div className="flex flex-col justify-center items-center gap-4">
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
    </BaseModal>
  );
};

export default PasswordModal;
