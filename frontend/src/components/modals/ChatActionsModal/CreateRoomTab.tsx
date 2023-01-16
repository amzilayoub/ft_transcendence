import { Tab } from "@headlessui/react";
import cn from "classnames";

import TextInput from "@ui/TextInput";
import { useEffect, useState } from "react";
import basicFetch from "@utils/basicFetch";

const CreateRoomTab = ({ createRoom }: { createRoom: any }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [createRoomInfo, setCreateRoomInfo] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const getRoomTypes = async () => {
    const res = await basicFetch.get("/chat/room/types/all");

    if (res.status == 200) {
      return await res.json();
    }
    return [];
  };
  useEffect(() => {
    getRoomTypes().then((res) => {
      setRoomTypes(res);
    });
  }, [true]);

  const handleCreateRoomInput = (e: any, field: string) => {
    e.preventDefault();
    console.log(e.target.value);
    setCreateRoomInfo((state) => {
      return { ...state, [field]: e.target.value };
    });
    console.log(createRoomInfo);
  };

  const createRoomEvent = (e: any, roomType: any) => {
    e.preventDefault();
    createRoom(
      {
        ...createRoomInfo,
        roomTypeId: roomType["id"],
      },
      (res: any) => {
        console.log(res);
      }
    );
  };

  return (
    <Tab.Group>
      <Tab.List className="flex w-full h-8 justify-center items-center">
        <div className="flex justify-center items-center rounded-lg h-8 w-2/3 bg-slate-200 ">
          {roomTypes.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                cn({
                  "bg-slate-400 shadow w-full h-full rounded-lg": selected,
                  "bg-slate-200  text-blue-400 w-full h-full rounded-lg":
                    !selected,
                })
              }
            >
              {tab.type}
            </Tab>
          ))}
        </div>
      </Tab.List>
      <Tab.Panels className="mt-2">
        <Tab.Panel key="public-room-panel" className="">
          <form action="">
            <div className="flex flex-col gap-y-2">
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
                  handleCreateRoomInput(e, "name");
                }}
                error="Room name must be at least 3 characters"
              />
              <TextInput
                name="roomPassword"
                label="Room Password"
                placeholder="Enter room password"
                onChange={(e) => {
                  handleCreateRoomInput(e, "password");
                }}
              />
              <TextInput
                name="confirmRoomPassword"
                label="Confirm Room Password"
                placeholder="Confirm room password"
                onChange={(e) => {
                  handleCreateRoomInput(e, "confirmPassword");
                }}
              />
              <button
                className="bg-blue-500 duration-300 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                onClick={(e) => {
                  createRoomEvent(
                    e,
                    roomTypes.find((item) => item.type == "protected")
                  );
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
