import React from "react";

import { GameSummary } from "@components/stats/History";
import BaseModal from "@ui/BaseModal";
import PaginationActions from "@ui/PaginationActions";

const GamesHistoryModal = ({
  userId,
  isOpen = false,
  onClose = () => {},
}: {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // const { data, isLoading } = useSWR(`/stats/${username}/history`, fetcher);
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

  const isLoading = false; // && !!username;

  const data = Array.from(
    { length: 20 },
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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      styles={{ modal: "md:min-w-[50vh] min-w-full" }}
    >
      <div className="min-h-[calc(60vh)] p-8">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">All Games</h2>
          <div className="h-px bg-gray-200 " />
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex w-full flex-col items-center gap-y-2">
              <ul className="flex w-full flex-col gap-y-2">
                {data.slice(0, 10).map((game) => (
                  <li
                    key={game.gameId}
                    className="rounded-md border border-gray-100"
                  >
                    <GameSummary {...game} />
                  </li>
                ))}
              </ul>
              <PaginationActions
                currentPage={1}
                onNext={() => {}}
                onPrevious={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default GamesHistoryModal;
