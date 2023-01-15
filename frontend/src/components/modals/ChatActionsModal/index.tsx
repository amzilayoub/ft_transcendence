import React from "react";

import { Tab } from "@headlessui/react";
import cn from "classnames";

import BaseModal from "@components/common/BaseModal";

import CreateRoomTab from "./CreateRoomTab";
import ExploreRoomsTab from "./ExploreRoomsTab";
import SearchPeopleTab from "./SearchPeopleTab";

const ChatActionsModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 w-[420px] min-h-[calc(60vh)]">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {["People", "Explore", "Create"].map((tab) => (
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
            <Tab.Panel>
              <SearchPeopleTab />
            </Tab.Panel>
            <Tab.Panel
              key={"create-panel"}
              className={cn(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <ExploreRoomsTab />
            </Tab.Panel>
            <Tab.Panel
              key={"discover-panel"}
              className={cn(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <CreateRoomTab />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BaseModal>
  );
};

export default ChatActionsModal;
