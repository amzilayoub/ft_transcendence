import React from "react";

import Image from "next/image";

import TitledCard from "@ui/TitledCard";

const GameMode = ({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex h-64 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border p-6 shadow-xl duration-150 hover:border-black/20 hover:shadow-2xl"
  >
    <div className="flex flex-col items-center justify-center gap-y-2">
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
const GameModes = () => {
  return (
    <div className="w-full">
      <TitledCard title="Game Modes" description="Choose a mode to play">
        <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2">
          <GameMode
            title="Classic"
            description="Play the classic Pong game"
            icon="/ping-pong-logo.png"
            onClick={() => {}}
          />
          <GameMode
            title="Not Classic"
            description="Play the not classic Pong game"
            icon="/table-tennis.png"
            onClick={() => {}}
          />
        </div>
      </TitledCard>
    </div>
  );
};

export default GameModes;
