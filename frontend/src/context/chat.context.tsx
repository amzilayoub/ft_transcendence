import React, { createContext, useEffect, useMemo } from "react";

import { getToken, setToken } from "@utils/auth-token";
import { IConversationMetaData } from "global/types";
import basicFetch from "@utils/basicFetch";

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
  conversationsMetadata: [],

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
  const [conversationsMetadata, setConversationsMetadata] = React.useState(
    initialState.conversationsMetadata
  ); // these only contain the last message (meta data)
  const [error, setError] = React.useState("");

  const loadConversationsMetadata = async () => {
    try {
      const resp = await basicFetch.get("/chat/rooms");

      if (resp.status === 200) {
        const data: IConversationMetaData = await resp.json();
        // console.log(data);
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
      conversationsMetadata: conversationsMetadata,
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

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    setToken(params.token);
    loadConversationsMetadata();
  }, []);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
