import React, { useEffect, useRef, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

import TitledCard from "@ui/TitledCard";
import { IGame } from "@utils/game/IGame";

const GameMode = ({
  title,
  description,
  icon,
  isQueueEmpty,
  amIalreadyInAGameOrWaiting,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  isQueueEmpty: boolean;
  amIalreadyInAGameOrWaiting: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={() => !amIalreadyInAGameOrWaiting && isQueueEmpty && onClick()}
    className="flex h-64 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border p-6 shadow-xl duration-150 hover:border-black/20 hover:shadow-2xl"
  >
    <div
      className={cn("flex flex-col items-center justify-center gap-y-2", {
        "opacity-50": amIalreadyInAGameOrWaiting || !isQueueEmpty,
      })}
    >
      <div className="h-24 w-24">
        <Image
          src={icon}
          alt="game mode icon"
          width={100}
          height={100}
          className="h-full w-full"
        />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <p className="text-gray-500">{description}</p>
  </div>
);

export const GameModes = ({
  waitingPlayers,
  amIalreadyInAGameOrWaiting,
}: {
  waitingPlayers: Array<IGame>;
  amIalreadyInAGameOrWaiting: boolean;
}) => {
  const router = useRouter();
  const [games, setGames] = useState<Array<IGame>>([]);
  const [showWaitingPlayerModal, setShowWaitingPlayerModal] = useState(false);
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

  const handleJoinGame = (mode: string) => {
    //console.log(mode);
    const game = games.find((game) => game.mode === mode);
    if (game) {
      setShowWaitingPlayerModal(true);
      // router.push(`/game/${game.roomID}/${mode}`);
    } else {
      const roomID = Math.random().toString(36).substring(2, 10);
      router.push(`/game/${roomID}/${mode}`);
    }
  };

  return (
    <div className="w-full">
      <TitledCard title="Game Modes" description="Choose a mode to play">
        <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2">
          <GameMode
            title="Classic"
            description="Play the classic Pong game"
            icon="/ping-pong-logo.png"
            isQueueEmpty={
              waitingPlayers.filter((game) => game.mode === "classic")
                .length === 0
            }
            amIalreadyInAGameOrWaiting={amIalreadyInAGameOrWaiting}
            onClick={() => handleJoinGame("classic")}
          />
          <GameMode
            title="Power Up"
            description="Play the not classic Pong game"
            icon="/table-tennis.png"
            isQueueEmpty={
              waitingPlayers.filter((game) => game.mode === "powerUp")
                .length === 0
            }
            amIalreadyInAGameOrWaiting={amIalreadyInAGameOrWaiting}
            onClick={() => handleJoinGame("powerUp")}
          />
        </div>
      </TitledCard>
    </div>
  );
};

export default GameModes;
