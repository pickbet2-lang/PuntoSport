import { useState } from "react";
import { CalendarCheck, MapPin, MessageCircle, X } from "lucide-react";
import type { UpcomingMatch } from "../types";
import { storageKeys, usePersistentState } from "../utils/storage";
import PlayerAvatar from "./PlayerAvatar";

interface UpcomingMatchCardProps {
  matches: UpcomingMatch[];
}

type ConfirmationStatus = UpcomingMatch["confirmations"][string];

const statusLabels: Record<ConfirmationStatus, string> = {
  confirmed: "Confirmó",
  pending: "Sin responder",
  unavailable: "No puede",
};

const UpcomingMatchCard = ({ matches }: UpcomingMatchCardProps) => {
  const [selectedMatch, setSelectedMatch] = useState<UpcomingMatch | null>(null);
  const [confirmationOverrides, setConfirmationOverrides] = usePersistentState<Record<string, ConfirmationStatus>>(
    storageKeys.matchConfirmations,
    {},
  );
  const sortedMatches = [...matches].sort(
    (firstMatch, secondMatch) => new Date(firstMatch.date).getTime() - new Date(secondMatch.date).getTime(),
  );

  const getStatus = (match: UpcomingMatch, playerId: string) =>
    confirmationOverrides[`${match.id}:${playerId}`] ?? match.confirmations[playerId] ?? "pending";

  const setMyStatus = (match: UpcomingMatch, status: ConfirmationStatus) => {
    const currentPlayer = match.teamA[0];
    if (!currentPlayer) {
      return;
    }

    setConfirmationOverrides((current) => ({
      ...current,
      [`${match.id}:${currentPlayer.id}`]: status,
    }));
  };

  const openCoordination = (match: UpcomingMatch) => {
    const players = [...match.teamA, ...match.teamB].map((player) => player.name).join(", ");
    const message = encodeURIComponent(
      `Hola, necesitamos coordinar una nueva fecha para el partido de ${match.dateLabel} en ${match.location} · ${match.court}. Jugadores: ${players}.`,
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const selectedPlayers = selectedMatch ? [...selectedMatch.teamA, ...selectedMatch.teamB] : [];
  const selectedStatuses = selectedMatch
    ? selectedPlayers.map((player) => getStatus(selectedMatch, player.id))
    : [];
  const allConfirmed = selectedStatuses.length === 4 && selectedStatuses.every((status) => status === "confirmed");
  const needsReschedule = selectedStatuses.some((status) => status === "unavailable");

  return (
    <section>
      <div className="mb-3 flex min-w-0 items-center gap-3 px-1">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-slate-300">
          <CalendarCheck size={21} />
        </span>
        <h2 className="truncate text-base font-extrabold text-white">Mis Próximos Encuentros</h2>
      </div>

      <div className="grid gap-3">
        {sortedMatches.map((match) => {
          const statuses = [...match.teamA, ...match.teamB].map((player) => getStatus(match, player.id));
          const matchConfirmed = statuses.length === 4 && statuses.every((status) => status === "confirmed");
          const matchNeedsReschedule = statuses.some((status) => status === "unavailable");

          return (
            <button
              key={match.id}
              type="button"
              onClick={() => setSelectedMatch(match)}
              className="rounded-[18px] border border-white/[0.08] bg-[#191d19] p-4 text-left transition active:scale-[0.99]"
            >
              <div className="mx-auto mb-4 w-max rounded-full bg-[#252b24] px-3 py-1 text-[0.68rem] font-bold text-slate-300">
                {match.dateLabel}
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex -space-x-2">
                  {match.teamA.map((player) => <PlayerAvatar key={player.id} player={player} />)}
                </div>
                <span className="text-sm font-extrabold text-slate-400">VS</span>
                <div className="flex -space-x-2">
                  {match.teamB.map((player) => <PlayerAvatar key={player.id} player={player} />)}
                </div>
              </div>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                <MapPin size={15} />
                {match.location} · {match.court}
              </p>
              <p className={`mt-3 text-center text-[0.68rem] font-bold ${
                matchConfirmed ? "text-[#b9c77c]" : matchNeedsReschedule ? "text-[#d79a5d]" : "text-slate-500"
              }`}>
                {matchConfirmed ? "Los 4 jugadores confirmaron" : matchNeedsReschedule ? "Hay que coordinar otra fecha" : "Confirmaciones pendientes"}
              </p>
            </button>
          );
        })}

        {sortedMatches.length === 0 && (
          <div className="rounded-[18px] border border-white/[0.08] bg-[#191d19] px-4 py-5 text-center">
            <p className="text-sm font-bold text-slate-300">No tenés próximos encuentros.</p>
          </div>
        )}
      </div>

      {selectedMatch && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMatch(null);
          }}
        >
          <section className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[24px] border border-white/[0.08] bg-[#151815] shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-4">
              <div>
                <p className="text-xs font-semibold text-slate-400">Fecha propuesta por el club</p>
                <h2 className="mt-0.5 text-lg font-extrabold text-white">{selectedMatch.dateLabel}</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">{selectedMatch.location} · {selectedMatch.court}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                aria-label="Cerrar encuentro"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-slate-300"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-4">
              <div className={`rounded-[18px] border p-4 ${
                allConfirmed
                  ? "border-[#9daa65]/25 bg-[#29301f]"
                  : needsReschedule
                    ? "border-[#c98542]/25 bg-[#2f251c]"
                    : "border-white/[0.08] bg-[#202520]"
              }`}>
                <p className="text-sm font-extrabold text-white">
                  {allConfirmed
                    ? "Partido confirmado"
                    : needsReschedule
                      ? "Deben acordar una nueva fecha"
                      : "Esperando confirmaciones"}
                </p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-400">
                  {allConfirmed
                    ? "Los cuatro jugadores confirmaron que pueden jugar en la fecha establecida."
                    : needsReschedule
                      ? "Al menos un jugador indicó que no puede. Los cuatro deben coordinar otra fecha."
                      : "La fecha queda confirmada cuando los cuatro jugadores acepten."}
                </p>
              </div>

              <div className="mt-3 grid gap-2">
                {selectedPlayers.map((player) => {
                  const status = getStatus(selectedMatch, player.id);
                  return (
                    <div key={player.id} className="flex items-center justify-between rounded-[16px] bg-[#202520] px-3 py-3">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar player={player} />
                        <span className="text-sm font-extrabold text-white">{player.name}</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${
                        status === "confirmed"
                          ? "bg-[#39432a] text-[#c7d58b]"
                          : status === "unavailable"
                            ? "bg-[#432d22] text-[#dfa36a]"
                            : "bg-white/[0.06] text-slate-400"
                      }`}>
                        {statusLabels[status]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMyStatus(selectedMatch, "confirmed")}
                  className="rounded-[16px] bg-[#77834f] px-3 py-3 text-xs font-black text-white"
                >
                  Puedo jugar
                </button>
                <button
                  type="button"
                  onClick={() => setMyStatus(selectedMatch, "unavailable")}
                  className="rounded-[16px] border border-[#c98542]/30 bg-[#32251c] px-3 py-3 text-xs font-black text-[#dfa36a]"
                >
                  No puedo jugar
                </button>
              </div>

              {needsReschedule && (
                <button
                  type="button"
                  onClick={() => openCoordination(selectedMatch)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#b97735] px-4 py-3.5 text-sm font-black text-white"
                >
                  <MessageCircle size={18} />
                  Coordinar nueva fecha
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default UpcomingMatchCard;
