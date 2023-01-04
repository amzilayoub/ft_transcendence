import React, { createContext, useMemo } from "react";

import { getToken } from "@utils/auth-token";
import { IConversation, IConversationMetaData } from "global/types";

export interface IChatContext {
  activeBoxes: string[];
  conversationsMetadata: IConversationMetaData[];
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  activateBox: (id: string) => void;
  deleteBox: (id: string) => void;
  loadConversations: () => Promise<void>;
  loadSingleConversation: (id: string) => Promise<any>;
}

const initialState: IChatContext = {
  activeBoxes: [],
  conversationsMetadata: [
    {
      id: "1",
      avatarUrl: "https://martinfowler.com/mf.jpg",
      name: "John Doe",
      lastMessage:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
      lastMessageTime: "12:00",
      unreadMessagesCount: 1,
    },
    {
      id: "2",
      avatarUrl: "https://martinfowler.com/mf.jpg",
      name: "John Doe",
      lastMessage:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
      lastMessageTime: "12:00",
      unreadMessagesCount: 1,
    },
    {
      id: "3",
      avatarUrl: "https://martinfowler.com/mf.jpg",
      name: "John Doe",
      lastMessage:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
      lastMessageTime: "12:00",
      unreadMessagesCount: 1,
    },
    {
      id: "4",
      avatarUrl: "https://martinfowler.com/mf.jpg",
      name: "John Doe",
      lastMessage:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
      lastMessageTime: "12:00",
      unreadMessagesCount: 1,
    },
  ],

  error: "",
  setError: () => {},
  activateBox: () => {},
  deleteBox: () => {},
  loadConversations: () => Promise.resolve(),
  loadSingleConversation: () => Promise.resolve(),
};

export const ChatContext = createContext<IChatContext>(initialState);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeBoxes, setActiveBoxes] = React.useState<string[]>([]);
  const [conversationsMetadata, setConversationsMetadata] = React.useState([]); // these only contain the last message (meta data)
  const [error, setError] = React.useState("");

  const loadConversationsMetadata = async () => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      if (resp.status === 200) {
        const data = await resp.json();
        setConversationsMetadata(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const loadSingleConversation = async (id: string) => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations/${id}`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      if (resp.status === 200) {
        const data = await resp.json();
        return data;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const activateBox = (id: string) => {
    if (activeBoxes.includes(id)) return;
    if (activeBoxes.length === 3) {
      setActiveBoxes([...activeBoxes.slice(1), id]);
    } else setActiveBoxes([...activeBoxes, id]);
  };

  const deleteBox = (id: string) => {
    setActiveBoxes(activeBoxes.filter((box) => box !== id));
  };

  const value = useMemo(
    () => ({
      activeBoxes,
      deleteBox,
      conversationsMetadata: [...new Array(20)].fill(
        initialState.conversationsMetadata[0]
      ),
      error,
      setError,
      activateBox,
      loadConversationsMetadata,
      loadSingleConversation,
    }),
    [
      activeBoxes,
      conversationsMetadata,
      error,
      setError,
      // activateBox,
      // loadConversations,
      // loadSingleConversation,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
