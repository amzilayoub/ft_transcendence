import React, { useEffect } from "react";

import cn from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";

import ChatStuff from "@components/chat/ChatStuff";
import LoadingPage from "@ui/LoadingPage";
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
    // console.log(
    //   pageIsProtected,
    //   ctx.loadingUser,
    //   ctx?.isAuthenticated,
    //   window.location.pathname !== "/"
    // );

    if (
      pageIsProtected &&
      !ctx.loadingUser &&
      !ctx?.isAuthenticated &&
      window.location.pathname !== "/"
    ) {
      console.log("redirecting to login page");
      router.replace("/");
    }
  }, [ctx.loadingUser]);

  // console.log(pageIsProtected, ctx?.isAuthenticated, ctx?.loadingUser);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {noLayout ? (
        <>{children}</>
      ) : (pageIsProtected && ctx?.isAuthenticated) || ctx.loadingUser ? (
        <>
          <Navbar />
          <main className="flex w-full h-full min-h-screen">
            <div
              className={cn(
                "pt-20 flex flex-col items-center w-full justify-center h-full relative pb-16", // pb-16 is for the chat stuff
                backgroundColor
              )}
            >
              {children}
            </div>
            {ctx?.isAuthenticated && <ChatStuff />}
          </main>
        </>
      ) : (
        <LoadingPage message="Not authenticated, redirecting to login page..." />
      )}
    </>
  );
};

export default MainLayout;
