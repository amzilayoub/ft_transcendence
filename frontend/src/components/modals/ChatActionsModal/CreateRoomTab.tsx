import { Tab } from "@headlessui/react";
import cn from "classnames";

import TextInput from "@ui/TextInput";

const CreateRoomTab = () => {
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
        <Tab.Panel key="protected-room-panel" className="">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          </p>
        </Tab.Panel>
        <Tab.Panel key="protected-room-panel" className="">
          <form action="">
            <div className="flex flex-col gap-y-2">
              <TextInput
                label="Room Name *"
                placeholder="Enter room name"
                onChange={(e) => {
                  e.preventDefault();
                }}
                error="Room name must be at least 3 characters"
              />
              <TextInput
                label="Room Password"
                placeholder="Enter room password"
                onChange={(e) => {
                  e.preventDefault();
                }}
              />
              <TextInput
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
