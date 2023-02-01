import { useEffect, useRef, useState } from "react";

import { IGame } from "@utils/game/IGame";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

const Game = () => {
  const [games, setGames] = useState<Array<IGame>>([]);
  const router = useRouter();
  // : Map<string, IGame>
  // useffect block
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
          console.log(newGames);
        });
        // var id = crypto.randomBytes(8).toString("hex");
      } catch (error: any) {
        console.log(error.message);
      }
    };
    initSocket();
  }, []);
  console.log(router.query.error);

  return (
    <div>
      {games.map((game) =>
        game.roomID ? (
          <div key={game.roomID}>
            <h1>
              {game.roomID}: {game.p1 || "undefined"} - {game.p2 || "undefined"}{" "}
              --- {game.spectators}
            </h1>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Game;
