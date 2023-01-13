import React from "react";
import { useState } from "react";

import BaseModal from "@components/common/BaseModal";
import { Tab } from "@headlessui/react";
import TextInput from "@ui/TextInput";
import cn from "classnames";
import { AiFillCloseCircle } from "react-icons/ai";

const ChatActionsModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const availableRooms = [
    { id: 1, roomName: "scubadiving", password: null },
    { id: 2, roomName: "scubadiving2", password: "123" },
    { id: 3, roomName: "scubadiving3", password: null },
    { id: 4, roomName: "scubadiving4", password: "123" },
    // ...
  ];

  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const handleJoin = (room) => {
    if (room.password) {
      setShowPasswordModal(true);
      setCurrentRoom(room);
    } else {
      alert(`You joined room ${room.id}`);
    }
  };
  const handlePassword = (password) => {
    if (password === currentRoom.password) {
      setShowPasswordModal(false);
      alert(`You joined room ${currentRoom.id}`);
    } else {
      alert(`Wrong password`);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 w-[420px] min-h-[calc(60vh)]">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {["Rooms", "Create", "dm"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  cn(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                    {
                      "bg-white shadow": selected,
                      "text-blue-100 hover:bg-white/[0.12] hover:text-white":
                        !selected,
                    }
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel
              key={"discover-panel"}
              className={cn(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <div className="bg-gray-200 rounded-xl">
                <ul className="px-4 py-2">
                  {availableRooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex items-center justify-between gap-x-2 py-2 border-b border-gray-300"
                    >
                      <div className="text-lg font-medium">{room.roomName}</div>
                      {room.password !== null && (
                        <div className="text-red-500"> Protected</div>
                      )}
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                        onClick={() => handleJoin(room)}
                      >
                        {" "}
                        Join
                      </button>
                    </li>
                  ))}
                </ul>
                {showPasswordModal && (
                  <div className="w-full fixed bottom-0 left-0 w-full h-full bg-black bg-opacity-75">
                    <div className="w-2/3 mx-auto my-32 bg-white rounded-md p-4">
                    <AiFillCloseCircle
                      className="w-6 h-6 cursor-pointer text-red-600 hover:text-red-800 duration-300 "
                      onClick={() => setShowPasswordModal(false)}
                    />
                      <div className="flex justify-between items-center text-center">
                        <h3 className="text-lg font-medium mb-2">
                          Please Enter The Password for
                          <h1 className="font-bold">{currentRoom.roomName}</h1>
                        </h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <input
                          className="bg-gray-200 p-2 rounded-md"
                          type="text"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 mt-2"
                          onClick={() => handlePassword(password)}
                        >
                          {" "}
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel
              key={"create-panel"}
              className={cn(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <TextInput label="Room Name" placeholder="Enter room name" />
              <TextInput
                label="Room Description"
                placeholder="Enter room description"
              />
              <TextInput
                label="Room Password"
                placeholder="Enter room password"
              />
            </Tab.Panel>
            <Tab.Panel
              key={"create-panel"}
              className={cn(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <TextInput label="Room Name" placeholder="Enter room name" />
              <TextInput
                label="Room Description"
                placeholder="Enter room description"
              />
              <TextInput
                label="Room Password"
                placeholder="Enter room password"
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BaseModal>
  );
};
export default ChatActionsModal;
