import React, { useEffect, useState } from "react";

import BaseModal from "@components/common/BaseModal";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { useAuthContext } from "context/auth.context";

const AuthModal = ({
  type = "login",
  isOpen = false,
  onClose = () => {},
}: {
  type: "login" | "register";
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ctx = useAuthContext();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (ctx?.user) {
      onClose();
    }
  }, [ctx?.user, onClose]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-14 gap-y-4">
        <p className="text-2xl font-bold">
          {type === "login" ? "Login" : "Register"}
        </p>
        {ctx?.error && <p className="text-red-500">{ctx?.error}</p>}
        <TextInput
          label="Username"
          placeholder="Username"
          name="username"
          onChange={(e) => handleInputChange(e)}
        />
        <TextInput
          label="Password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleInputChange(e)}
        />
        <Button
          onClick={() => {
            if (type === "login") {
              ctx?.login(input.username, input.password);
            } else {
              ctx?.register({
                username: input.username,
                email: input.username + "@example.com",
                password: input.password,
              });
            }
          }}
          isLoading={ctx?.loading}
        >
          {type === "login" ? "Login" : "Register"}
        </Button>
      </div>
    </BaseModal>
  );
};

export default AuthModal;
