import React from "react";

import cn from "classnames";
import Head from "next/head";

import ChatBox from "@components/chat/ChatBox";
import ChatSidebar from "@components/chat/ChatSidebar";
import Navbar from "@components/navbar";

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
        <div className="absolute bottom-0 right-0  max-h-[calc(100vh-10rem)] px-6">
          {true && <ChatSidebar />}
          <ul className="absolute bottom-0 flex right-80 gap-x-3">
            {[1, 2, 4].map((i) => (
              <li key={i} className="w-full">
                <ChatBox />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default MainLayout;
