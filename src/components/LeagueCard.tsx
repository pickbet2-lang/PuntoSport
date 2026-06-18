import { CalendarDays, Trophy, UsersRound } from "lucide-react";
import type { League } from "../types";

interface LeagueCardProps {
  league: League;
  onClick: () => void;
}

const LeagueCard = ({ league, onClick }: LeagueCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Abrir ${league.name}`}
      className="w-[128px] shrink-0 overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#191d19] text-left transition active:scale-[0.98]"
    >
      <div className="relative h-9 bg-[#202520]">
        <span className="absolute bottom-2 right-3 h-4 w-4 rounded-full bg-[#8f9a61]" />
        <span className="absolute -bottom-4 left-3 grid h-8 w-8 place-items-center rounded-xl bg-[#737d51] text-white ring-[3px] ring-[#191d19]">
          <Trophy size={16} />
        </span>
      </div>
      <div className="px-3 pb-3 pt-6">
        <h3 className="text-[0.78rem] font-extrabold leading-tight text-white">{league.name}</h3>
        <p className="mt-0.5 text-[0.68rem] font-bold text-slate-300">{league.modality}</p>
        <div className="mt-2 space-y-1 text-[0.68rem] font-medium text-slate-400">
          <p className="flex items-center gap-1.5">
            <UsersRound size={12} className="text-slate-400" />
            {league.category}
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarDays size={12} />
            {league.startDate}
          </p>
        </div>
        <div className="mt-2.5 h-1 rounded-full bg-white/10">
          <div className="h-full w-3/5 rounded-full bg-[#8f9a61]" />
        </div>
      </div>
    </button>
  );
};

export default LeagueCard;
