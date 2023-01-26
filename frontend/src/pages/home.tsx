import MainLayout from "@components/layout";
import LiveGames from "@components/stats/live/LiveGames";
import TopPlayers from "@components/stats/TopPlayers";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex w-full justify-center gap-x-6">
        <LiveGames />
        <TopPlayers />
      </div>
    </MainLayout>
  );
}
