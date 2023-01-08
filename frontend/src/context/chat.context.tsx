import React, { createContext, useCallback, useEffect, useMemo } from "react";

import { getToken } from "@utils/auth-token";
import basicFetch from "@utils/basicFetch";
import { IConversationMetaData } from "global/types";

export interface IChatContext {
  showChatSidebar: boolean;
  activeBoxes: any[];
  conversationsMetadata: IConversationMetaData[];
  error: string;
  setShowChatSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  activateBox: (convMetaData: any) => void;
  deleteBox: (id: string) => void;
  loadConversations: () => Promise<void>;
  loadSingleConversation: (id: string) => Promise<any>;
}

const initialState: IChatContext = {
  showChatSidebar: true,
  activeBoxes: [],
  conversationsMetadata: [],
  error: "",
  setShowChatSidebar: () => {},
  setError: () => {},
  activateBox: () => {},
  deleteBox: () => {},
  loadConversations: () => Promise.resolve(),
  loadSingleConversation: () => Promise.resolve(),
};

export const ChatContext = createContext<IChatContext>(initialState);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [showChatSidebar, setShowChatSidebar] = React.useState(true);
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

  const loadSingleConversation = useCallback(async (id: string) => {
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
  }, []);

  const activateBox = useCallback((convMetaData: any) => {
    if (activeBoxes.find((item) => item.id == convMetaData.id)) return;
    if (activeBoxes.includes(convMetaData)) return;
    if (activeBoxes.length === 3) {
      setActiveBoxes([...activeBoxes.slice(1), convMetaData]);
    } else setActiveBoxes([...activeBoxes, convMetaData]);
  }, []);

  const deleteBox = useCallback(
    (id: string) => {
      setActiveBoxes(activeBoxes.filter((box) => box["id"] !== id));
    },
    [activeBoxes]
  );

  const value = useMemo(
    () => ({
      showChatSidebar,
      activeBoxes,
      deleteBox,
      conversationsMetadata: conversationsMetadata,
      error,
      setShowChatSidebar,
      setError,
      activateBox,
      loadConversationsMetadata,
      loadSingleConversation,
    }),
    [
      showChatSidebar,
      activeBoxes,
      conversationsMetadata,
      error,
      setShowChatSidebar,
      setError,
      activateBox,
      deleteBox,
      loadSingleConversation,
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
