import GameModes from "@components/game/GameModes";
import MainLayout from "@components/layout";
import LiveGames from "@components/stats/live/LiveGames";
import TopPlayers from "@components/stats/TopPlayers";

export default function HomePage() {
  return (
    <MainLayout>
      <section className="flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-2 pt-4 sm:flex-row sm:items-start  xl:px-0 ">
        <div className="flex w-full flex-col gap-6">
          <LiveGames />
          <GameModes />
        </div>
        <TopPlayers />
      </section>
    </MainLayout>
  );
}
