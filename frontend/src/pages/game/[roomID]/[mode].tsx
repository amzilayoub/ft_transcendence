import React from "react";

import Pong from "@components/game/pong";
import { useRouter } from "next/router";

const Game = () => {
  const router = useRouter();
  let roomID = router.query.roomID as string;
  let mode = router.query.mode as string;
  if (!roomID || !mode) return;
  if ((mode !== "play" && mode !== "spectate") || roomID.length > 8) {
    router.replace("/game");
    console.log("redirected");
    return;
  }

  console.log(roomID, mode);

  return (
    <>
      <Pong roomID={roomID} mode={mode} />
    </>
  );
};

export default Game;
