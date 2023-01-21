import React, { useEffect, useRef } from "react";

import { Game as GameType } from "phaser";

const Pong = ({ roomID }: { roomID: string }) => {
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
          scene: [pongScene],
          roomID: roomID,
        };
        if (gameRef.current !== undefined) return;

        gameRef.current = new Phaser.Game(config);

        gameRef.current.cache.text.add("roomID", roomID);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    initPhaser();
  }, [roomID]);

  return <div id="phaser-game"></div>;
};

export default Pong;
