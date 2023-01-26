import MainLayout from "@components/layout";
import LiveGames from "@components/stats/live/LiveGames";

export default function HomePage() {
  return (
    <MainLayout>
      {/* <div className="bg-red-300"> */}

      <LiveGames />
      {/* </div> */}
      {/* Top Players */}
    </MainLayout>
  );
}
