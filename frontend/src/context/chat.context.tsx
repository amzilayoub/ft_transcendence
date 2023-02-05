import React, { createContext, useCallback, useEffect, useMemo } from "react";

import { IConversationMetaData } from "global/types";

import { useAuthContext } from "./auth.context";

export interface IChatContext {
  showChatSidebar: boolean;
  activeBoxes: any[];
  conversationsMetadata: IConversationMetaData[];
  setConversationsMetadata: any;
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
  setConversationsMetadata: () => {},
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
  const authCtx = useAuthContext();
  const [showChatSidebar, setShowChatSidebar] = React.useState(false);
  const [activeBoxes, setActiveBoxes] = React.useState<any[]>([]);
  const [conversationsMetadata, setConversationsMetadata] = React.useState(
    initialState.conversationsMetadata
  ); // these only contain the last message (meta data)
  const [error, setError] = React.useState("");

  const loadConversationsMetadata = async () => {
    // try {
    //   const resp = await basicFetch.get("/chat/room/all");
    //   if (resp.status === 200) {
    //     const data: IConversationMetaData = await resp.json();
    //     setConversationsMetadata(data);
    //   }
    // } catch (error) {
    //   setError(error.message);
    // }
  };

  const loadSingleConversation = useCallback(async (id: string) => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations/${id}`
      );

      if (resp.status === 200) {
        const data = await resp.json();
        return data;
      }
    } catch (error: any) {
      setError(error.message);
    }
  }, []);

  const activateBox = (convMetaData: any) => {
    if (
      activeBoxes &&
      activeBoxes.find((item: any) => item.id == convMetaData.id)
    )
      return;
    if (activeBoxes.length === 3) {
      setActiveBoxes([...activeBoxes.slice(1), convMetaData]);
    } else setActiveBoxes([...activeBoxes, convMetaData]);
    setConversationsMetadata((state: IConversationMetaData[]) => {
      const tmp = [...state];
      tmp.forEach((item) => {
        if (item.id === convMetaData.id) {
          item.unreadMessagesCount = 0;
          item.isActiveBox = true;
        }
      });
      return tmp;
    });
  };

  const deleteBox = useCallback(
    (id: string) => {
      setActiveBoxes(activeBoxes.filter((box: any) => box.id !== id));
      setConversationsMetadata((state: IConversationMetaData[]) => {
        const tmp = [...state];
        tmp.forEach((item) => {
          if (item.id === id) {
            item.isActiveBox = false;
          }
        });
        return tmp;
      });
    },
    [activeBoxes]
  );

  const value = useMemo(
    () => ({
      showChatSidebar,
      activeBoxes,
      deleteBox,
      conversationsMetadata: conversationsMetadata,
      setConversationsMetadata: setConversationsMetadata,
      error,
      setShowChatSidebar,
      setError,
      activateBox,
      loadConversationsMetadata,
      loadSingleConversation,
	  setActiveBoxes
    }),
    [
      showChatSidebar,
      activeBoxes,
      conversationsMetadata,
      error,
      setConversationsMetadata,
      setShowChatSidebar,
      setError,
      activateBox,
      deleteBox,
      loadSingleConversation,
	  setActiveBoxes
    ]
  );

  useEffect(() => {
    if (!authCtx.isAuthenticated) return;
    loadConversationsMetadata();
  }, [authCtx.isAuthenticated]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = (_socket: any) => {
  const context = React.useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
