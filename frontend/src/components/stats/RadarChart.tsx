import React from "react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const total_Games = 17;
const wins = 10;
const losses = 7;
const serves = 10; // how many times you served
const total_points = wins * 2 - losses * 1;

export const data = {
  labels: ["Total Games", "Total Points", "Losses", "Serves", "Wins"],
  datasets: [
    {
      data: [total_Games, total_points, losses, serves, wins * 1.2],
      backgroundColor: "rgba(255, 159, 64, 0.8)",
      borderColor: "rgba(255, 159, 64, 1)",
      borderWidth: 0.5,
    },
  ],
};

const PlayerStatsChart = () => {
  return (
    <Radar
      data={data}
      options={{
        responsive: true,
      }}
    />
  );
};

export default PlayerStatsChart;
