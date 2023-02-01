import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import Pong from "@components/game/pong";
import { useAuthContext } from "context/auth.context";

const Game = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const ctx = useAuthContext();
  const router = useRouter();
  let roomID = router.query.roomID as string;
  let mode = router.query.mode as string;
  // if (!roomID || !mode || !router.isReady) return;
  useEffect(() => {
    if (!roomID || !mode || !router.isReady) {
      return;
    } else if ((mode !== "play" && mode !== "spectate") || roomID.length > 8) {
      router.replace("/game");
      console.log("redirected");
      return;
    } else {
      setPageLoaded(true);
    }
  }, [roomID, mode, router]);
  console.log(roomID, mode, ctx.user);

  if (!pageLoaded) return <></>;
  return (
    <>
      <Pong roomID={roomID} mode={mode} userID={ctx.user?.id} />
      {/* <div
        className="flex flex-col items-center justify-center w-full h-96 bg-red-500"
      >

      </div> */}
    </>
  );
};

export default Game;
