import React, { Fragment } from "react";

import { Menu, Transition } from "@headlessui/react";

export interface MenuItemProps {
  children: React.ReactNode;
  label?: string;
  href?: string;
  onClick?: () => void;
}
export interface DropDownProps {
  menuButton: React.ReactNode;
  children: React.ReactNode;
}

export interface MenuLinkProps {
  children: React.ReactNode;
  href: string;
  props?: any;
}

const DropDown: React.FC<DropDownProps> = (props) => {
  return (
    <div className="flex w-full justify-end">
      <Menu as="div" className="relative">
        <div>
          <Menu.Button as="div">{props.menuButton}</Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5  focus:outline-none">
            <div className="p-1">
              {React.Children.map(props.children, (child) => (
                <Menu.Item>
                  <div>{child}</div>
                  {/* {({ active }) => (
                    <div
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex justify-between items-center px-4 py-2 text-sm`}
                    >
                      {child}
                    </div>
                  )} */}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropDown;
