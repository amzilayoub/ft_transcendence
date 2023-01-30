import { useEffect } from "react";

import MainLayout from "@components/layout";
import WelcomeModal from "@components/modals/WelcomeModal";
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
    <>
      <MainLayout></MainLayout>
      {uiCtx?.isWelcomeModalOpen && (
        <WelcomeModal
          isOpen={uiCtx?.isWelcomeModalOpen}
          onClose={() => uiCtx?.setIsWelcomeModalOpen(false)}
        />
      )}
    </>
  );
}
