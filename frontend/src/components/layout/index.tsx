import React from "react";

import ChatSidebar from "@components/chat/ChatSidebar";
import Navbar from "@components/navbar";
import cn from "classnames";
import Head from "next/head";

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
        <div className="absolute bottom-0 right-0  max-h-[calc(100vh-10rem)]">
          {true && <ChatSidebar />}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
