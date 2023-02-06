import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import basicFetch from "@utils/basicFetch";

export interface ILiveGame {
  id: string;
  player1: {
    id: string;
    username: string;
    avatar_url: string;
    score: number;
  };
  player2: {
    id: string;
    username: string;
    avatar_url: string;
    score: number;
  };
  viewsCount: number;
}

const useLiveGames = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [games, setGames] = useState<ILiveGame[]>([]);

  const getGames = async () => {
    setIsRefetching(true);
    try {
      const resp = await basicFetch.get(`/games/live`);
      if (resp.status == 200) {
        const data = await resp.json();
        setGames(data);
      }
    } catch (err) {
      // console.error(err);
    } finally {
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    let socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/games/live`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    if (socket) {
      socket?.on("connect", () => {
        getGames();
      });
      socket?.on("disconnect", () => {
        //console.log("Live Game: Disconnected from socket");
      });
      socket?.on("liveGames", (data) => {
        setGames(data);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return {
    games,
    isRefetching,
    refresh: getGames,
  };
};

export default useLiveGames;
