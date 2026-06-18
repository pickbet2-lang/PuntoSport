import { useState } from "react";
import { CalendarDays, ChevronRight, Trophy, UsersRound, X } from "lucide-react";
import type { League } from "../types";
import { buildWhatsAppUrl } from "../config";
import { storageKeys, usePersistentState } from "../utils/storage";

interface LeagueDetailPageProps {
  league: League;
  onBack: () => void;
  playerCode: string;
  isGuest: boolean;
}

const LeagueDetailPage = ({ league, onBack, playerCode, isGuest }: LeagueDetailPageProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isStandingsOpen, setIsStandingsOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const [registrationDrafts, setRegistrationDrafts] = usePersistentState<
    Record<string, {
      registrationCategory: string;
      partnerCategory: string;
      playerWhatsApp: string;
      partnerCode: string;
      isGuestPartner: boolean;
      partnerWhatsApp: string;
    }>
  >(storageKeys.registrationDrafts, {});
  const registrationDraft = registrationDrafts[league.id] ?? {
    registrationCategory: league.category.replace("Cat. ", ""),
    partnerCategory: league.category.replace("Cat. ", ""),
    playerWhatsApp: "",
    partnerCode: "",
    isGuestPartner: false,
    partnerWhatsApp: "",
  };
  const [registrationError, setRegistrationError] = useState("");
  const [day, month, year] = league.startDate.replace("Inicio ", "").split("/").map(Number);
  const startDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasStarted = startDate.getTime() <= today.getTime();
  const updateRegistrationDraft = (updates: Partial<typeof registrationDraft>) => {
    setRegistrationDrafts((current) => ({
      ...current,
      [league.id]: { ...registrationDraft, ...updates },
    }));
  };

  const requestRegistration = () => {
    const normalizedPartnerCode = registrationDraft.partnerCode.trim().toUpperCase();
    const normalizedPlayerWhatsApp = registrationDraft.playerWhatsApp.trim();
    const normalizedPartnerWhatsApp = registrationDraft.partnerWhatsApp.trim();

    if (isGuest && !normalizedPlayerWhatsApp) {
      setRegistrationError("Ingresá tu número de WhatsApp.");
      return;
    }

    if (registrationDraft.isGuestPartner && !normalizedPartnerWhatsApp) {
      setRegistrationError("Ingresá el WhatsApp de tu pareja invitada.");
      return;
    }

    if (!registrationDraft.isGuestPartner && !normalizedPartnerCode) {
      setRegistrationError("Ingresá el código de jugador de tu pareja.");
      return;
    }

    setRegistrationError("");
    const message = [
      `Hola Punto Sport, quiero solicitar la inscripción en ${league.name}.`,
      `Modalidad: ${league.modality}.`,
      `Categoría: ${registrationDraft.registrationCategory}.`,
      isGuest ? `Mi WhatsApp: ${normalizedPlayerWhatsApp}.` : `Mi código de jugador: ${playerCode}.`,
      registrationDraft.isGuestPartner
        ? `Pareja sin código - Categoría: ${registrationDraft.partnerCategory} - WhatsApp: ${normalizedPartnerWhatsApp}.`
        : `Pareja con código: ${normalizedPartnerCode} - Categoría: ${registrationDraft.partnerCategory}.`,
    ].join("\n");
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  const toggleSection = (section: string) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const sections = [
    {
      id: "teams",
      title: "Parejas inscriptas",
      content: (
        <div className="grid gap-2">
          {["Víctor / Nicolás", "Martín / Lucas", "Santiago / Leo", "Tomás / Federico"].map((team, index) => (
            <div key={team} className="flex items-center justify-between rounded-[14px] bg-[#222722] px-3 py-3">
              <span className="text-xs font-bold text-slate-200">{team}</span>
              <span className="text-[0.68rem] font-semibold text-slate-500">Pareja {index + 1}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "fixture",
      title: "Fixture y próximos partidos",
      content: (
        <div className="grid gap-2">
          {[
            ["20 JUN · 18:00", "Víctor / Nicolás", "Martín / Lucas"],
            ["23 JUN · 20:30", "Santiago / Leo", "Tomás / Federico"],
          ].map(([date, teamA, teamB]) => (
            <div key={date} className="rounded-[14px] bg-[#222722] px-3 py-3">
              <p className="text-[0.68rem] font-bold text-[#b6c56f]">{date}</p>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs font-bold text-slate-200">
                <span>{teamA}</span>
                <span className="text-slate-500">VS</span>
                <span className="text-right">{teamB}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const standings = [
    { name: "Víctor / Nicolás", played: 6, won: 5, lost: 1, setsWon: 11, setsLost: 4, points: 15 },
    { name: "Martín / Lucas", played: 6, won: 4, lost: 2, setsWon: 9, setsLost: 6, points: 12 },
    { name: "Santiago / Leo", played: 6, won: 2, lost: 4, setsWon: 6, setsLost: 9, points: 6 },
    { name: "Tomás / Federico", played: 6, won: 1, lost: 5, setsWon: 4, setsLost: 11, points: 3 },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-slate-300"
        >
          <ChevronRight size={21} className="rotate-180" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400">Detalle de liga</p>
          <h1 className="truncate text-xl font-extrabold text-white">{league.name}</h1>
        </div>
      </div>

      <article className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#191d19]">
        <div className="relative h-24 bg-[#202520]">
          <div className="absolute right-4 top-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  hasStarted ? "bg-[#b6c56f]" : "bg-slate-400"
                }`}
              />
              <p className={`text-xs font-extrabold ${hasStarted ? "text-[#d8e594]" : "text-slate-200"}`}>
                {hasStarted ? "Liga en curso" : "Próxima a comenzar"}
              </p>
            </div>
            <p className="mt-1 text-[0.62rem] font-medium text-slate-400">
              {hasStarted
                ? `Comenzó el ${league.startDate.replace("Inicio ", "")}`
                : `Comienza el ${league.startDate.replace("Inicio ", "")}`}
            </p>
          </div>
          <span className="absolute -bottom-7 left-5 grid h-14 w-14 place-items-center rounded-[18px] bg-[#737d51] text-white ring-4 ring-[#191d19]">
            <Trophy size={27} />
          </span>
        </div>
        <div className="px-5 pb-5 pt-10">
          <h2 className="text-xl font-black text-white">{league.name}</h2>
          <p className="mt-1 text-sm font-bold text-slate-300">{league.modality}</p>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-[16px] bg-[#222722] p-3">
              <UsersRound size={18} className="text-[#9aa56a]" />
              <p className="mt-2 text-[0.68rem] font-semibold text-slate-500">Categoría</p>
              <p className="mt-0.5 text-sm font-extrabold text-white">{league.category}</p>
            </div>
            <div className="rounded-[16px] bg-[#222722] p-3">
              <CalendarDays size={18} className="text-[#9aa56a]" />
              <p className="mt-2 text-[0.68rem] font-semibold text-slate-500">Comienzo</p>
              <p className="mt-0.5 text-sm font-extrabold text-white">{league.startDate.replace("Inicio ", "")}</p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between rounded-[16px] bg-[#222722] px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2b3227] text-[#9aa56a]">
                <UsersRound size={19} />
              </span>
              <div>
                <p className="text-[0.68rem] font-semibold text-slate-500">Jugadores inscriptos</p>
                <p className="mt-0.5 text-sm font-extrabold text-white">{league.playerCount} jugadores</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRegistrationOpen(true)}
            className="mt-3 flex w-full items-center justify-center rounded-[16px] border border-[#d9964b]/30 bg-[#b97735] px-4 py-3.5 text-sm font-black text-white shadow-[0_0_18px_rgba(185,119,53,0.12)] transition active:scale-[0.99]"
          >
            Inscribirme en esta liga
          </button>

        </div>
      </article>

      <div className="grid gap-2.5">
        {sections.map((section) => {
          const isExpanded = Boolean(expandedSections[section.id]);

          return (
            <section
              key={section.id}
              className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#191d19]"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isExpanded}
                aria-controls={`league-section-${section.id}`}
                className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-extrabold text-white"
              >
                {section.title}
                <ChevronRight
                  size={19}
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
              <div
                id={`league-section-${section.id}`}
                className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-t border-white/[0.08] px-3 pb-3 pt-3">{section.content}</div>
                </div>
              </div>
            </section>
          );
        })}

        <button
          type="button"
          onClick={() => setIsStandingsOpen(true)}
          className="flex w-full items-center justify-between rounded-[18px] border border-white/[0.08] bg-[#191d19] px-4 py-4 text-left text-sm font-extrabold text-white"
        >
          Tabla de posiciones
          <ChevronRight size={19} className="shrink-0 text-slate-400" />
        </button>
      </div>

      {isStandingsOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsStandingsOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="standings-title"
            className="flex max-h-[88vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#151815] shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-400">{league.name}</p>
                <h2 id="standings-title" className="truncate text-lg font-extrabold text-white">
                  Tabla de posiciones
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsStandingsOpen(false)}
                aria-label="Cerrar tabla de posiciones"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-slate-300"
              >
                <X size={19} />
              </button>
            </div>

            <div className="overflow-hidden p-2">
              <table className="w-full table-fixed border-separate border-spacing-0 overflow-hidden text-left">
                <colgroup>
                  <col className="w-[34%]" />
                  {Array.from({ length: 7 }).map((_, index) => (
                    <col key={index} className="w-[9.42%]" />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    {[
                      "Nombre",
                      "PJ",
                      "PG",
                      "PP",
                      "SG",
                      "SP",
                      "DS",
                      "PTS",
                    ].map((heading) => (
                      <th
                        key={heading}
                        title={
                          {
                            PJ: "Partidos jugados",
                            PG: "Partidos ganados",
                            PP: "Partidos perdidos",
                            SG: "Sets ganados",
                            SP: "Sets perdidos",
                            DS: "Diferencia de sets",
                            PTS: "Cantidad de puntos",
                          }[heading]
                        }
                        className={`border-b border-white/10 bg-[#202520] py-2.5 text-[0.55rem] font-extrabold uppercase text-slate-400 ${
                          heading === "Nombre" ? "px-2 text-left" : "px-0.5 text-center"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.name}>
                      <td className="border-b border-white/[0.06] bg-[#191d19] px-2 py-3 text-[0.62rem] font-extrabold leading-tight text-white">
                        <span className="mr-1 text-[#b6c56f]">{index + 1}</span>
                        <span className="break-words">{team.name}</span>
                      </td>
                      {[
                        team.played,
                        team.won,
                        team.lost,
                        team.setsWon,
                        team.setsLost,
                        team.setsWon - team.setsLost,
                        team.points,
                      ].map((value, valueIndex) => (
                        <td
                          key={`${team.name}-${valueIndex}`}
                          className={`border-b border-white/[0.06] bg-[#191d19] px-0.5 py-3 text-center text-[0.62rem] font-bold ${
                            valueIndex === 6 ? "text-[#d8e594]" : "text-slate-300"
                          }`}
                        >
                          {valueIndex === 5 && Number(value) > 0 ? `+${value}` : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {isRegistrationOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsRegistrationOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-title"
            className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[24px] border border-white/[0.08] bg-[#151815] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#d79a5d]">Inscripción al torneo</p>
                <h2 id="registration-title" className="mt-0.5 truncate text-xl font-extrabold text-white">
                  {league.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsRegistrationOpen(false)}
                aria-label="Cerrar información de inscripción"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-slate-300"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  ["Modalidad", league.modality],
                  ["Categoría", league.category],
                  ["Comienzo", league.startDate.replace("Inicio ", "")],
                  ["Inscriptos", `${league.playerCount} jugadores`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[16px] bg-[#202520] p-3">
                    <p className="text-[0.68rem] font-semibold text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-extrabold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-[18px] border border-[#d9964b]/20 bg-[#2a231b] p-4">
                <p className="text-xs font-semibold text-[#d79a5d]">Costo de inscripción</p>
                <p className="mt-1 text-2xl font-black text-white">
                  ${league.registrationFee.toLocaleString("es-AR")}
                </p>
                <p className="mt-1 text-[0.68rem] font-medium text-slate-400">Por jugador</p>
              </div>

              <div className="mt-3 rounded-[18px] bg-[#202520] p-4">
                <p className="text-xs font-semibold text-slate-500">Premios</p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-slate-200">{league.prizes}</p>
              </div>

              <div className="mt-3 rounded-[18px] bg-[#202520] p-4">
                <p className="text-xs font-semibold text-slate-500">Información del torneo</p>
                <ul className="mt-2 grid gap-1.5 text-xs font-medium text-slate-300">
                  <li>• Fase de grupos y eliminación directa.</li>
                  <li>• Partidos coordinados por la organización.</li>
                  <li>• La inscripción queda sujeta a disponibilidad.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsRegistrationOpen(false);
                  setIsRegistrationFormOpen(true);
                }}
                className="mt-4 flex w-full items-center justify-center rounded-[16px] border border-[#e2a260]/30 bg-[#b97735] px-4 py-3.5 text-sm font-black text-white transition active:scale-[0.99]"
              >
                Solicitar inscripción
              </button>
            </div>
          </section>
        </div>
      )}

      {isRegistrationFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsRegistrationFormOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-form-title"
            className="flex max-h-[92vh] w-full max-w-[460px] flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#151815] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-4">
              <div>
                <p className="text-xs font-semibold text-[#d79a5d]">{league.name}</p>
                <h2 id="registration-form-title" className="mt-0.5 text-xl font-extrabold text-white">
                  Datos de inscripción
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsRegistrationFormOpen(false)}
                aria-label="Cerrar formulario de inscripción"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-slate-300"
              >
                <X size={19} />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <article className="rounded-[20px] border border-white/[0.08] bg-[#202520] p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2b3227] text-[#9aa56a]">
                    <UsersRound size={19} />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Mis datos</h3>
                    <p className="text-[0.68rem] font-medium text-slate-500">Jugador principal</p>
                  </div>
                </div>

                {!isGuest ? (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-400">Mi código de jugador</label>
                    <input
                      value={playerCode}
                      readOnly
                      className="h-12 w-full rounded-[14px] border border-white/[0.08] bg-[#181c18] px-3 text-sm font-black uppercase tracking-wider text-slate-200 outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="registration-whatsapp" className="mb-1.5 block text-xs font-bold text-slate-400">
                      Mi número de WhatsApp
                    </label>
                    <input
                      id="registration-whatsapp"
                      type="tel"
                      inputMode="tel"
                      value={registrationDraft.playerWhatsApp}
                      onChange={(event) => {
                        updateRegistrationDraft({ playerWhatsApp: event.target.value });
                        setRegistrationError("");
                      }}
                      placeholder="Ejemplo: 11 5555 1234"
                      className="h-12 w-full rounded-[14px] border border-white/[0.08] bg-[#181c18] px-3 text-sm font-bold text-white outline-none focus:border-[#c98542]"
                    />
                  </div>
                )}

                <div className="mt-3">
                  <label htmlFor="registration-category" className="mb-1.5 block text-xs font-bold text-slate-400">
                    Mi categoría
                  </label>
                  <select
                    id="registration-category"
                    value={registrationDraft.registrationCategory}
                    onChange={(event) => updateRegistrationDraft({ registrationCategory: event.target.value })}
                    className="h-12 w-full rounded-[14px] border border-white/[0.08] bg-[#181c18] px-3 text-sm font-bold text-white outline-none focus:border-[#c98542]"
                  >
                    {["8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra"].map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </article>

              <article className="mt-3 rounded-[20px] border border-white/[0.08] bg-[#202520] p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2b3227] text-[#9aa56a]">
                    <UsersRound size={19} />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Datos de mi pareja</h3>
                    <p className="text-[0.68rem] font-medium text-slate-500">Segundo jugador</p>
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-2 text-xs font-bold text-slate-400">¿Mi pareja tiene código del club?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Sí", guest: false },
                      { label: "No", guest: true },
                    ].map((option) => (
                      <label
                        key={option.label}
                        className={`flex cursor-pointer items-center justify-center rounded-[14px] border px-3 py-3 text-sm font-extrabold ${
                          registrationDraft.isGuestPartner === option.guest
                            ? "border-[#c98542]/50 bg-[#39291c] text-[#e1a566]"
                            : "border-white/[0.08] bg-[#181c18] text-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="partner-has-code"
                          checked={registrationDraft.isGuestPartner === option.guest}
                          onChange={() => {
                            updateRegistrationDraft({ isGuestPartner: option.guest });
                            setRegistrationError("");
                          }}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-3">
                  {registrationDraft.isGuestPartner ? (
                    <>
                      <label htmlFor="partner-whatsapp" className="mb-1.5 block text-xs font-bold text-slate-400">
                        WhatsApp de mi pareja
                      </label>
                      <input
                        id="partner-whatsapp"
                        type="tel"
                        inputMode="tel"
                        value={registrationDraft.partnerWhatsApp}
                        onChange={(event) => {
                          updateRegistrationDraft({ partnerWhatsApp: event.target.value });
                          setRegistrationError("");
                        }}
                        placeholder="Ejemplo: 11 5555 5678"
                        className="h-12 w-full rounded-[14px] border border-white/[0.08] bg-[#181c18] px-3 text-sm font-bold text-white outline-none focus:border-[#c98542]"
                      />
                    </>
                  ) : (
                    <>
                      <label htmlFor="partner-code" className="mb-1.5 block text-xs font-bold text-slate-400">
                        Código de jugador de mi pareja
                      </label>
                      <input
                        id="partner-code"
                        value={registrationDraft.partnerCode}
                        onChange={(event) => {
                          updateRegistrationDraft({ partnerCode: event.target.value.toUpperCase() });
                          setRegistrationError("");
                        }}
                        autoCapitalize="characters"
                        spellCheck={false}
                        placeholder="Ejemplo: A1B2C3"
                        className="h-12 w-full rounded-[14px] border border-white/[0.08] bg-[#181c18] px-3 text-sm font-black uppercase tracking-wider text-white outline-none focus:border-[#c98542]"
                      />
                    </>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="partner-category" className="mb-1.5 block text-xs font-bold text-slate-400">
                    Categoría de mi pareja
                  </label>
                  <select
                    id="partner-category"
                    value={registrationDraft.partnerCategory}
                    onChange={(event) => updateRegistrationDraft({ partnerCategory: event.target.value })}
                    className="h-12 w-full rounded-[14px] border border-white/[0.08] bg-[#181c18] px-3 text-sm font-bold text-white outline-none focus:border-[#c98542]"
                  >
                    {["8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra"].map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </article>

              {registrationError && (
                <p className="mt-3 rounded-[14px] bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400">
                  {registrationError}
                </p>
              )}

              <button
                type="button"
                onClick={requestRegistration}
                className="mt-4 flex w-full items-center justify-center rounded-[16px] border border-[#e2a260]/30 bg-[#b97735] px-4 py-3.5 text-sm font-black text-white transition active:scale-[0.99]"
              >
                Finalizar solicitud
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default LeagueDetailPage;
