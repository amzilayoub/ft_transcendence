import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface IUIContext {
  isSettingsOpen: boolean;
  setIsSettingsOpen: Dispatch<SetStateAction<boolean>>;
}

export const UIContext = createContext<IUIContext | undefined>(undefined);

const UIContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isSettingsOpen,
      setIsSettingsOpen,
    }),
    [isSettingsOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

const useUIContext = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUIContext must be used within a UIContextProvider");
  }
  return context;
};

export { UIContextProvider, useUIContext };
