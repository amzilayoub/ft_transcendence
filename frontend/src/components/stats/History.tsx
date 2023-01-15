import React from "react";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

import GamesHistoryModal from "@components/modals/GamesHistoryModal";
import { truncateString } from "@utils/format";

interface GameSummaryProps {
  player1: {
    username: string;
    avatar: string;
    score: number;
  };
  player2: {
    username: string;
    avatar: string;
    score: number;
  };
  gameId: string;
  gameDuration: string;
  gameTime: string;
}

const GamePlayer = (props: {
  username: string;
  avatar: string;
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
    <Link href={`/u/${props.username}`} className="  flex items-center ">
      <Image
        src={props.avatar}
        alt={props.username + " avatar"}
        width={64}
        height={64}
        className="rounded-full object-cover w-14 h-14"
      />
    </Link>
    <div
      className={cn("flex w-full justify-between gap-x-2", {
        "flex-row-reverse": !props.isPlayer1,
      })}
    >
      <Link
        href={`/u/${props.username}`}
        className="whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {truncateString(props.username, 10)}
      </Link>
      <p className="">{props.score}</p>
    </div>
  </div>
);

export const GameSummary = (props: GameSummaryProps) => (
  <div className="flex w-full h-full">
    <div className="py-2">
      <div
        className={cn("w-px h-full", {
          "bg-green-300": props.player1.score > props.player2.score,
          "bg-red-300": props.player1.score < props.player2.score,
        })}
      />
    </div>
    <div
      className={cn("grid grid-cols-2 w-full hover:shadow", {
        "shadow-green-300": props.player1.score > props.player2.score,
        "shadow-red-300": props.player1.score < props.player2.score,
      })}
    >
      <GamePlayer {...props.player1} isPlayer1 />
      <GamePlayer {...props.player2} isPlayer1={false} />
    </div>
  </div>
);

const LastGames = ({ username }: { username: string }) => {
  const [seeAll, setSeeAll] = React.useState(false);
  //   const { data, isLoading } = useSWR(`/stats/${username}/history`, fetcher);
  const sample = [
    {
      player1: {
        username: "Aristotle",
        avatar: "https://miro.medium.com/max/750/1*js7p_khAWKrKVQpwT1pxjQ.jpeg",
        score: 5,
      },
      player2: {
        username: "Plato",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkV4LJG_3TQbtEor3nN-FTlBwpDJC6F6KVSg&usqp=CAU",
        score: 4,
      },
      gameId: "123",
      gameDuration: "10",
      gameTime: "2021-09-01T12:00:00.000Z",
    },
  ];
  const isLoading = false && !!username;

  const data = Array.from(
    { length: 10 },
    () => sample[Math.floor(Math.random() * sample.length)]
  ).map((game) => {
    const score1 = Math.floor(Math.random() * 9);
    const score2 = 9 - score1;
    return {
      ...game,
      player1: {
        ...game.player1,
        score: score1,
      },
      player2: {
        ...game.player2,
        score: score2,
      },
      gameId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
    };
  });

  return (
    <>
      <nav className="flex flex-col px-4 py-5 gap-y-4 min-h-[400px] rounded-xl border bg-white shadow-lg">
        <div className="flex justify-between items-center">
          <p className="text-gray-900 text-xl font-bold">Recent Games</p>
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
            {data.slice(0, 10).map((game) => (
              <li
                key={game.gameId}
                className="border border-gray-100 rounded-md"
              >
                <GameSummary {...game} />
              </li>
            ))}
          </ul>
        )}
      </nav>
      {seeAll && (
        <GamesHistoryModal
          username={username}
          isOpen={seeAll}
          onClose={() => setSeeAll(false)}
        />
      )}
    </>
  );
};

export default LastGames;
