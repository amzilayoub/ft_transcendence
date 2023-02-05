/* eslint-disable @next/next/no-img-element */
import React from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import TitledCard from "@ui/TitledCard";
import { truncateString } from "@utils/format";
import { IGame } from "@utils/game/IGame";

const LiveGame = ({ game }: { game: IGame }) => (
  <div className="flex w-full items-center justify-between rounded-lg px-3 py-2 shadow-lg hover:shadow-xl">
    <div className="flex w-full flex-col">
      <p className="pb-2 text-lg font-normal">
        {truncateString(game.p1.username, 14)}
      </p>
      <div className="flex justify-around gap-x-4">
        <img
          src={game.p1.avatar_url}
          alt={game.p1.username}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex">
          <p className="ml-2 text-lg font-bold">{game.p1.score}</p>
          <span className="ml-2  font-semibold">-</span>
          <p className="ml-2 text-lg font-bold">{game.p2.score}</p>
        </div>
        <img
          src={game.p2.avatar_url}
          alt={game.p2.username}
          className="h-10 w-10 rounded-full"
        />
      </div>
      <p className="pt-2 text-right text-lg font-normal">
        {truncateString(game.p2.username, 14)}
      </p>
    </div>
  </div>
);

const LiveGames = ({ liveGames }: { liveGames: IGame[] }) => {
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
        {liveGames?.length === 0 && (
          <div className="py-6">
            <p className="text-center text-lg text-gray-500 ">
              No games are currently live, be the first to start a game!
            </p>
          </div>
        )}
        <ul className="flex flex-wrap justify-center gap-3">
          {liveGames?.map((game) => (
            <Link
              key={game.roomID}
              href={`/game/${game.roomID}/spectate`}
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
