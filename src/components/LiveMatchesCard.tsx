import { Clock3, Trophy } from "lucide-react";
import type { LiveMatch } from "../types";

interface LiveMatchesCardProps {
  matches: LiveMatch[];
}

const statusClass: Record<LiveMatch["status"], string> = {
  "En juego": "bg-[#788253]/18 text-[#bcc797]",
  "Por empezar": "bg-slate-500/14 text-slate-300",
  Finalizando: "bg-orange-300/12 text-orange-200",
};

const LiveMatchesCard = ({ matches }: LiveMatchesCardProps) => {
  return (
    <article className="rounded-[18px] border border-white/[0.08] bg-[#191d19] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-slate-300">
            <Trophy size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-extrabold text-white">Partidos en vivo</h2>
            <p className="text-xs font-medium text-slate-400">Punto Sport · Hoy</p>
          </div>
        </div>
        <span className="rounded-full bg-[#252b24] px-2 py-1 text-[0.68rem] font-bold text-slate-300">
          {matches.length}
        </span>
      </div>
      <div className="grid gap-2">
        {matches.map((match) => (
          <div key={match.id} className="rounded-[14px] bg-[#202420] px-3 py-2.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[0.68rem] font-bold text-slate-400">
                <Clock3 size={13} />
                {match.time} · {match.court}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[0.64rem] font-bold ${statusClass[match.status]}`}>
                {match.status}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
              <p className="truncate font-semibold text-white">{match.teamA}</p>
              <p className="rounded-full bg-[#151815] px-2 py-1 text-[0.72rem] font-black text-slate-200">
                {match.score}
              </p>
              <p className="truncate text-right font-semibold text-white">{match.teamB}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default LiveMatchesCard;
