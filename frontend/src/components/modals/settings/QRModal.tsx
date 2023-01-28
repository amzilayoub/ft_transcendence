/* eslint-disable no-console */
import React, { useState, useEffect } from "react";

import BaseModal from "@ui/BaseModal";
import TextInput from "@ui/TextInput";

import Button from "@ui/Button";

const QRModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [twoFACode, setTwoFACode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/2fa/turn-on",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            code: twoFACode,
          }),
        }
      );
      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (twoFACode.length === 6) {
      handleSubmit();
    }
  }, [twoFACode]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-8 gap-y-5 flex flex-col w-full justify-center items-center">
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-2xl font-bold">Scan this QR code</p>
          <p className="text-gray-500 text-center">
            To enable 2FA, scan this QR code with your 2FA app.
          </p>
        </div>
        <img
          src={process.env.NEXT_PUBLIC_API_URL + "/2fa/qr-code"}
          alt="qr code"
          className="w-[280px] h-[280px] border"
        />
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-2xl font-bold">Enter the 6-digit code</p>
          <TextInput
            label="Enter 2FA code"
            type="text"
            name="2faCode"
            onChange={(e) => {
              setTwoFACode(e.target.value);
            }}
            inputClassName="w-full"
          />
        </div>
        <div className="flex justify-end w-full">
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default QRModal;
