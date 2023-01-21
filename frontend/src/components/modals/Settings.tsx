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
  const handleSave = () => {
    setIsLoading(true);
    // Make API call or perform other logic here
    setTimeout(() => {
      setIsLoading(false);
      alert("Data saved successfully!");
    }, 2000);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h1 className="text-3xl font-semibold text-center">Settings</h1>
      <div className=" pt-2 max-w-2xl w-full">
        <div className="container mx-auto rounded-lg">
          <div className=" w-full p-6 mx-auto">
            <h2 className="text-2xl text-gray-900">Personal info:</h2>
            <form className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-full px-3 mb-6 gap-3 flex flex-col">
                  <div className="flex flex-row justify-between items-center w-full gap-5">
                    <div className="flex flex-col justify-center items-center gap-5">
                      <div className="flex flex-row justify-around items-center gap-5">
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
                      <h1 className="text-white absolute hidden group-hover:block  duration-300">
                        upload a photo
                      </h1>
                    </div>
                  </div>
                  <div className="w-full md:w-full">
                    <TextInput
                      label="description"
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full md:w-full px-3 mb-6 gap-5">
                  <h2 className="text-2xl text-gray-900">Security Settings:</h2>
                  <div className="flex flex-row justify-between items-center w-full border-t border-gray-200 pt-4">
                    <div className="flex flex-col w-full gap-5">
                      <TextInput label="Old Password" type="password" />

                      <TextInput label="New Password" type="password" />
                      <Button variant="secondary" size="small">
                        Change Password
                      </Button>
                      <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={`${enabled ? "bg-teal-900" : "bg-teal-700"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            enabled ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
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
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default SettingsModal;
