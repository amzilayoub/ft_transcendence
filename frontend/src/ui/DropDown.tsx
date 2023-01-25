import React, { Fragment } from "react";

import { Menu, Transition } from "@headlessui/react";

export interface DropDownProps {
  children: React.ReactNode;
  menuButton: React.ReactNode;
  onClose?: () => void;
}

export interface MenuItemProps {
  children: React.ReactNode;
  label?: string;
  href?: string;
  onClick?: () => void;
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
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            {React.Children.map(props.children, (child) => (
              <Menu.Item>
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    props.onClose?.();
                  }}
                  className="p-1"
                >
                  <div>{child}</div>
                </div>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropDown;
