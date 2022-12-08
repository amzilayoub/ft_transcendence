import React from "react";

import Navbar from "@components/navbar";
import cn from "classnames";
import Head from "next/head";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  backgroundColor?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Transcendence",
  backgroundColor,
}) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <Navbar />
    <main className="flex h-full min-h-screen w-full">
      <div
        className={cn(
          "mt-20 flex flex-col items-center w-full justify-center h-full",
          backgroundColor
        )}
      >
        {children}
      </div>
    </main>
  </>
);

export default MainLayout;
