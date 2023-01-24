/* eslint-disable no-console */
import React, { useState } from "react";

import { Switch } from "@headlessui/react";
import BaseModal from "@ui/BaseModal";

import Avatar from "/public/images/default-avatar.jpg";

import TextInput from "@ui/TextInput";
import Image from "next/image";

import Button from "../../ui/Button";

const SettingsModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Save");
  const currentUserData = {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };
  const [firstName, setFirstName] = useState(currentUserData.firstName);
  const [lastName, setLastName] = useState(currentUserData.lastName);
  const [username, setUsername] = useState(currentUserData.username);
  const [bio, setBio] = useState(currentUserData.bio);

  // const [inputFilled, setInputFilled] = useState(false);
  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonText("Saving...");
    // Make API call or perform other logic here
    setTimeout(() => {
      setIsLoading(false);
      setButtonText("Save");
      console.log("data saved successfully");
    }, 2000);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 min-h-[calc(60vh)]">
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="h-px bg-gray-200 " />
        <div className="flex flex-col px-4 py-5 min-h-[400px] bg-white max-w-2xl">
          <h2 className="text-2xl text-gray-900">Personal info:</h2>
          <form>
            <div className="flex flex-wrap mb-6">
              <div className="flex flex-col px-4 py-5 rounded-xl border bg-white shadow-md mb-8">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-col justify-center items-center gap-4">
                    <div className="flex flex-row justify-around items-center gap-4">
                      <div>
                        <TextInput
                          label="First Name"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <TextInput
                          label="Last Name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <TextInput
                        label="Username"
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                      src={Avatar}
                      width={500}
                      height={500}
                      alt={"ss"}
                      className="rounded-full shadow-inner hover:opacity-50 duration-300"
                    />
                    <h1 className="text-white absolute hidden group-hover:block  duration-300 pointer-events-none">
                      upload a photo
                    </h1>
                  </div>
                </div>
                <div className="w-full">
                  <TextInput
                    inputClassName="h-[100px] "
                    label="description"
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col w-full ">
                <h2 className="text-2xl text-gray-900">Security Settings:</h2>
                <div className="flex flex-col px-4 py-5  rounded-xl border bg-white shadow-md">
                  <div className="flex flex-col w-full gap-4">
                    <TextInput label="Old Password" type="password" />

                    <TextInput label="New Password" type="password" />
                    <Button variant="secondary" size="small">
                      Change Password
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={`${enabled ? "bg-teal-700" : "bg-gray-600"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            enabled ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <p className="font-bold text-gray-500">{`${
                        enabled ? "Disable 2FA" : "Enable 2FA"
                      }`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row justify-around items-center">
              <Button variant="danger">Delete Account</Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isLoading}
                onClick={handleSave}
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  );
};

export default SettingsModal;
