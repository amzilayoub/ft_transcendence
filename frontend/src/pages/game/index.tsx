import { useEffect, useRef, useState } from "react";

import { IGame } from "@utils/game/IGame";
import { useAuthContext } from "context/auth.context";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

const Game = () => {
  const [games, setGames] = useState<Array<IGame>>([]);
  const router = useRouter();

  const ctx = useAuthContext();
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
          console.log(newGames, newGames.length);
        });
        // var id = crypto.randomBytes(8).toString("hex");
      } catch (error: any) {
        console.log(error.message);
      }
    };
    initSocket();
  }, []);
  console.log(router.query.error);

  if (!ctx.isAuthenticated) return;

  return (
    <div>
      {games.map((game) =>
        game.roomID ? (
          <div key={game.roomID}>
            <h1>
              {game.mode} ({game.roomID}): [{game.p1?.userID || "-"}] vs [
              {game.p2?.userID || "-"}] --- spectators:{" "}
              {game.spectators.map((spectator) => spectator.userID).join(", ")}
            </h1>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Game;
