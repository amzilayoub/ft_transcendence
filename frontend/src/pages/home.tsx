import { useEffect } from "react";

import GameModes from "@components/game/GameModes";
import MainLayout from "@components/layout";
import WelcomeModal from "@components/modals/WelcomeModal";
import LiveGames from "@components/stats/live/LiveGames";
import TopPlayers from "@components/stats/TopPlayers";
import isBrowser from "@utils/isBrowser";
import { useUIContext } from "context/ui.context";

export default function HomePage() {
  const uiCtx = useUIContext();
  useEffect(() => {
    if (
      isBrowser &&
      !uiCtx?.isSettingsOpen &&
      window.location.search.includes("new-user=true")
    ) {
      uiCtx?.setIsSettingsOpen(true);
      uiCtx?.setIsWelcomeModalOpen(true);
    }
  }, []);

  return (
    <MainLayout>
      <section className="flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-2 pt-4 sm:flex-row sm:items-start  xl:px-0 ">
        <div className="flex w-full flex-col gap-6">
          <LiveGames />
          <GameModes />
        </div>
        <TopPlayers />
      </section>
      {uiCtx?.isWelcomeModalOpen && (
        <WelcomeModal
          isOpen={uiCtx?.isWelcomeModalOpen}
          onClose={() => uiCtx?.setIsWelcomeModalOpen(false)}
        />
      )}
    </MainLayout>
  );
}
