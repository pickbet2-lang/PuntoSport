import { ArrowRight } from "lucide-react";
import type { ActionItem, RoutePath } from "../types";

interface ActionCardProps {
  action: ActionItem;
  onNavigate: (route: RoutePath) => void;
}

const ActionCard = ({ action, onNavigate }: ActionCardProps) => {
  const { Icon } = action;

  if (action.variant === "primary") {
    return (
      <button
        type="button"
        onClick={() => onNavigate(action.route)}
        className="group relative min-h-[112px] min-w-0 overflow-hidden rounded-[18px] border border-white/10 bg-[#262c22] p-3 text-left text-white min-[390px]:min-h-[120px]"
      >
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(182,200,95,0.07),transparent_55%)]" />
        <span className="relative z-10 flex h-full flex-col justify-between">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.07] text-slate-200">
            <Icon size={18} strokeWidth={2.1} />
          </span>
          <span className="flex items-end justify-between gap-2">
            <span className="block max-w-[7.2rem] text-[0.82rem] font-extrabold leading-tight min-[390px]:text-[0.9rem]">
              {action.title}
            </span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#9daa65] text-[#171a14] transition group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onNavigate(action.route)}
      className="group min-h-[51px] min-w-0 rounded-[16px] border border-white/[0.07] bg-[#191d19] p-2 text-left min-[390px]:min-h-[56px]"
    >
      <span className="flex h-full items-center justify-between gap-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-slate-300">
          <Icon size={18} strokeWidth={2.1} />
        </span>
        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="min-w-0">
            <span className="block text-[0.74rem] font-extrabold leading-tight text-white min-[390px]:text-[0.82rem]">{action.title}</span>
          </span>
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#232823] text-slate-400 transition group-hover:translate-x-1">
            <ArrowRight size={14} />
          </span>
        </span>
      </span>
    </button>
  );
};

export default ActionCard;
