import React, { useEffect } from "react";

import cn from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";

import ChatStuff from "@components/chat/ChatStuff";
import Navbar from "@components/navbar";
import { useAuthContext } from "context/auth.context";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  noLayout?: boolean;
  backgroundColor?: string;
  pageIsProtected?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  pageIsProtected = true,
  noLayout = false,
  title = "Transcendence",
  backgroundColor,
}) => {
  const ctx = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (
      ctx?.isAuthenticated === false &&
      pageIsProtected &&
      window.location.pathname !== "/"
    )
      router.replace("/");
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {noLayout ? (
        <>{children}</>
      ) : (
        <>
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
            {ctx?.isAuthenticated && <ChatStuff />}
          </main>
        </>
      )}
    </>
  );
};

export default MainLayout;
