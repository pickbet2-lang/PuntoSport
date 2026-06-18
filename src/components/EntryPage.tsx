import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, CalendarCheck, MessageCircle, UserRound, UsersRound, X } from "lucide-react";
import puntoSportLogo from "../assets/punto-sport-logo.png";
import { buildWhatsAppUrl } from "../config";
import { readStorage, storageKeys, writeStorage } from "../utils/storage";

interface EntryPageProps {
  onGuestEntry: () => void;
  onPlayerEntry: (playerCode: string) => void;
  onQuickBooking: () => void;
}

const EntryPage = ({ onGuestEntry, onPlayerEntry, onQuickBooking }: EntryPageProps) => {
  const [isPlayerAccessOpen, setIsPlayerAccessOpen] = useState(false);
  const [playerCode, setPlayerCode] = useState(() => {
    let legacyPlayerCode = "";
    try {
      legacyPlayerCode = window.localStorage.getItem("punto-sport-player-code") ?? "";
    } catch {
      // El almacenamiento puede estar bloqueado.
    }
    return readStorage(storageKeys.playerCode, legacyPlayerCode);
  });
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    if (!isPlayerAccessOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPlayerAccessOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isPlayerAccessOpen]);

  const submitPlayerCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = playerCode.trim().toUpperCase();

    if (!normalizedCode) {
      setCodeError("Ingresá el código que te brindó el club.");
      return;
    }

    writeStorage(storageKeys.playerCode, normalizedCode);

    setPlayerCode(normalizedCode);
    setCodeError("");
    onPlayerEntry(normalizedCode);
  };

  const requestPlayerCode = () => {
    window.open(
      buildWhatsAppUrl("Hola Punto Sport, olvidé mi código de jugador activo. ¿Podrían ayudarme a recuperarlo?"),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const actions = [
    {
      title: "Soy jugador activo",
      Icon: UserRound,
      onClick: () => {
        setCodeError("");
        setIsPlayerAccessOpen(true);
      },
      primary: true,
    },
    {
      title: "Ingresar como invitado",
      Icon: UsersRound,
      onClick: onGuestEntry,
      primary: false,
    },
    {
      title: "Reserva rápida",
      Icon: CalendarCheck,
      onClick: onQuickBooking,
      primary: false,
    },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-[480px] bg-[#050605] px-5 py-9 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full flex-col">
        <img
          src={puntoSportLogo}
          alt="Punto Sport"
          className="entry-logo mx-auto mt-2 h-auto w-[78%] max-w-[350px] object-contain"
        />

        <section className="entry-welcome mt-10 text-center">
          <h1 className="text-[2rem] font-black leading-none tracking-normal text-white">¡Bienvenido!</h1>
          <p className="mt-3 text-base font-medium text-slate-400">Elegí cómo querés continuar</p>
        </section>

        <section className="mt-10 grid gap-4">
          {actions.map(({ title, Icon, onClick, primary }, index) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              style={{ animationDelay: `${560 + index * 140}ms` }}
              className={`flex min-h-[92px] items-center gap-4 rounded-[28px] border px-5 py-4 text-left transition active:scale-[0.99] ${
                primary
                  ? "border-[#d5f20b] bg-[#232b12] shadow-[0_0_24px_rgba(213,242,11,0.13)]"
                  : "border-white/20 bg-[#101210]"
              } entry-action`}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#d5f20b] text-black">
                <Icon size={29} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1 whitespace-nowrap text-base font-extrabold leading-tight text-white min-[410px]:text-lg">
                {title}
              </span>
              <ArrowRight size={25} strokeWidth={2.4} className="shrink-0 text-[#d5f20b]" />
            </button>
          ))}
        </section>
      </div>

      {isPlayerAccessOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsPlayerAccessOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-access-title"
            className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#171b17] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#d5f20b] text-black">
                  <UserRound size={25} strokeWidth={2.3} />
                </span>
                <div>
                  <h2 id="player-access-title" className="text-lg font-black text-white">
                    Acceso de jugador
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Ingresá el código brindado por el club
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlayerAccessOpen(false)}
                aria-label="Cerrar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-slate-300"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitPlayerCode} className="mt-6">
              <label htmlFor="player-code" className="mb-2 block text-xs font-bold text-slate-300">
                Código de jugador
              </label>
              <input
                id="player-code"
                value={playerCode}
                onChange={(event) => {
                  setPlayerCode(event.target.value.toUpperCase());
                  setCodeError("");
                }}
                autoFocus
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="Ejemplo: K3J6H9"
                className="h-14 w-full rounded-[16px] border border-white/10 bg-[#222722] px-4 text-center text-lg font-black uppercase tracking-[0.18em] text-white outline-none transition placeholder:text-sm placeholder:font-semibold placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 focus:border-[#d5f20b]"
              />
              {codeError && <p className="mt-2 text-xs font-semibold text-red-400">{codeError}</p>}
              <p className="mt-3 text-center text-[0.7rem] font-medium leading-relaxed text-slate-500">
                Este código quedará guardado en este celular para tus próximos ingresos.
              </p>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#d5f20b] px-4 py-3.5 text-sm font-black text-[#151a0b] transition active:scale-[0.99]"
              >
                Ingresar
                <ArrowRight size={19} />
              </button>
            </form>

            <button
              type="button"
              onClick={requestPlayerCode}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-slate-300"
            >
              <MessageCircle size={18} className="text-[#8f9a61]" />
              Olvidé mi código · Solicitar por WhatsApp
            </button>
          </section>
        </div>
      )}
    </main>
  );
};

export default EntryPage;
