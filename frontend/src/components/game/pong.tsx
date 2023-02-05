import React, { useEffect, useRef } from "react";

import { Game as GameType } from "phaser";

const Pong = ({
  roomID,
  mode,
  userID,
  username,
  avatar_url,
}: {
  roomID: string;
  mode: string;
  userID: string;
  username: string;
  avatar_url: string;
}) => {
  const gameRef = useRef<GameType>();
  useEffect(() => {
    const initPhaser = async () => {
      try {
        //console.log(roomID, mode, userID);
        const Phaser = await import("phaser");
        const { pongScene } = await import("@utils/game/scene");

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
        gameRef.current.cache.text.add("username", username);
        gameRef.current.cache.text.add("avatar_url", avatar_url);
      } catch (error: any) {
        //console.log(error.message);
      }
    };

    initPhaser();
  }, [roomID]);

  useEffect(() => {
    return () => gameRef.current?.scene?.scenes[0]?.socket?.disconnect();
  }, []);

  return <div id="phaser-game"></div>;
};

export default Pong;
