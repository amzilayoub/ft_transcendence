import React, { createContext, useCallback, useEffect, useMemo } from "react";

import { getToken, setToken } from "@utils/auth-token";
import basicFetch from "@utils/basicFetch";
import { IConversationMetaData } from "global/types";

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
    setConversationsMetadata((state) => {
      const tmp = [...state];
      tmp.forEach((item) => {
        if (item.id === convMetaData.id) item.unreadMessagesCount = 0;
      });
      return tmp;
    });
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
      setConversationsMetadata: setConversationsMetadata,
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
      setConversationsMetadata,
      setShowChatSidebar,
      setError,
      activateBox,
      deleteBox,
      loadSingleConversation,
    ]
  );

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.token) setToken(params.token);
    loadConversationsMetadata();
  }, []);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = (socket) => {
  const context = React.useContext(ChatContext);

  useEffect(() => {
    if (socket) {
      socket.on("updateListConversations", (obj) => {
        context.setConversationsMetadata((state) => {
          let targetedRoom = null;
          const newState = state.filter((item) => {
            if (item.room_id != obj.room.room_id) {
              targetedRoom = item;
              return true;
            }
            return false;
          });
          if (obj.clientId != socket.id)
            obj.room.unreadMessagesCount +=
              targetedRoom.unreadMessagesCount + 1;
          if (newState.length !== state.length) {
			socket.emit('')
          }
          return [obj.room, ...newState];
        });
      });
    }
  }, [context.setConversationsMetadata, socket]);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
