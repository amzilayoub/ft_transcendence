import React from "react";

import cn from "classnames";
import { AiOutlineCheck } from "react-icons/ai";
import { GiPingPongBat } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { SiMediafire } from "react-icons/si";

import useUserStats from "@hooks/useUserStats";

import PlayerStatsChart from "./RadarChart";
import { GOLDEN_RATIO } from "@utils/constants";

const StatItem = ({
  icon,
  label,
  value,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <li className="flex justify-between">
    <div className={cn("flex gap-x-2 items-center", className)}>
      {icon && icon}
      <p className={cn("text-gray-900 text-sm font-medium", className)}>
        {label}
      </p>
    </div>

    <p
      className={cn("text-gray-900 text-sm font-medium", {
        "pr-3": value.toString().length < 3,
      })}
    >
      {value}
    </p>
  </li>
);

const UserStats = ({ userID }: { userID: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stats = useUserStats(userID, true);
  return (
    <nav className="flex max-h-[500px] flex-col gap-y-4 rounded-xl border bg-white px-4 py-5 shadow-lg min-w-[300px]">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-gray-900">Stats</p>
      </div>
      <div className="h-px bg-gray-200 " />
      <ul className="flex flex-col gap-y-2 ">
        <StatItem
          icon={<GiPingPongBat />}
          label="Total Games"
          value={stats.data?.gamesPlayed || 0}
        />
        <StatItem
          icon={<AiOutlineCheck />}
          label="Wins"
          value={stats.data?.wins || 0}
          className="text-green-500"
        />
        <StatItem
          icon={<IoMdClose />}
          label="Losses"
          value={stats.data?.losses || 0}
          className="text-red-500"
        />
        <StatItem
          icon={<SiMediafire />}
          label="Winrate"
          value={
            (stats.data?.wins && stats.data?.losses
              ? Math.round((stats.data?.wins / stats.data?.gamesPlayed) * 100)
              : 0) + "%"
          }
          className="text-blue-500"
        />
      </ul>
      {/* <div className="flex justify-center">
        <PlayerStatsChart 
          data={
            {
              // data: [data.total_games, data.total_points, data.losses, data.winRate, data.wins * 1.2],
              wins: stats.data?.wins || 0,
              losses: stats.data?.losses || 0,
              total_games: stats.data?.gamesPlayed || 0,
              total_points: (stats.data?.wins || 0) * 1.4,
              winRate: stats.data?.wins && stats.data?.losses ? Math.round((stats.data?.wins / stats.data?.gamesPlayed) * 100) : 0,
            }
          }
        />
      </div> */}
    </nav>
  );
};

export default UserStats;
