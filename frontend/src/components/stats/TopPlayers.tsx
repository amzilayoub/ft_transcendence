import React from "react";

import cn from "classnames";
import Link from "next/link";
import useSWR from "swr";

import RoundedImage from "@ui/RoundedImage";
import TitledCard from "@ui/TitledCard";
import { getOrdinal } from "@utils/format";
import { fetcher } from "@utils/swr.fetcher";
import Image from "next/image";
import { GOLDEN_RATIO } from "@utils/constants";

interface IPlayer {
  id: string;
  username: string;
  avatar_url: string;
  // xp: number;
  // rank: number;
  score: number;
}

// const MOCK_PLAYER: IPlayer = {
//   id: "1",
//   username: "Aristotle",
//   avatar_url:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZpSv4PVhx_Bc7QOyklw0fNTpHr6K1px9Rzw&usqp=CAU",
//   xp: 1585,
//   rank: 2,
// };

const OrdinalBadge = ({ rank }: { rank: number }) => (
  <div
    className={cn(
      "text-white h-10 w-10 rounded-full flex justify-center items-center opacity-90 cursor-pointer shadow-md hover:opacity-100",
      {
        "shadow-yellow-500  bg-yellow-500": rank === 1,
        "shadow-indigo-700  bg-indigo-700 ": rank === 2,
        "shadow-green-600  bg-green-600 ": rank === 3,
      }
    )}
  >
    <p className="text-sm">
      {rank}
      {getOrdinal(rank)}
    </p>
  </div>
);

const PlayerInfo = ({player, rank} : {
  player: IPlayer,
  rank: number
}) => (
  <div className="relative flex w-full gap-x-4 px-5 py-3 w-full">
    {rank < 4 && (
      <div className="absolute -top-2 -right-2">
        <OrdinalBadge rank={rank} />
      </div>
    )}
    <Link
      key={player.id}
      href={`/u/${player.username}`}
      className="flex gap-x-3 w-full"
    >
      <Image
        src={player.avatar_url}
        alt={player.username + " avatar"}
        width={100}
        height={100}
        className="rounded-full h-12 w-12"
      />
    </Link>
      <div className="flex flex-col justify-start pt-2 w-full">
        <p className="font-semibold w-full min-w-full">{player.username}</p>
      </div>
    <div className="flex w-full items-end justify-end">
      <p className="text-sm text-gray-500">{player.score * GOLDEN_RATIO} XP</p>
    </div>
  </div>
);

const TopPlayers = () => {
  const { data: players, error } = useSWR("/users/stats/top-players", fetcher, {
    // revalidateOnFocus: false,
  });

  return (
    <div className="w-full sm:max-w-max min-w-[300px]">
      <TitledCard
        title="Top Players"
      >
        <ul className="flex flex-col gap-y-3 p-2">
          {!players?.length && (
            <p className="text-gray-500 text-center">No players yet</p>
          )}
          {players?.map((player: IPlayer, idx: number) => (
            <li
              key={player.id}
              className="flex flex-col gap-y-3 rounded-lg border shadow-lg  duration-200 hover:shadow-xl"
            >
              <PlayerInfo player={player} rank={idx + 1} />
            </li>
          ))}
        </ul>
      </TitledCard>
    </div>
  );
};

export default TopPlayers;
