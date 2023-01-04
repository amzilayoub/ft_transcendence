/* eslint-disable @next/next/no-img-element */
import React from "react";

// import cn from "classnames";
import Head from "next/head";

import MainLayout from "@components/layout";
import "swiper/css";

// boxes.push("clickedBox")
// boxes.pop()

const Chat = () => {
  return (
    <MainLayout>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </MainLayout>
  );
};

export default Chat;
