import React from "react";

import cn from "classnames";
import Link from "next/link";

import RoundedImage from "@ui/RoundedImage";
import TitledCard from "@ui/TitledCard";
import { getOrdinal } from "@utils/format";

interface IPlayer {
  id: string;
  username: string;
  avatar_url: string;
  xp: number;
  rank: number;
}

const MOCK_PLAYER: IPlayer = {
  id: "1",
  username: "Aristotle",
  avatar_url:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZpSv4PVhx_Bc7QOyklw0fNTpHr6K1px9Rzw&usqp=CAU",
  xp: 1585,
  rank: 2,
};

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

const PlayerInfo = (player: IPlayer) => (
  <div className="relative flex w-full gap-x-4 px-5 py-3 sm:w-72">
    {player.rank < 4 && (
      <div className="absolute -top-2 -right-2">
        <OrdinalBadge rank={player.rank} />
      </div>
    )}
    <Link
      key={player.id}
      href={`/u/${player.username}`}
      className="flex flex-row gap-x-3"
    >
      <RoundedImage
        src={player.avatar_url}
        alt={player.username + " avatar"}
        size="60px"
      />
      <div className="flex flex-col justify-start pt-2">
        <p className="font-semibold">{player.username}</p>
      </div>
    </Link>

    <div className="flex w-full items-end justify-end">
      <p className="text-gray-500">{player.xp} XP</p>
    </div>
  </div>
);

const TopPlayers = () => {
  // const { data: players, error } = useSWR("/stats/top-players", fetcher, {
  //   revalidateOnFocus: false,
  // });
  return (
    <div className="w-full sm:max-w-max">
      <TitledCard
        title="Top Players"
        actions={
          <button
            // onClick={() => setSeeAll(true)}
            className="text-sm font-semibold text-primary"
          >
            See All
          </button>
        }
      >
        <ul className="flex flex-col gap-y-3 p-2">
          {[...new Array(5).fill(MOCK_PLAYER)]?.map((player: IPlayer, idx) => (
            <li
              key={player.id}
              className="flex flex-col gap-y-3 rounded-lg border shadow-lg  duration-200 hover:shadow-xl"
            >
              <PlayerInfo {...player} rank={idx + 1} />
            </li>
          ))}
        </ul>
      </TitledCard>
    </div>
  );
};

export default TopPlayers;
