import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";
import cn from "classnames";

interface BaseModalProps {
  children: React.ReactNode;
  styles?: {
    modalContainer?: string;
    modalOverlay?: string;
    modal?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function BaseModal(props: BaseModalProps) {
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={cn(
              "fixed inset-0 h-full w-full bg-black/50",
              props.styles?.modalOverlay
            )}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div
            className={cn(
              "flex min-h-full justify-center p-2 text-center",
              // couldn't override the base styles so im dumbly forcing it
              props.styles?.modalContainer?.includes("items-")
                ? ""
                : "items-center",
              props.styles?.modalContainer
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  "relative w-full max-w-max overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all",
                  props.styles?.modal
                )}
              >
                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
