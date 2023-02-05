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

const PlayerStatsChart = ({
  data = {
    wins: 0,
    losses: 0,
    winRate: 0,
    total_points: 0,
    total_games: 0,


}} : {
  data: {
    wins: number,
    losses: number,
    winRate: number,
    total_points: number,
    total_games: number,
  }
}
) => {
  return (
    <Radar
      data={
      {
        labels: ["Total Games", "Total Points", "Losses", "Win Rate", "Wins"],
        datasets: [
          {
            data: [data.total_games, data.total_points, data.losses, data.winRate, data.wins * 1.2],
            backgroundColor: "rgba(255, 159, 64, 0.8)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 0.5,
          },
        ],
      }
      }
      options={{
        responsive: true,
      }}
    />
  );
};

export default PlayerStatsChart;
