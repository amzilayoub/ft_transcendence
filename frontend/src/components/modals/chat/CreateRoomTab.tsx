import { useEffect, useState } from "react";

import { Tab } from "@headlessui/react";
import cn from "classnames";

import { useAuthContext } from "context/auth.context";

import AsyncSelect from "react-select/async";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900">
        {/* Loading */}
      </div>
    </div>
  );
};

import TextInput from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";

export const friends = [
  {
    value: "chocolate",
    label: "ommagour",
    img: "/images/default-avatar.jpg",
  },
  {
    value: "mbifenzi",
    label: "Strawberry",
    img: "/images/default-avatar.jpg",
  },
  {
    value: "vanilla",
    label: "Apex",
    img: "/images/default-avatar.jpg",
  },
];

export const SearchchatTab = ({
  createRoomEvent,
  roomTypes,
}: {
  createRoomEvent: any;
  roomTypes: any;
}) => {
  const ctx = useAuthContext();
  const [roomMembers, setRoomMembers] = useState([]);
  const [people, setPeople] = useState([...friends]);

  useEffect(() => {
    const fetchPeople = async () => {
      const res = await basicFetch.get(`/users/${ctx.user?.username}/friends`);
      if (res.status == 200) {
        const data = await res.json();
        setPeople(data);
      }
    };
    fetchPeople();
  }, []);

  const handleSearch = async (value: any) => {
    const res = await basicFetch.get(`/users/friends/${value}`);
    if (res.status == 200) {
      const data = await res.json();
      //console.log(data);
      return data;
    }
    return [
      {
        value: "salut",
        label: "salut",
        img: "/images/default-avatar.jpg",
      },
    ];
  };

  return (
    <>
      <form onSubmit={() => {}} className="pb-6">
        <div>
          {/* <Creatable
            defaultValue={[friends[2], friends[3]]}
            isMulti
            name="colors"
            options={friends}
            formatOptionLabel={(option) => (
              <div className="flex gap-4 items-center">
                <Image
                  src={option.img}
                  width={50}
                  height={50}
                  alt={""}
                  className="rounded-full w-8 h-8"
                />
                <span>{option.label}</span>
              </div>
            )}
            onChange={(e) => {
              setRoomMembers(e);
            }}
            onInputChange={(e) => {
              handleSearch(e);
            }}
            onCreateOption={handleCreate}
            // className="basic-multi-select"
            classNamePrefix="select"
          /> */}
          <AsyncSelect
            cacheOptions
            value={roomMembers}
            defaultOptions
            loadOptions={handleSearch}
            components={{ LoadingIndicator }}
            onChange={(value) => setRoomMembers(value)}
            isMulti
          />
        </div>
      </form>
      <button
        className="w-full space-y-5 rounded-md bg-blue-500 py-1 px-2 text-white duration-300 hover:bg-blue-600"
        onClick={(e) => {
          e.preventDefault();
          createRoomEvent(e, roomTypes);
        }}
      >
        Create
      </button>
    </>
  );
};

const CreateRoomTab = ({
  createRoom,
  onSuccess,
}: {
  createRoom: any;
  onSuccess: () => void;
}) => {
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
    //console.log(e.target.value);
    setCreateRoomInfo((state) => {
      return { ...state, [field]: e.target.value };
    });
  };

  const createRoomEvent = (e: any, roomType: any) => {
    e.preventDefault();
    createRoom(
      {
        ...createRoomInfo,
        roomTypeId: roomType["id"],
      },
      (res: any) => onSuccess()
    );
  };
  return (
    <Tab.Group>
      <Tab.List className="flex h-8 w-full items-center justify-center">
        <div className="flex items-center justify-center rounded-lg bg-slate-200">
          {["Public", "Private", "Protected"].map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                cn(
                  "rounded-md py-1 px-4 text-center w-full h-full duration-150",
                  {
                    "bg-slate-400 shadow cursor-default": selected,
                    "  text-blue-400  hover:text-blue-500": !selected,
                  }
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </div>
      </Tab.List>
      <Tab.Panels className="mt-2">
        <Tab.Panel key="public-room-panel" className="">
          <div className="flex flex-col gap-y-2 pb-3">
            <TextInput
              name="roomName"
              label="Room Name *" // required
              placeholder="Enter room name"
              onChange={(e) => {
                handleCreateRoomInput(e, "name");
              }}
              error="Room name must be at least 3 characters"
            />
          </div>
          <SearchchatTab
            createRoomEvent={createRoomEvent}
            roomTypes={roomTypes.find((item) => item["type"] == "public")}
          />
        </Tab.Panel>
        <Tab.Panel key="private-room-panel" className="">
          <div className="flex flex-col gap-y-2 pb-3">
            <TextInput
              name="roomName"
              label="Room Name *" // required
              placeholder="Enter room name"
              onChange={(e) => {
                handleCreateRoomInput(e, "name");
              }}
              error="Room name must be at least 3 characters"
            />
          </div>
          <SearchchatTab
            createRoomEvent={createRoomEvent}
            roomTypes={roomTypes.find((item) => item["type"] == "private")}
          />
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
              <SearchchatTab
                createRoomEvent={createRoomEvent}
                roomTypes={roomTypes.find(
                  (item) => item["type"] == "protected"
                )}
              />
            </div>
          </form>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default CreateRoomTab;
