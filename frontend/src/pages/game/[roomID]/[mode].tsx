import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import Pong from "@components/game/pong";
import MainLayout from "@components/layout";
import Button from "@ui/Button";
import { useAuthContext } from "context/auth.context";

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
      roomID.length !== 8
    ) {
      router.replace(`/home?error=404`, "/home");
      return;
    } else {
      setPageLoaded(true);
    }
  }, [roomID, mode, router, ctx.user?.id]);

  if (!pageLoaded) return <></>;
  //console.log(roomID, mode, ctx.user?.id);
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full h-full gap-y-4">
        <Pong
          roomID={roomID}
          mode={mode}
          userID={ctx.user?.id || ""}
          username={ctx.user?.username || ""}
          avatar_url={ctx.user?.avatar_url || ""}
        />
        <div className="it flex flex-col items-center w-full h-full gap-y-4">
          {
            <Button
              // onClick={() => {
              variant="danger"
            >
              Leave Game
            </Button>
          }
        </div>
      </div>
    </MainLayout>
  );
};

export default Game;
