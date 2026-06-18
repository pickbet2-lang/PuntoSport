import { CalendarDays, History, Home } from "lucide-react";
import type { QuickAccessModal } from "../types";
import { navigateTo } from "../utils/navigation";

interface BottomNavProps {
  onOpenQuickAccess: (modal: Exclude<QuickAccessModal, null>) => void;
}

const BottomNav = ({ onOpenQuickAccess }: BottomNavProps) => {
  const goHome = () => {
    navigateTo("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[480px] px-4 pb-4">
      <div className="relative grid h-[70px] grid-cols-3 items-center rounded-[22px] border border-white/[0.08] bg-[#191d19] px-5 shadow-[0_-10px_28px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={() => onOpenQuickAccess("history")}
          className="flex h-full flex-col items-center justify-center gap-1 text-[0.68rem] font-bold text-slate-400"
        >
          <History size={23} strokeWidth={2} />
          Historial
        </button>
        <button
          type="button"
          onClick={goHome}
          aria-label="Ir al inicio"
          className="mx-auto grid h-[48px] w-[48px] place-items-center rounded-full bg-[#9daa65] text-[#171a14] ring-4 ring-[#191d19]"
        >
          <Home size={27} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          onClick={() => onOpenQuickAccess("agenda")}
          className="flex h-full flex-col items-center justify-center gap-1 text-[0.68rem] font-bold text-slate-400"
        >
          <CalendarDays size={23} strokeWidth={2} />
          Mi Agenda
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
