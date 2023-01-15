import { useState } from "react";

import { Tab } from "@headlessui/react";
import TextInput from "@ui/TextInput";
import cn from "classnames";
import Image from "next/image";

const CreateRoomTab = () => {
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "friend1",
      selected: false,
      avatar: "/images/default-avatar.jpg",
    },
    {
      id: 2,
      name: "friend2",
      selected: false,
      avatar: "/images/default-avatar.jpg",
    },
    {
      id: 3,
      name: "friend3",
      selected: false,
      avatar: "/images/default-avatar.jpg",
    },
    {
      id: 4,
      name: "friend4",
      selected: false,
      avatar: "/images/default-avatar.jpg",
    },
    {
      id: 5,
      name: "friend5",
      selected: false,
      avatar: "/images/default-avatar.jpg",
    },
  ]);

  const [selectedFriends, setSelectedFriends] = useState<typeof friends>([]);
  const handleCreateRoom = (e: any) => {
    e.preventDefault();
    alert("room created");
  };
  const handleSelectFriends = (e: any) => {
    const selected = friends.find(
      (friend) => friend.id === parseInt(e.target.value)
    );
    if (selected) {
      setSelectedFriends((prev) => [...prev, selected]);
      setFriends((prev) => prev.filter((friend) => friend.id !== selected.id));
    }
  };
  const unselectFriend = (friend: any) => {
    setSelectedFriends([...selectedFriends.filter((f) => f.id !== friend.id)]);
    setFriends([...friends, friend]);
  };

  return (
    <Tab.Group>
      <Tab.List className="flex w-full h-8 justify-center items-center">
        <div className="flex justify-center items-center rounded-lg h-8 w-2/3 bg-slate-200 ">
          {["public", "private", "protected"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                cn({
                  "bg-slate-400 shadow w-full h-full rounded-lg": selected,
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
        <Tab.Panel key="public-room-panel" className="">
          <form onSubmit={handleCreateRoom} className="pb-6">
            <div className="flex flex-col gap-y-2 pb-3">
              <TextInput
                name="roomName"
                label="Room Name *" // required
                placeholder="Enter room name"
                onChange={(e) => {
                  e.preventDefault();
                }}
                error="Room name must be at least 3 characters"
              />
            </div>

            <div className="flex flex-wrap w-full  rounded-xl">
              {/* // selected friends */}
              {selectedFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="hover:bg-red-200 duration-300 cursor-pointer w-fit flex justify-around items-center bg-slate-200 rounded-xl p-1 m-1"
                >
                  <Image
                    src={friend.avatar}
                    width={30}
                    height={30}
                    alt={""}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{friend.name}</span>

                  <span
                    className="text-red-500"
                    onClick={() => unselectFriend(friend)}
                  >
                    x
                  </span>
                </div>
              ))}
            </div>
            <ul className="bg-slate-100 flex flex-col w-full rounded-lg space">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  value={friend.id}
                  className={` cursor-pointer rounded-lg flex gap-5 p-2 hover:bg-slate-200 duration-300${
                    selectedFriends.includes(friend) ? "hidden" : ""
                  }`}
                  onClick={handleSelectFriends}
                >
                  <Image
                    src={friend.avatar}
                    width={30}
                    height={30}
                    alt={""}
                    className="rounded-full"
                  />
                  <span>{friend.name}</span>
                </li>
              ))}
            </ul>
          </form>
          <button
            className="bg-blue-500 duration-300 text-white py-1 px-2 w-full rounded-md space-y-5 hover:bg-blue-600"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Create
          </button>
        </Tab.Panel>
        <Tab.Panel key="private-room-panel" className="">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          </p>
        </Tab.Panel>
        <Tab.Panel key="protected-room-panel" className="">
          <form action="">
            <div className="flex flex-col gap-y-2">
              <TextInput
                name="roomName"
                label="Room Name *"
                placeholder="Enter room name"
                onChange={(e) => {
                  e.preventDefault();
                }}
                error="Room name must be at least 3 characters"
              />
              <TextInput
                name="roomPassword"
                label="Room Password"
                placeholder="Enter room password"
                onChange={(e) => {
                  e.preventDefault();
                }}
              />
              <TextInput
                name="confirmRoomPassword"
                label="Confirm Room Password"
                placeholder="Confirm room password"
                onChange={(e) => {
                  e.preventDefault();
                }}
              />
              <button
                className="bg-blue-500 duration-300 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Create
              </button>
            </div>
          </form>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default CreateRoomTab;
