import React from "react";

import cn from "classnames";
import { AiOutlineCheck } from "react-icons/ai";
import { GiPingPongBat } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { SiMediafire } from "react-icons/si";

import useUserStats from "@hooks/useUserStats";

import PlayerStatsChart from "./RadarChart";

const StatItem = ({
  icon,
  label,
  value,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
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
const UserStats = ({ username }: { username: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _stats = useUserStats(username, false);
  return (
    <nav className="flex flex-col px-4 py-5 gap-y-4 max-h-[500px] rounded-xl border bg-white shadow-lg">
      <div className="flex justify-between items-center">
        <p className="text-gray-900 text-xl font-bold">Stats</p>
      </div>
      <div className="h-px bg-gray-200 " />
      <ul className="flex flex-col gap-y-2 ">
        <StatItem icon={<GiPingPongBat />} label="Total Games" value="17" />
        <StatItem
          icon={<AiOutlineCheck />}
          label="Wins"
          value="10"
          className="text-green-500"
        />
        <StatItem
          icon={<IoMdClose />}
          label="Losses"
          value="7"
          className="text-red-500"
        />
        <StatItem
          icon={<SiMediafire />}
          label="Winrate"
          value="58%"
          className="text-blue-500"
        />
      </ul>
      <div className="flex justify-center">
        <PlayerStatsChart />
      </div>
    </nav>
  );
};

export default UserStats;
