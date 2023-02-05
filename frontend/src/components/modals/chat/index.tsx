import React from "react";

import { Tab } from "@headlessui/react";
import cn from "classnames";

import BaseModal from "@ui/BaseModal";

import CreateRoomTab from "./CreateRoomTab";
import ExploreRoomsTab from "./ExploreRoomsTab";
import SearchPeopleTab from "./SearchPeopleTab";

const ChatActionsModal = ({
  socket,
  isOpen = false,
  onClose = () => {},
}: {
  socket: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  let createRoom = (body: any, callBackFunc = (res: any) => {}) => {
    socket.emit("createRoom", body, (resp: any) => {
      callBackFunc(resp);
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="h-[calc(60vh)] w-[420px] p-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-md border">
            {["People", "Explore", "Create"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  cn(
                    "w-full rounded-lg py-2.5 text-md font-medium leading-5 cursor-pointer",
                    {
                      " ring-1 ring-primary/90 cursor-default ring-offset-1 text-primary bg-white shadow":
                        selected,
                      "text-gray-400 hover:bg-white/[0.12] hover:text-gray-600":
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
            <Tab.Panel key="people-panel" className="rounded-xl bg-white p-1">
              <SearchPeopleTab createRoom={createRoom} />
            </Tab.Panel>
            <Tab.Panel
              key={"create-panel"}
              className={cn("rounded-xl bg-white p-1")}
            >
              <ExploreRoomsTab socket={socket} onSuccess={() => onClose()} />
            </Tab.Panel>
            <Tab.Panel
              key={"discover-panel"}
              className={cn("rounded-xl bg-white p-1")}
            >
              <CreateRoomTab
                createRoom={createRoom}
                onSuccess={() => onClose()}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BaseModal>
  );
};

export default ChatActionsModal;
