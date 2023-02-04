import { useEffect } from "react";

import GameModes from "@components/game/GameModes";
import MainLayout from "@components/layout";
import WelcomeModal from "@components/modals/WelcomeModal";
import LiveGames from "@components/stats/live/LiveGames";
import WaitingGames from "@components/stats/live/WaitingPlayers";
import TopPlayers from "@components/stats/TopPlayers";
import useGamesSocket from "@hooks/useGamesSocket";
import { IGame } from "@utils/game/IGame";
import isBrowser from "@utils/isBrowser";
import { useAuthContext } from "context/auth.context";
import { useUIContext } from "context/ui.context";

export default function HomePage() {
  const gamesAndWaitingPlayersAndLiveGames = useGamesSocket();
  const uiCtx = useUIContext();
  const ctx = useAuthContext();

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

  const waitingPlayers = gamesAndWaitingPlayersAndLiveGames?.filter(
    (game: IGame) => !game.p2
  );

  return (
    <MainLayout>
      <section className="flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-2 pt-4 sm:flex-row sm:items-start  xl:px-0 ">
        <div className="flex w-full flex-col gap-6">
          <LiveGames
            liveGames={gamesAndWaitingPlayersAndLiveGames?.filter(
              (game: IGame) => game.p2
            )}
          />
          <WaitingGames waitingPlayers={waitingPlayers} />
          <GameModes
            waitingPlayers={waitingPlayers}
            amIalreadyInAGameOrWaiting={
              !!gamesAndWaitingPlayersAndLiveGames?.find(
                (game: IGame) =>
                  game.p1?.userId === ctx?.user?.id ||
                  game.p2?.userId === ctx?.user?.id
              )
            }
          />
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
