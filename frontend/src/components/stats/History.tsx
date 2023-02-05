import React from "react";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

import GamesHistoryModal from "@components/modals/GamesHistoryModal";
import { truncateString } from "@utils/format";
import { fetcher } from "@utils/swr.fetcher";
import useSWR from "swr/immutable";

interface GameSummaryProps {
  player1: {
    username: string;
    avatar_url: string;
    score: number;
  };
  player2: {
    username: string;
    avatar_url: string;
    score: number;
  };
  gameId: string;
  gameDuration: string;
  gameTime: string;
}

const GamePlayer = (props: {
  username: string;
  avatar_url: string;
  score: number;
  isPlayer1: boolean;
}) => (
  <div
    className={cn(
      "flex gap-x-4 border-black px-3 py-3 w-full h-full items-center",
      {
        "border-r-1": props.isPlayer1,
        "flex-row-reverse border-l-1": !props.isPlayer1,
      }
    )}
  >
    <Link href={`/u/${props.username}`} className="flex items-center ">
      <div className="relative h-[60px] w-[60px] gap-4">
        <figure className="group absolute flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-black transition">
          <Image
            src={props.avatar_url}
            alt={props.username + " avatar"}
            fill
            className="h-14 w-14 rounded-full object-cover"
          />
        </figure>
      </div>
    </Link>
    <div
      className={cn("flex w-full justify-between gap-x-2", {
        "flex-row-reverse": !props.isPlayer1,
      })}
    >
      <Link
        href={`/u/${props.username}`}
        className="overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {truncateString(props.username, 10)}
      </Link>
      <p className="">{props.score}</p>
    </div>
  </div>
);

export const GameSummary = (props: GameSummaryProps) => (
  <div className="flex h-full w-full">
    <div className="py-2">
      <div
        className={cn("w-px h-full", {
          "bg-green-300": props.player1.score > props.player2.score,
          "bg-red-300": props.player1.score < props.player2.score,
        })}
      />
    </div>
    <div
      className={cn("grid grid-cols-2 w-full hover:shadow duration-200", {
        "shadow-green-300": props.player1.score > props.player2.score,
        "shadow-red-300": props.player1.score < props.player2.score,
      })}
    >
      <GamePlayer {...props.player1} isPlayer1 />
      <GamePlayer {...props.player2} isPlayer1={false} />
    </div>
  </div>
);

const LastGames = ({ userId }: { userId: number }) => {
  const [seeAll, setSeeAll] = React.useState(false);
    const { data, isLoading } = useSWR(userId !== undefined ? `/games/${userId}` : null, fetcher);
  
console.log("D:", data);
  return (
    <>
      <nav className="flex min-h-[400px] flex-col gap-y-4 rounded-xl border bg-white px-4 py-5 shadow-lg #max-w-lg">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">Recent Games</p>
          <button
            onClick={() => setSeeAll(true)}
            className="text-sm font-semibold text-primary"
          >
            See all
          </button>
        </div>
        <div className="h-px bg-gray-200 " />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="flex flex-col gap-y-2 ">
            {data?.slice(0, 10).map((game) => (
              <li
                key={game.gameId}
                className="rounded-md border border-gray-100"
              >
                <GameSummary {...game} />
              </li>
            ))}
          </ul>
        )}
      </nav>
      {seeAll && (
        <GamesHistoryModal
          userId={userId}
          isOpen={seeAll}
          onClose={() => setSeeAll(false)}
        />
      )}
    </>
  );
};

export default LastGames;
