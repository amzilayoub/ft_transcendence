/* eslint-disable no-console */
import React, { useState, useEffect } from "react";

import { Switch } from "@headlessui/react";
import cn from "classnames";
import Image from "next/image";
import { TbCameraPlus } from "react-icons/tb";

import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import TextInput, { TextArea, TextInputLabel } from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";
import { useAuthContext } from "context/auth.context";

import QRModal from "./QRModal";

const SettingsModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ctx = useAuthContext();
  const [settings, setSettings] = useState({});
  const [switchEnabled, setSwitchEnabled] = useState(
    ctx.user?.isTwoFactorEnabled
  );

  const [showQRModal, setShowQRModal] = useState(false);
  const [buttonText, setButtonText] = useState("Save");
  const [deleteButtonText, setDeleteButtonText] = useState("Delete");
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    if (value.length > 0) {
      setButtonText("Save");
      setSettings({ ...settings, [e.target.name]: value });
    }
  };

 
  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setButtonText("Saving...");
    setIsSaving(true);
    try {
      const res = await basicFetch.post("/users/update", {}, settings);
      if (res.status === 200) {
        setButtonText("Saved!");
        // ctx.setUser(res.data);
        ctx.loadUserData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
      setButtonText("Save");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="min-h-[calc(45vh)] p-8">
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="mt-3 h-px bg-gray-200" />
        <div className="flex max-w-2xl flex-col bg-white py-4">
          <form>
            <section className="flex flex-col gap-y-5 rounded-xl bg-white px-4 py-5">
              {/* div for the avatar and the 3 input fields. */}
              <div className="flex w-full flex-col-reverse items-center justify-start gap-y-6 md:flex-row md:items-center md:justify-between md:gap-y-0 md:gap-x-10">
                {/* 3 input fields */}
                <div className="flex w-full max-w-sm flex-col items-center justify-center gap-4">
                  {/* first and last name */}
                  <div className="flex w-full gap-x-4">
                    <div>
                      <TextInput
                        defaultValue={ctx.user?.first_name}
                        label="First Name"
                        type="text"
                        name="firstName"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <TextInput
                        defaultValue={ctx.user?.last_name}
                        label="Last Name"
                        type="text"
                        name="lastName"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <TextInput
                      defaultValue={ctx.user?.username}
                      label="Username"
                      type="username"
                      name="username"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="relative h-[160px] w-[160px] gap-4">
                  <figure
                    className="group absolute flex h-[160px] w-[160px] cursor-pointer items-center justify-center rounded-full bg-black transition"
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    <Image
                      src={ctx.user?.avatar_url || "/images/default-avatar.jpg"}
                      alt={`avatar for ${ctx.user?.username}`}
                      fill
                      className="rounded-full object-cover opacity-70 shadow-inner duration-300 hover:opacity-50"
                    />
                    <span className="pointer-events-none absolute rounded-full bg-black/50 p-2 text-white duration-300 group-hover:block">
                      <TbCameraPlus className="h-5 w-5" />
                    </span>
                  </figure>
                </div>
              </div>
              <div className="w-full">
                <TextArea
                  defaultValue={ctx.user?.bio}
                  label="Bio"
                  placeholder="Tell us about yourself"
                  name="bio"
                  onChange={handleInputChange}
                  maxLength={300}
                  inputClassName="h-[100px] "
                />
              </div>

              <div className="flex flex-col items-start gap-y-3 pt-2 pl-1">
                <TextInputLabel
                  label={switchEnabled ? "Disable 2FA" : "Enable 2FA"}
                />
                <Switch
                  checked={switchEnabled}
                  onChange={() => setShowQRModal(true)}
                  className={cn(
                    "relative inline-flex h-[30px] w-[74px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
                    {
                      "bg-primary": switchEnabled,
                      "bg-gray-400": !switchEnabled,
                    }
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-[32px] w-[34px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                      {
                        "translate-x-11": switchEnabled,
                        "-translate-x-1": !switchEnabled,
                      }
                    )}
                  />
                </Switch>
              </div>
              <div className="flex h-full w-full items-end justify-end">
                <div className="flex gap-x-2 ">
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeleteButtonText("MagalouHach f suji");
                    }}
                  >
                    {deleteButtonText}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    isLoading={isSaving}
                    onClick={handleSave}
                  >
                    {buttonText}
                  </Button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
      {showQRModal && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          onSuccess={() => {
            ctx.loadUserData().then((data) => setSwitchEnabled(data?.isTwoFactorEnabled));
            setShowQRModal(false);
          }}
          actionType={switchEnabled ? "turn-off" : "turn-on"}
        />
      )}
    </BaseModal>
  );
};

export default SettingsModal;
