import React, { useEffect } from "react";

import cn from "classnames";
import Head from "next/head";

import ChatStuff from "@components/chat/ChatStuff";
import Navbar from "@components/navbar";
import { getToken } from "@utils/auth-token";
import { io } from "socket.io-client";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  backgroundColor?: string;
  pageIsProtected?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  // pageIsProtected = true,
  title = "Transcendence",
  backgroundColor,
}) => {
  // const ctx = useAuthContext();

  // useEffect(() => {
  //   if (ctx?.isAuthenticated === false && pageIsProtected) {
  //     router.replace("/");
  //   }
  // }, []);
  

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />
      <main className="flex w-full h-full min-h-screen">
        <div
          className={cn(
            "pt-20 flex flex-col items-center w-full justify-center h-full relative",
            backgroundColor
          )}
        >
          {children}
        </div>
        <ChatStuff />
      </main>
    </>
  );
};

export default MainLayout;
