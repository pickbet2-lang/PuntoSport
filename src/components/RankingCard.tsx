import { BarChart3, ChevronRight } from "lucide-react";
import type { Ranking } from "../types";

interface RankingCardProps {
  ranking: Ranking;
  onViewRanking: () => void;
}

const RankingCard = ({ ranking, onViewRanking }: RankingCardProps) => {
  const points = ranking.trend
    .map((value, index) => {
      const x = (index / (ranking.trend.length - 1)) * 150;
      const y = 72 - (value / 60) * 58;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <article className="rounded-[22px] border border-white/10 bg-[#1a1f1a] p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-ball-300/12 text-ball-300">
          <BarChart3 size={21} />
        </span>
        <h2 className="text-base font-extrabold text-white">Tu ranking</h2>
      </div>
      <div className="grid grid-cols-[0.85fr_1fr] items-end gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400">Posicion actual</p>
          <p className="mt-1 text-4xl font-extrabold leading-none text-ball-200">#{ranking.position}</p>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {ranking.category} · {ranking.points} pts
          </p>
        </div>
        <svg viewBox="0 0 150 80" className="h-20 w-full" role="img" aria-label="Evolucion de ranking">
          <defs>
            <linearGradient id="rankingArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#b6c85f" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#b6c85f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,80 ${points} 150,80`} fill="url(#rankingArea)" />
          <polyline points={points} fill="none" stroke="#b6c85f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <circle cx="150" cy="21.7" r="5" fill="#b6c85f" />
        </svg>
      </div>
      <button
        type="button"
        onClick={onViewRanking}
        className="mt-4 flex w-full items-center justify-between rounded-2xl bg-[#252b24] px-3 py-2.5 text-xs font-bold text-ball-200"
      >
        Ver ranking completo
        <ChevronRight size={18} />
      </button>
    </article>
  );
};

export default RankingCard;
