import { useState } from "react";
import { CalendarDays, History, Search, Trophy, UserPlus, X } from "lucide-react";
import type { AgendaItem, MatchHistoryItem, QuickAccessModal as ActiveModal, RankingDetail } from "../types";

interface QuickAccessModalProps {
  activeModal: ActiveModal;
  agendaItems: AgendaItem[];
  rankingDetail: RankingDetail;
  matchHistory: MatchHistoryItem[];
  onClose: () => void;
}

const partnerModes = ["Torneo / liga", "Recreativo", "Sumarme a partido", "Me ofrezco"] as const;
const categories = ["5ta", "6ta", "7ma", "8va", "Mixta"] as const;

const modalTitles: Record<Exclude<ActiveModal, null>, { title: string; Icon: typeof Trophy }> = {
  agenda: { title: "Mi Agenda", Icon: CalendarDays },
  ranking: { title: "Ranking completo", Icon: Trophy },
  history: { title: "Historial", Icon: History },
  partner: { title: "Buscar pareja", Icon: UserPlus },
};

const QuickAccessModal = ({ activeModal, agendaItems, rankingDetail, matchHistory, onClose }: QuickAccessModalProps) => {
  const [partnerMode, setPartnerMode] = useState<(typeof partnerModes)[number]>("Torneo / liga");
  const [category, setCategory] = useState<(typeof categories)[number]>("7ma");

  if (!activeModal) {
    return null;
  }

  const { title, Icon } = modalTitles[activeModal];

  return (
    <div className="fixed inset-0 z-30 bg-black/55 px-4 pb-4 pt-12 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[86vh] w-full max-w-[480px] flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#151815] shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-slate-300">
              <Icon size={20} />
            </span>
            <h2 className="truncate text-lg font-extrabold text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#20261f] text-slate-300"
          >
            <X size={19} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          {activeModal === "agenda" && (
            <div className="grid gap-2.5">
              {agendaItems.map((item) => (
                <article key={item.id} className="rounded-[18px] bg-[#1a1f1a] px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-white">{item.day}</p>
                      <p className="mt-0.5 text-xs font-bold text-slate-300">{item.time} · {item.court}</p>
                    </div>
                    <span className="rounded-full bg-[#252b24] px-2 py-1 text-[0.68rem] font-bold text-slate-300">
                      {item.note}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-1 text-xs font-medium text-slate-400">
                    <p>Compañero: <span className="text-slate-200">{item.partner}</span></p>
                    <p>Rivales: <span className="text-slate-200">{item.rivals}</span></p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeModal === "ranking" && (
            <div className="grid gap-3">
              <div className="rounded-[20px] bg-[#1a1f1a] p-4">
                <p className="text-xs font-semibold text-slate-400">Posición actual</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-5xl font-black text-slate-100">#{rankingDetail.position}</p>
                  <p className="text-right text-sm font-bold text-slate-300">
                    {rankingDetail.category}<br />{rankingDetail.points} pts
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Jugados", rankingDetail.played],
                  ["Ganados", rankingDetail.won],
                  ["Perdidos", rankingDetail.lost],
                  ["Efectividad", rankingDetail.winRate],
                  ["Mejor racha", rankingDetail.bestStreak],
                  ["Codigo", "K3J6H9"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] bg-[#1a1f1a] px-3 py-3">
                    <p className="text-[0.68rem] font-semibold text-slate-400">{label}</p>
                    <p className="mt-1 text-lg font-extrabold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === "history" && (
            <div className="grid gap-2.5">
              {matchHistory.map((match) => (
                <article key={match.id} className="rounded-[18px] bg-[#1a1f1a] px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-white">{match.date}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-400">{match.court}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${
                      match.result === "Ganado"
                        ? "bg-ball-300/14 text-ball-100"
                        : match.result === "Jugado"
                          ? "bg-[#273027] text-slate-300"
                          : "bg-white/10 text-slate-300"
                    }`}>
                      {match.result}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-extrabold text-white">{match.score}</p>
                  <div className="mt-2 grid gap-1 text-xs font-medium text-slate-400">
                    <p>Compañero: <span className="text-slate-200">{match.partner}</span></p>
                    <p>Rivales: <span className="text-slate-200">{match.rivals}</span></p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeModal === "partner" && (
            <div className="grid gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Qué buscás</p>
                <div className="grid grid-cols-2 gap-2">
                  {partnerModes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPartnerMode(mode)}
                      className={`rounded-[16px] px-3 py-2 text-left text-xs font-bold ${
                        partnerMode === mode ? "bg-ball-300 text-[#1b2117]" : "bg-[#1a1f1a] text-slate-300"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`rounded-full px-3 py-2 text-xs font-bold ${
                        category === item ? "bg-ball-300 text-[#1b2117]" : "bg-[#1a1f1a] text-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-[18px] bg-[#1a1f1a] px-3 py-3">
                <p className="text-xs font-semibold text-slate-400">Resumen</p>
                <p className="mt-1 text-sm font-bold text-white">
                  Buscás: {partnerMode} · {category}
                </p>
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[18px] bg-ball-300 px-4 py-3 text-sm font-black text-[#1b2117]"
              >
                <Search size={18} />
                Buscar jugadores
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAccessModal;
