import React from "react";
import { useState } from "react";

import BaseModal from "@components/common/BaseModal";
import { Tab } from "@headlessui/react";
import TextInput from "@ui/TextInput";
import cn from "classnames";
import Image from "next/image";
import { AiFillCloseCircle, AiFillLock, AiOutlineSearch } from "react-icons/ai";

const ChatActionsModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Discover Tab Section
  const [availableRooms, setAvailableRooms] = useState([
    { id: 1, roomName: "room 1", password: null, isJoined: false },
    { id: 2, roomName: "room 2", password: "secret", isJoined: false },
    { id: 3, roomName: "room 3", password: null, isJoined: false },
    { id: 4, roomName: "room 4", password: null, isJoined: false },
    { id: 5, roomName: "room 5", password: null, isJoined: false },
    // ...
  ]);

  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleJoin = (room) => {
    if (room.password) {
      setShowPasswordModal(true);
      setCurrentRoom(room);
    } else {
      const updatedRooms = availableRooms.map((r) => {
        if (r.id === room.id) {
          return { ...r, isJoined: true };
        }
        return r;
      });
      setAvailableRooms(updatedRooms);
      alert(`You joined room ${room.roomName}`);
    }
  };
  const handleUnjoin = (room) => {
    const updatedRooms = availableRooms.map((r) => {
      if (r.id === room.id) {
        return { ...r, isJoined: false };
      }
      return r;
    });
    setAvailableRooms(updatedRooms);
    alert(`You unjoined room ${room.roomName}`);
  };
  const handlePassword = (password) => {
    if (password === currentRoom.password) {
      setShowPasswordModal(false);
      currentRoom.isJoined = true;
      alert(`You joined room ${currentRoom.id}`);
    } else {
      alert(`Wrong password`);
    }
  };

  const PasswordModal = ({ show, currentRoom, password, handlePassword }) => {
    return (
      <div
        className={`${
          show ? "" : "hidden"
        } fixed bottom-0 left-0 w-full h-full bg-black bg-opacity-75`}
      >
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
              type="password"
              value={password}
              maxLength={20}
              autoFocus
              onChange={(e) => {
                e.preventDefault();
                setPassword(e.target.value);
              }}
            />
            <button
              className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
              onClick={() => handlePassword(password)}
            >
              {" "}
              Join
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Create Tab Section
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [roomPasswordConfirm, setRoomPasswordConfirm] = useState("");
  const [roomPasswordError, setRoomPasswordError] = useState(false);
  const [roomNameError, setRoomNameError] = useState(false);

  const handleCreate = () => {
    if (roomName.length < 3) {
      setRoomNameError(true);
      return;
    }
    if (roomPassword !== roomPasswordConfirm) {
      setRoomPasswordError(true);
      return;
    }
    alert(`You created room ${roomName}`);
  };
  // Friends Tab Section

  const friends = [
    { id: 1, name: "John Doe", avatar: "/images/default-avatar.jpg" },
    { id: 2, name: "Jane Smith", avatar: "/images/default-avatar.jpg" },
    { id: 3, name: "Bob Smith", avatar: "/images/default-avatar.jpg" },
    // ...
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLocaleLowerCase().includes(searchTerm)
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 w-[420px] min-h-[calc(60vh)]">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {["Rooms", "Create", "Friends"].map((tab) => (
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
                        <AiFillLock className="w-6 h-6 text-red-600" />
                      )}
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 w-24"
                        onClick={() =>
                          room.isJoined ? handleUnjoin(room) : handleJoin(room)
                        }
                      >
                        {room.isJoined ? "Unjoin" : "Join"}
                      </button>
                    </li>
                  ))}
                </ul>
                {showPasswordModal && (
                  <PasswordModal
                    show={showPasswordModal}
                    currentRoom={currentRoom}
                    password={password}
                    handlePassword={handlePassword}
                  />
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
              <Tab.Group>
                <Tab.List className="flex w-full h-8 justify-center items-center">
                  <div className="flex justify-center items-center rounded-lg h-8 w-2/3 bg-slate-200 ">
                    {["public", "private"].map((tab) => (
                      <Tab
                        key={tab}
                        className={({ selected }) =>
                          cn({
                            "bg-slate-400 shadow w-full h-full rounded-lg":
                              selected,
                            "bg-slate-200  text-blue-400 w-full h-full rounded-lg":
                              !selected,
                          })
                        }
                      >
                        {tab}
                      </Tab>
                    ))}
                  </div>
                </Tab.List>
                <Tab.Panels className="mt-2">
                  <Tab.Panel key={"Public_Panel"} className="">
                    <form action="">
                      <div className="flex flex-col gap-y-2">
                        <TextInput
                          label="Room Name *"
                          placeholder="Enter room name"
                          value={roomName}
                          onChange={(e) => {
                            e.preventDefault();
                            setRoomName(e.target.value);
                          }}
                          error={roomNameError}
                          errorMessage="Room name must be at least 3 characters"
                        />
                        <TextInput
                          label="Room Password"
                          placeholder="Enter room password"
                          value={roomPassword}
                          onChange={(e) => {
                            e.preventDefault();
                            setRoomPassword(e.target.value);
                          }}
                        />
                        <TextInput
                          label="Confirm Room Password"
                          placeholder="Confirm room password"
                          value={roomPasswordConfirm}
                          onChange={(e) => {
                            e.preventDefault();
                            setRoomPasswordConfirm(e.target.value);
                          }}
                          error={roomPasswordError}
                          errorMessage="Passwords do not match"
                        />
                        <button
                          className="bg-blue-500 duration-300 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCreate();
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </Tab.Panel>
                  <Tab.Panel key={"Private_Panel"} className="">
                    <form action="">
                      <div className="flex flex-col gap-y-2">
                        <TextInput
                          label="Room Name *"
                          placeholder="Enter room name"
                          value={roomName}
                          onChange={(e) => {
                            e.preventDefault();
                            setRoomName(e.target.value);
                          }}
                          error={roomNameError}
                          errorMessage="Room name must be at least 3 characters"
                        />
                        <TextInput
                          label="Room Password"
                          placeholder="Enter room password"
                          value={roomPassword}
                          onChange={(e) => {
                            e.preventDefault();
                            setRoomPassword(e.target.value);
                          }}
                        />
                        <TextInput
                          label="Confirm Room Password"
                          placeholder="Confirm room password"
                          value={roomPasswordConfirm}
                          onChange={(e) => {
                            e.preventDefault();
                            setRoomPasswordConfirm(e.target.value);
                          }}
                          error={roomPasswordError}
                          errorMessage="Passwords do not match"
                        />
                        <button
                          className="bg-blue-500 duration-300 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCreate();
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </Tab.Panel>
            <Tab.Panel>
              <div className="relative">
                <input
                  className="bg-gray-200 p-2 rounded-md w-full"
                  type="text"
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <AiOutlineSearch className="absolute top-0 right-0 mr-2 mt-2" />
              </div>
              <ul className="px-4 py-2">
                {filteredFriends.map((friend) => (
                  <li
                    key={friend.id}
                    className="flex items-center gap-x-2 py-2 border-b border-gray-300 cursor-pointer hover:bg-slate-100 duration-300"
                    onClick={() => console.log("clicked")}
                  >
                    <Image
                      src={friend.avatar}
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt={""}
                    />
                    <div className="text-lg font-medium">{friend.name}</div>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BaseModal>
  );
};
export default ChatActionsModal;
