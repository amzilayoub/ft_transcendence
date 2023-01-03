import "@styles/globals.css";
import { AuthContextProvider } from "context/auth.context";
import { ChatProvider } from "context/chat.context";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </AuthContextProvider>
  );
}
