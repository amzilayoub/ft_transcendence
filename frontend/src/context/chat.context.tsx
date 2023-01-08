import React, { createContext, useEffect, useMemo } from "react";

import { getToken } from "@utils/auth-token";
import basicFetch from "@utils/basicFetch";
import { IConversationMetaData } from "global/types";

export interface IChatContext {
  activeBoxes: any[];
  conversationsMetadata: IConversationMetaData[];
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  activateBox: (convMetaData: any) => void;
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
  const [activeBoxes, setActiveBoxes] = React.useState<any[]>([]);
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

  const activateBox = (convMetaData: any) => {
    if (activeBoxes.find((item) => item.id == convMetaData.id)) return;
    if (activeBoxes.includes(convMetaData)) return;
    if (activeBoxes.length === 3) {
      setActiveBoxes([...activeBoxes.slice(1), convMetaData]);
    } else setActiveBoxes([...activeBoxes, convMetaData]);
  };

  const deleteBox = (id: string) => {
    setActiveBoxes(activeBoxes.filter((box) => box["id"] !== id));
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
    // const params = new Proxy(new URLSearchParams(window.location.search), {
    //   get: (searchParams, prop) => searchParams.get(prop),
    // });
    // setToken(params.token);
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
