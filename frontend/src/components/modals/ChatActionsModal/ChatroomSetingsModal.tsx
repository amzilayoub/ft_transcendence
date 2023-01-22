import React from "react";

import BaseModal from "@ui/BaseModal";
import { IConversationMetaData } from "global/types";

const ChatroomSetingsModal = ({
  Metadata,
  isOpen = false,
  onClose = () => {},
}: {
  Metadata: IConversationMetaData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      styles={{ modal: "xl:w-[60vw] w-[90vw] max-w-6xl" }}
    >
      <div className="p-8 min-h-[calc(60vh)]">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>
    </BaseModal>
  );
};

export default ChatroomSetingsModal;
