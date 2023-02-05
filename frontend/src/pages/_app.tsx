import { ToastBase } from "@components/toast";
import "@styles/globals.css";
import { AuthContextProvider } from "context/auth.context";
import { ChatProvider } from "context/chat.context";
import { UIContextProvider } from "context/ui.context";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <UIContextProvider>
        <ChatProvider>
          <Component {...pageProps} />
          {/* <ToastBase 
            username={"username"}
            avatar_url= "https://res.cloudinary.com/transcendence-tmp/image/upload/v1675548190/ksmh6glsvtzbjrmiagky.png"
            message={"/game/abcdef"}
            isGame
          /> */}
        </ChatProvider>
      </UIContextProvider>
    </AuthContextProvider>
  );
}
