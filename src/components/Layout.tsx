import type { ReactNode } from "react";
import { Home, Instagram, LogIn } from "lucide-react";
import type { QuickAccessModal } from "../types";
import { buildWhatsAppUrl, clubConfig } from "../config";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  onOpenQuickAccess: (modal: Exclude<QuickAccessModal, null>) => void;
  showBottomNav?: boolean;
  onGuestReturnHome?: () => void;
  compactGuestActions?: boolean;
}

const Layout = ({
  children,
  onOpenQuickAccess,
  showBottomNav = true,
  onGuestReturnHome,
  compactGuestActions = false,
}: LayoutProps) => {
  const isGuestLayout = Boolean(onGuestReturnHome);
  const requestPlayerCode = () => {
    window.open(
      buildWhatsAppUrl(
        "Hola Punto Sport, estoy navegando como invitado y quiero solicitar mi código de jugador activo.",
      ),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className={`${isGuestLayout ? "bg-[#121512]" : "min-h-screen bg-[#0d100d]"} text-slate-50`}>
      <main className={`relative mx-auto w-full max-w-[480px] overflow-x-hidden bg-[#121512] px-4 pt-4 shadow-[0_0_50px_rgba(0,0,0,0.22)] sm:px-5 ${
        isGuestLayout ? "min-h-0 pb-5" : "min-h-screen"
      } ${
        showBottomNav ? "pb-28" : "pb-8"
      }`}>
        <div className="space-y-3.5">{children}</div>
        {onGuestReturnHome && !compactGuestActions && (
          <div className="mt-5 grid gap-2.5">
            <button
              type="button"
              onClick={onGuestReturnHome}
              className="grid min-h-[64px] w-full grid-cols-[42px_1fr_42px] items-center rounded-[18px] border border-white/[0.08] bg-[#1a1f1a] px-3 py-2.5 text-slate-200 transition active:scale-[0.99]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#9daa65] text-[#171a14]">
                <Home size={20} strokeWidth={2.4} />
              </span>
              <span className="text-center text-sm font-extrabold">Volver al inicio</span>
              <span aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => window.open(clubConfig.instagramUrl, "_blank", "noopener,noreferrer")}
              className="grid min-h-[64px] w-full grid-cols-[42px_1fr_42px] items-center rounded-[18px] border border-white/[0.08] bg-[#1a1f1a] px-3 py-2.5 text-slate-200 transition active:scale-[0.99]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#9daa65] text-[#171a14]">
                <Instagram size={20} strokeWidth={2.3} />
              </span>
              <span className="text-center text-sm font-extrabold">Ver Instagram</span>
              <span aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={requestPlayerCode}
              className="grid min-h-[72px] w-full grid-cols-[42px_1fr_42px] items-center rounded-[18px] border border-white/[0.08] bg-[#1a1f1a] px-3 py-2.5 transition active:scale-[0.99]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#9daa65] text-[#171a14]">
                <LogIn size={20} />
              </span>
              <span className="min-w-0 text-center">
                <span className="block text-sm font-extrabold leading-tight text-white">Solicitar código de jugador activo</span>
                <span className="mt-1 block text-[0.68rem] font-medium leading-tight text-slate-400">Contactar al club por WhatsApp</span>
              </span>
              <span aria-hidden="true" />
            </button>
          </div>
        )}
      </main>
      {showBottomNav && <BottomNav onOpenQuickAccess={onOpenQuickAccess} />}
      {onGuestReturnHome && compactGuestActions && (
        <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
          <button
            type="button"
            onClick={onGuestReturnHome}
            aria-label="Volver al inicio"
            title="Volver al inicio"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#9daa65] text-[#171a14] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition active:scale-95"
          >
            <Home size={22} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={() => window.open(clubConfig.instagramUrl, "_blank", "noopener,noreferrer")}
            aria-label="Ver Instagram"
            title="Ver Instagram"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#1a1f1a] text-[#aebd70] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition active:scale-95"
          >
            <Instagram size={22} strokeWidth={2.3} />
          </button>
          <button
            type="button"
            onClick={requestPlayerCode}
            aria-label="Solicitar código de jugador activo"
            title="Solicitar código de jugador activo"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#1a1f1a] text-[#aebd70] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition active:scale-95"
          >
            <LogIn size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
