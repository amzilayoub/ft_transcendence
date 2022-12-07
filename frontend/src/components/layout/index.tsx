import React from "react";

import Head from "next/head";

const MainLayout = ({
  children,
  title = "Transcendence",
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content="Ping Pong" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex flex-col min-h-screen">
      <header className="shrink-0">{/* <Navbar /> */}</header>
      <main className="grow">{children}</main>
      <footer className="shrink-0">{/* <Footer /> */}</footer>
    </div>
  </>
);
export default MainLayout;
