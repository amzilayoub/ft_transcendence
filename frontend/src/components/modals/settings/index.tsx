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
import { uploadFile } from "@utils/uploadFile";
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

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    if (value.length > 0) {
      setButtonText("Save");
      setSettings({ ...settings, [e.target.name]: value });
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      if (type === "avatar") {
        setSettings({ ...settings, avatar: files[0] });
      }
      if (type === "cover") {
        setSettings({ ...settings, cover: files[0] });
      }
    }
  };

  const handleSwitchChange = async () => {
    if (!switchEnabled) {
      setShowQRModal(true);
    } else {
      try {
        const res = await basicFetch.get("/2fa/turn-off");
        if (res.status === 200) {
          setSwitchEnabled(false);
          ctx.loadUserData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (settings.avatar) {
        setButtonText("Uploading...");
        const file_data = await uploadFile(settings.avatar);
        if (file_data) {
          delete settings.avatar;
          settings.avatar_url = file_data.secure_url || null;
        }
      }
      if (settings.cover) {
        setButtonText("Uploading...");
        const file_data = await uploadFile(settings.cover);
        if (file_data) {
          delete settings.cover;
          settings.cover_url = file_data.secure_url || null;
        }
      }
      setButtonText("Saving...");
      const res = await basicFetch.post("/users/update", {}, settings);
      if (res.ok) {
        setButtonText("Saved!");
        ctx.updateUserData();
        onClose();
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
                <div className="flex w-full flex-col items-center justify-center gap-4 sm:min-w-[600px]">
                  <div className="relative w-full">
                    <figure
                      onClick={() => coverInputRef.current?.click()}
                      className="relative flex h-[200px] w-full cursor-pointer items-center justify-center rounded-t-xl shadow-sm"
                    >
                      {!ctx?.user?.cover_url &&
                      !coverInputRef.current?.files?.length ? (
                        <div className="h-full w-full rounded-t-xl bg-gray-300 " />
                      ) : (
                        <Image
                          src={
                            coverInputRef.current?.files?.length
                              ? URL.createObjectURL(
                                  coverInputRef.current?.files[0]
                                )
                              : ctx.user?.cover_url ||
                                "/images/cover-placeholder.png"
                          }
                          alt={
                            ctx.user?.cover_url
                              ? `cover for ${ctx.user?.username}`
                              : "cover placeholder"
                          }
                          // onClick={() => user?.cover_url && setIsCoverModalOpen(true)}
                          fill
                          className={cn("object-cover rounded-t-xl absolute", {
                            "cursor-pointer": ctx.user?.cover_url,
                          })}
                        />
                      )}
                      <span className="pointer-events-none absolute rounded-full bg-black/50 p-2 text-white duration-300 group-hover:block">
                        <TbCameraPlus className="h-5 w-5 " />
                      </span>
                      <input
                        ref={coverInputRef}
                        onChange={(event) =>
                          handleFileInputChange(event, "cover")
                        }
                        accept="image/jpeg,image/png,image/webp"
                        tabindex="-1"
                        type="file"
                        className="hidden"
                      />
                    </figure>

                    <div className="absolute -bottom-12 -left-2 h-[160px] w-[160px] gap-4">
                      <figure
                        className="group absolute flex h-[160px] w-[160px] cursor-pointer items-center justify-center rounded-full bg-black transition"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Image
                          src={
                            avatarInputRef.current?.files?.length > 0
                              ? URL.createObjectURL(
                                  avatarInputRef.current?.files[0]
                                )
                              : ctx.user?.avatar_url ||
                                "/images/default-avatar.jpg"
                          }
                          alt={`avatar for ${ctx.user?.username}`}
                          fill
                          className="rounded-full object-cover opacity-70 shadow-inner duration-300 hover:opacity-50"
                        />
                        <span className="pointer-events-none absolute rounded-full bg-black/50 p-2 text-white duration-300 group-hover:block">
                          <TbCameraPlus className="h-5 w-5" />
                        </span>
                        <input
                          ref={avatarInputRef}
                          onChange={(event) =>
                            handleFileInputChange(event, "avatar")
                          }
                          accept="image/jpeg,image/png,image/webp"
                          tabindex="-1"
                          type="file"
                          className="hidden"
                        />
                      </figure>
                    </div>
                  </div>
                  {/* first and last name */}

                  <div className="flex w-full gap-x-4 pt-10">
                    <TextInput
                      defaultValue={ctx.user?.first_name}
                      label="First Name"
                      type="text"
                      name="first_name"
                      onChange={handleInputChange}
                    />
                    <TextInput
                      defaultValue={ctx.user?.last_name}
                      label="Last Name"
                      type="text"
                      name="last_name"
                      onChange={handleInputChange}
                    />

                    <TextInput
                      defaultValue={ctx.user?.username}
                      label="Username"
                      type="username"
                      name="username"
                      onChange={handleInputChange}
                    />
                  </div>
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
