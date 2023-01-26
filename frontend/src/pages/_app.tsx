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
        </ChatProvider>
      </UIContextProvider>
    </AuthContextProvider>
  );
}
