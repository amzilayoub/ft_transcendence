/* eslint-disable @next/next/no-img-element */
import React from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import useLiveGames, { ILiveGame } from "@hooks/useLiveGames";
import TitledCard from "@ui/TitledCard";
import { truncateString } from "@utils/format";

// import { GameSummary } from "../History";

const GameSummary = dynamic(
  () => import("@components/stats/History").then((mod) => mod.GameSummary),
  {
    ssr: false,
  }
);

const MOCK_GAMES: ILiveGame[] = [
  {
    id: "1",
    viewsCount: 3,
    player1: {
      id: "1",
      username: "Aristotle",
      avatar_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZpSv4PVhx_Bc7QOyklw0fNTpHr6K1px9Rzw&usqp=CAU",
      score: 5,
    },
    player2: {
      id: "2",
      username: "Plato",
      avatar_url:
        "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_700/MTgwMDE1OTM1MjA4NjI5Mzcw/the-ancient-greek-philosopher-plato-his-life-and-works.webp",
      score: 4,
    },
  },
];

const LiveGame = ({ game }: { game: ILiveGame }) => (
  <div className="flex w-full items-center justify-between rounded-lg px-3 py-2 shadow-lg hover:shadow-xl">
    <div className="flex w-full flex-col">
      <p className="pb-2 text-lg font-normal">
        {truncateString(game.player1.username, 14)}
      </p>
      <div className="flex justify-around gap-x-4">
        <img
          src={game.player1.avatar_url}
          alt={game.player1.username}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex">
          <p className="ml-2 text-lg font-bold">{game.player1.score}</p>
          <span className="ml-2  font-semibold">-</span>
          <p className="ml-2 text-lg font-bold">{game.player2.score}</p>
        </div>
        <img
          src={game.player2.avatar_url}
          alt={game.player2.username}
          className="h-10 w-10 rounded-full"
        />
      </div>
      <p className="pt-2 text-right text-lg font-normal">
        {truncateString(game.player2.username, 14)}
      </p>
    </div>
  </div>
);

const LiveGames = () => {
  const { refresh, isRefetching } = useLiveGames();
  const games = new Array(4).fill(MOCK_GAMES).flat();

  return (
    <div className="w-full">
      <TitledCard
        title="Live Games"
        // actions={
        //   <button
        //     onClick={refresh}
        //     className="text-2xl font-bold text-primary hover:text-primary/80"
        //   >
        //     <RiRefreshLine className={cn({ "animate-spin": isRefetching })} />
        //   </button>
        // }
        actions={
          <button
            // onClick={() => setSeeAll(true)}
            className="text-sm font-semibold text-primary"
          >
            See All
          </button>
        }
      >
        {games?.length === 0 && (
          <div className="py-6">
            <p className="text-center text-lg text-gray-500 ">
              No games are currently live, be the first to start a game!
            </p>
          </div>
        )}
        <ul className="flex flex-wrap justify-center gap-3">
          {games?.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="flex w-fit min-w-min flex-col gap-y-3 rounded-lg border duration-200"
            >
              <LiveGame game={game} />
            </Link>
          ))}
        </ul>
      </TitledCard>
    </div>
  );
};

export default LiveGames;