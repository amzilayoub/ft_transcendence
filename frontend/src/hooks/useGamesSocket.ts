import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

import { IGame } from "@utils/game/IGame";

const useGamesSocket = () => {
  const [games, setGames] = useState<Array<IGame>>([]);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const initSocket = async () => {
      try {
        if (socketRef.current !== undefined) return;

        fetch("/api/socket");
        socketRef.current = io();

        socketRef.current.on("connect", () => {
          socketRef.current.emit("sub_info");
        });

        socketRef.current.on("get_info", (newGames) => {
          setGames(newGames);
          //console.log(newGames, newGames.length);
        });
      } catch (error: any) {
        //console.log(error.message);
      }
    };
    initSocket();
  }, []);

  return games;
};

export default useGamesSocket;
