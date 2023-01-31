import React, { useEffect, useRef } from "react";

import { Game as GameType } from "phaser";

const Pong = ({ roomID, mode }: { roomID: string; mode: string }) => {
  const gameRef = useRef<GameType>();

  useEffect(() => {
    const initPhaser = async () => {
      try {
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
      } catch (error: any) {
        console.log(error.message);
      }
    };

    initPhaser();
  }, [roomID]);

  return <div id="phaser-game"></div>;
};

export default Pong;
