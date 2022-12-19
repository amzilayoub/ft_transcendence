import React from "react";

import cn from "classnames";
import Head from "next/head";

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
      <main className="flex h-full min-h-screen w-full">
        <div
          className={cn(
            "pt-20 flex flex-col items-center w-full justify-center h-full",
            backgroundColor
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
