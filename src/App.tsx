import { useEffect, useMemo, useState } from "react";
import { actionItems, leagues, mockUser, upcomingMatches } from "./data/mockData";
import { agendaItems, matchHistory, rankingDetail } from "./data/mockData";
import EntryPage from "./components/EntryPage";
import IntroVideo from "./components/IntroVideo";
import Layout from "./components/Layout";
import LeagueCarousel from "./components/LeagueCarousel";
import LeagueDetailPage from "./components/LeagueDetailPage";
import MainActionsGrid from "./components/MainActionsGrid";
import ProfileModal from "./components/ProfileModal";
import QuickAccessModal from "./components/QuickAccessModal";
import ReservationsPage from "./components/ReservationsPage";
import UpcomingMatchCard from "./components/UpcomingMatchCard";
import UserHeader from "./components/UserHeader";
import type { QuickAccessModal as ActiveQuickAccessModal, RoutePath } from "./types";
import { navigateTo } from "./utils/navigation";
import { readStorage, storageKeys, usePersistentState } from "./utils/storage";

const App = () => {
  const [savedProfile, setSavedProfile] = usePersistentState(storageKeys.userProfile, () => {
    const legacyProfile = (() => {
      try {
        const storedProfile = window.localStorage.getItem("punto-sport-user-profile");
        return storedProfile ? (JSON.parse(storedProfile) as Partial<typeof mockUser>) : {};
      } catch {
        return {};
      }
    })();

    return { ...mockUser, ...legacyProfile };
  });
  const [introComplete, setIntroComplete] = useState(false);
  const [accessMode, setAccessMode] = useState<"guest" | "player" | null>(null);
  const [playerCode, setPlayerCode] = usePersistentState(
    storageKeys.playerCode,
    () => {
      let legacyPlayerCode = mockUser.playerCode;
      try {
        legacyPlayerCode = window.localStorage.getItem("punto-sport-player-code") ?? mockUser.playerCode;
      } catch {
        // Se usa el código de ejemplo si el almacenamiento no está disponible.
      }
      return readStorage(storageKeys.playerCode, legacyPlayerCode);
    },
  );
  const [route, setRoute] = useState<RoutePath>(() => (window.location.pathname as RoutePath) || "/");
  const [activeQuickAccess, setActiveQuickAccess] = useState<ActiveQuickAccessModal>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const syncRoute = () => setRoute((window.location.pathname as RoutePath) || "/");
    const onNavigate = (event: Event) => {
      const nextRoute = (event as CustomEvent<RoutePath>).detail;
      setRoute(nextRoute);

      if (nextRoute === "/") {
        setActiveQuickAccess(null);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("popstate", syncRoute);
    window.addEventListener("punto-sport:navigate", onNavigate);

    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("punto-sport:navigate", onNavigate);
    };
  }, []);

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => window.clearInterval(clock);
  }, []);

  const visibleUpcomingMatches = useMemo(
    () =>
      upcomingMatches
        .filter((match) => new Date(match.date).getTime() > currentTime)
        .sort((firstMatch, secondMatch) => new Date(firstMatch.date).getTime() - new Date(secondMatch.date).getTime()),
    [currentTime],
  );

  const completeMatchHistory = useMemo(() => {
    const completedUpcomingMatches = upcomingMatches
      .filter((match) => new Date(match.date).getTime() <= currentTime)
      .map((match) => ({
        id: `history_${match.id}`,
        date: match.dateLabel,
        result: "Jugado" as const,
        score: "Resultado pendiente",
        partner: match.teamA
          .filter((player) => player.name !== mockUser.name)
          .map((player) => player.name)
          .join(" / ") || "A confirmar",
        rivals: match.teamB.map((player) => player.name).join(" / "),
        court: `${match.location} · ${match.court}`,
      }))
      .reverse();

    return [...completedUpcomingMatches, ...matchHistory];
  }, [currentTime]);

  const isReservations = route === "/reservas";
  const selectedLeagueId = route.startsWith("/ligas/") ? route.slice("/ligas/".length) : null;
  const selectedLeague = selectedLeagueId ? leagues.find((league) => league.id === selectedLeagueId) : null;
  const activeUser = accessMode === "guest"
    ? { ...savedProfile, name: "Invitado", email: "", playerCode: "", isRegistered: false, isActive: false }
    : { ...savedProfile, playerCode };

  const enterApp = (mode: "guest" | "player") => {
    setAccessMode(mode);
    navigateTo("/");
  };

  const enterAsPlayer = (code: string) => {
    setPlayerCode(code);
    enterApp("player");
  };

  const enterQuickBooking = () => {
    setAccessMode("guest");
    navigateTo("/reservas");
  };

  const returnToEntry = () => {
    setAccessMode(null);
    navigateTo("/");
  };

  const saveProfile = (profile: Pick<typeof mockUser, "name" | "email" | "phone" | "photoUrl">) => {
    setSavedProfile((current) => ({ ...current, ...profile }));
  };

  if (!introComplete) {
    return <IntroVideo onComplete={() => setIntroComplete(true)} />;
  }

  if (!accessMode) {
    return (
      <EntryPage
        onGuestEntry={() => enterApp("guest")}
        onPlayerEntry={enterAsPlayer}
        onQuickBooking={enterQuickBooking}
      />
    );
  }

  return (
    <Layout
      onOpenQuickAccess={setActiveQuickAccess}
      showBottomNav={accessMode !== "guest"}
      onGuestReturnHome={accessMode === "guest" ? returnToEntry : undefined}
      compactGuestActions={accessMode === "guest" && isReservations}
    >
      {!isReservations && (
        <UserHeader
          user={activeUser}
          onProfileOpen={() => accessMode === "player" && setIsProfileOpen(true)}
        />
      )}
      {selectedLeague ? (
        <LeagueDetailPage
          league={selectedLeague}
          onBack={() => navigateTo("/")}
          playerCode={activeUser.playerCode}
          isGuest={accessMode === "guest"}
        />
      ) : isReservations ? (
        <ReservationsPage />
      ) : (
        <>
          <MainActionsGrid actions={actionItems} onNavigate={navigateTo} />
          <LeagueCarousel
            leagues={leagues}
            onViewAll={() => navigateTo("/ligas")}
            onLeagueSelect={(league) => navigateTo(`/ligas/${league.id}`)}
          />
          {accessMode !== "guest" && <UpcomingMatchCard matches={visibleUpcomingMatches} />}
        </>
      )}
      <ProfileModal
        isOpen={isProfileOpen}
        user={activeUser}
        onSave={saveProfile}
        onClose={() => setIsProfileOpen(false)}
      />
      <QuickAccessModal
        activeModal={activeQuickAccess}
        agendaItems={agendaItems}
        rankingDetail={rankingDetail}
        matchHistory={completeMatchHistory}
        onClose={() => setActiveQuickAccess(null)}
      />
    </Layout>
  );
};

export default App;
