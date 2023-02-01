import React, { useEffect, useRef } from "react";

import { Game as GameType } from "phaser";


const Pong = ({
  roomID,
  mode,
  userID,
}: {
  roomID: string;
  mode: string;
  userID: string;
}) => {
  const gameRef = useRef<GameType>();
  useEffect(() => {
    const initPhaser = async () => {
      try {
        console.log(roomID, mode, userID);
        const Phaser = await import("phaser");
        const { default: pongScene } = await import("@utils/game/scene");

        const config = {
          type: Phaser.AUTO,
          parent: "phaser-game",

          scale: {
            width: 800,
            height: 600,
          },
          physics: {
            default: "arcade",
          },
          fps: {
            target: 60,
            forceSetTimeOut: true,
          },

          scene: [pongScene],
          // roomID: roomID,
        };
        if (gameRef.current !== undefined) return;

        gameRef.current = new Phaser.Game(config);

        gameRef.current.cache.text.add("roomID", roomID);
        gameRef.current.cache.text.add("mode", mode);
        gameRef.current.cache.text.add("userID", `${userID}`);
      } catch (error: any) {
        // router.replace(`/game?error=${error.message}`, "/game");
        console.log(error.message);
      }
    };

    initPhaser();
  }, [roomID]);

  return <div id="phaser-game"></div>;
};

export default Pong;
