import { Dialog } from "@headlessui/react";

import Button from "@ui/Button";

import BaseModal from "./BaseModal";

interface IProps {
  title: string;
  message: string;
  type?: string;
  confirmText?: string;
  cancelText?: string;
  isConfirmLoading?: boolean;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  title,
  message,
  type = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirmLoading = false,
  isOpen,
  onConfirm,
  onCancel,
}: IProps) => (
  <BaseModal isOpen={isOpen} onClose={onCancel}>
    <div className="flex flex-col items-center justify-center p-6">
      <Dialog.Title className="text-lg font-bold text-gray-900">
        {title}
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <div className="mt-4 flex w-full justify-center gap-x-2">
        <Button
          onClick={onConfirm}
          isLoading={isConfirmLoading}
          variant={
            type === "success"
              ? "primary"
              : type === "danger"
              ? "danger"
              : "primary"
          }
        >
          {confirmText}
        </Button>
        {/* <button
          onClick={onConfirm}
          className={cn(
            "inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            {
              "bg-green-500 focus-visible:ring-green-500": type === "success",
              "bg-red-500 focus-visible:ring-red-500": type === "danger",
              "bg-blue-500 focus-visible:ring-blue-500": isConfirmLoading,
            }
          )}
        >
          {confirmText}
        </button> */}
        <Button
          onClick={onCancel}
          variant="none"
          className=" text-gray-700 hover:bg-gray-50 hover:text-black"
        >
          {cancelText}
        </Button>
      </div>
    </div>
  </BaseModal>
);

export default ConfirmationModal;
