import React, { useEffect, useState } from "react";

import Pong from "@components/game/pong";
import { useAuthContext } from "context/auth.context";
import { useRouter } from "next/router";

const Game = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const ctx = useAuthContext();
  const router = useRouter();
  let roomID = router.query.roomID as string;
  let mode = router.query.mode as string;
  // if (!roomID || !mode || !router.isReady) return;
  useEffect(() => {
    if (!roomID || !mode || !router.isReady || !ctx.user?.id) {
      return;
    } else if (
      (mode !== "classic" &&
        mode !== "blitz" &&
        mode !== "powerUp" &&
        mode !== "spectate") ||
      roomID.length > 8
    ) {
      router.replace(`/game?error=404`, "/game");
      return;
    } else {
      setPageLoaded(true);
    }
  }, [roomID, mode, router, ctx.user?.id]);

  if (!pageLoaded) return <></>;
  console.log(roomID, mode, ctx.user?.id);
  return (
    <>
      <Pong roomID={roomID} mode={mode} userID={ctx.user?.id} />
    </>
  );
};

export default Game;
