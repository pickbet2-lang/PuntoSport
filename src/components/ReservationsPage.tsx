import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CalendarDays, ChevronRight, Clock3, X } from "lucide-react";
import puntoSportLogo from "../assets/punto-sport-logo.png";
import { readStorage, storageKeys, writeStorage } from "../utils/storage";

interface DayOption {
  id: string;
  dayName: string;
  dayNumber: string;
  monthName: string;
  isToday: boolean;
}

interface Court {
  id: string;
  name: string;
  covered: boolean;
  pricePerHour: number;
}

interface Booking {
  courtId: string;
  start: string;
  durationMinutes: number;
}

type SearchMode = "time" | "court";
type SlotState = "available" | "occupied" | "overlap";
interface ReservationDraft {
  selectedDayId: string;
  selectedHour: number;
  selectedMinute: string;
  timeConfirmed: boolean;
  searchMode: SearchMode;
  selectedCourtId: string | null;
  duration: number;
}

const courts: Court[] = [
  { id: "court_1", name: "Cancha 1", covered: true, pricePerHour: 8500 },
  { id: "court_2", name: "Cancha 2", covered: false, pricePerHour: 7200 },
  { id: "court_3", name: "Cancha 3", covered: true, pricePerHour: 8500 },
  { id: "court_4", name: "Cancha 4", covered: false, pricePerHour: 7200 },
  { id: "court_5", name: "Cancha 5", covered: true, pricePerHour: 9000 },
];

const bookings: Booking[] = [
  { courtId: "court_1", start: "18:00", durationMinutes: 90 },
  { courtId: "court_2", start: "19:30", durationMinutes: 60 },
  { courtId: "court_4", start: "20:00", durationMinutes: 120 },
  { courtId: "court_5", start: "21:30", durationMinutes: 60 },
];

const hours = Array.from({ length: 15 }, (_, index) => index + 9);
const minutes = ["00", "30"];
const durations = [60, 90, 120];

const toLocalDateId = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const parseLocalDate = (dateId: string) => {
  const [year, month, day] = dateId.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const buildDayOptions = (startDateId: string): DayOption[] => {
  const formatterDay = new Intl.DateTimeFormat("es-AR", { weekday: "short" });
  const formatterMonth = new Intl.DateTimeFormat("es-AR", { month: "short" });
  const today = new Date();
  const todayId = toLocalDateId(today);
  const startDate = parseLocalDate(startDateId);

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateId = toLocalDateId(date);

    return {
      id: dateId,
      dayName: dateId === todayId ? "Hoy" : formatterDay.format(date).replace(".", ""),
      dayNumber: String(date.getDate()).padStart(2, "0"),
      monthName: formatterMonth.format(date).replace(".", ""),
      isToday: dateId === todayId,
    };
  });
};

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const formatTime = (totalMinutes: number) => {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const buildSlotOptions = () => {
  const start = toMinutes("09:00");
  const end = toMinutes("23:00");
  const slots: string[] = [];

  for (let current = start; current <= end; current += 30) {
    slots.push(formatTime(current));
  }

  return slots;
};

const getSlotState = (courtId: string, start: string, durationMinutes: number): SlotState => {
  const startMinutes = toMinutes(start);
  const endMinutes = startMinutes + durationMinutes;
  const closingMinutes = toMinutes("23:00");

  if (endMinutes > closingMinutes) {
    return "overlap";
  }

  const courtBookings = bookings.filter((booking) => booking.courtId === courtId);
  const exactBusyStart = courtBookings.some((booking) => booking.start === start);

  if (exactBusyStart) {
    return "occupied";
  }

  const overlaps = courtBookings.some((booking) => {
    const bookingStart = toMinutes(booking.start);
    const bookingEnd = bookingStart + booking.durationMinutes;
    return startMinutes < bookingEnd && endMinutes > bookingStart;
  });

  return overlaps ? "overlap" : "available";
};

const scrollValueToCenter = <T extends string | number>(
  container: HTMLDivElement,
  values: T[],
  onSelect: (value: T) => void,
) => {
  const center = container.getBoundingClientRect().top + container.clientHeight / 2;
  const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-scroll-value]"));
  const closest = buttons.reduce<{ distance: number; value: string } | null>((current, button) => {
    const box = button.getBoundingClientRect();
    const distance = Math.abs(box.top + box.height / 2 - center);
    const value = button.dataset.scrollValue ?? "";
    return !current || distance < current.distance ? { distance, value } : current;
  }, null);

  const selected = values.find((value) => String(value) === closest?.value);
  if (selected !== undefined) {
    onSelect(selected);
  }
};

const CourtDrawing = ({ court }: { court: Court }) => (
  <div className="relative mb-3 h-16 overflow-hidden rounded-[14px] border border-white/10 bg-[#20261f]">
    <div className="absolute inset-2 rounded-[10px] border border-white/12">
      <span className="absolute inset-y-0 left-1/2 w-px bg-white/16" />
      <span className="absolute inset-x-0 top-1/2 h-px bg-white/14" />
      <span className="absolute bottom-0 left-1/4 top-1/2 w-px bg-white/12" />
      <span className="absolute bottom-0 right-1/4 top-1/2 w-px bg-white/12" />
      <span className="absolute left-1/4 right-1/4 top-1/2 h-[2px] -translate-y-1/2 bg-[#8f9a61]/55" />
    </div>
    <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-[#8f9a61]" />
    <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[0.58rem] font-bold ${
      court.covered ? "bg-white/[0.07] text-slate-300" : "bg-white/[0.05] text-slate-400"
    }`}>
      {court.covered ? "Techada" : "A cielo"}
    </span>
  </div>
);

const ReservationsPage = () => {
  const todayId = useMemo(() => toLocalDateId(new Date()), []);
  const initialDraft = useMemo(
    () =>
      readStorage<ReservationDraft>(storageKeys.reservationDraft, {
        selectedDayId: "",
        selectedHour: 18,
        selectedMinute: "00",
        timeConfirmed: false,
        searchMode: "time",
        selectedCourtId: null,
        duration: 60,
      }),
    [],
  );
  const [calendarStartDate, setCalendarStartDate] = useState(initialDraft.selectedDayId || todayId);
  const days = useMemo(() => buildDayOptions(calendarStartDate), [calendarStartDate]);
  const slotOptions = useMemo(buildSlotOptions, []);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);
  const [selectedDayId, setSelectedDayId] = useState(initialDraft.selectedDayId);
  const [selectedHour, setSelectedHour] = useState(initialDraft.selectedHour);
  const [selectedMinute, setSelectedMinute] = useState(initialDraft.selectedMinute);
  const [timeConfirmed, setTimeConfirmed] = useState(initialDraft.timeConfirmed);
  const [searchMode, setSearchMode] = useState<SearchMode>(initialDraft.searchMode);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(
    courts.find((court) => court.id === initialDraft.selectedCourtId) ?? null,
  );
  const [duration, setDuration] = useState(initialDraft.duration);
  const selectedTime = `${String(selectedHour).padStart(2, "0")}:${selectedMinute}`;
  const selectedTimeIsValid = !(selectedHour === 23 && selectedMinute === "30");

  const visibleCourts = searchMode === "court"
    ? courts
    : courts.filter((court) => selectedTimeIsValid && getSlotState(court.id, selectedTime, duration) === "available");

  const selectedCourtAvailable = selectedCourt
    ? selectedTimeIsValid && getSlotState(selectedCourt.id, selectedTime, duration) === "available"
    : false;

  useEffect(() => {
    writeStorage<ReservationDraft>(storageKeys.reservationDraft, {
      selectedDayId,
      selectedHour,
      selectedMinute,
      timeConfirmed,
      searchMode,
      selectedCourtId: selectedCourt?.id ?? null,
      duration,
    });
  }, [duration, searchMode, selectedCourt, selectedDayId, selectedHour, selectedMinute, timeConfirmed]);

  return (
    <section className="space-y-4">
      <img
        src={puntoSportLogo}
        alt="Punto Sport"
        className="mx-auto h-auto w-[58%] max-w-[230px] object-contain"
      />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400">Punto Sport</p>
          <h1 className="text-xl font-extrabold text-white">Reservar cancha</h1>
        </div>
        <label
          aria-label="Abrir calendario para elegir fecha"
          className="relative grid h-10 w-10 cursor-pointer place-items-center overflow-hidden rounded-xl bg-white/[0.06] text-slate-300"
        >
          <CalendarDays size={22} />
          <input
            type="date"
            min={todayId}
            value={selectedDayId || todayId}
            onChange={(event) => {
              if (!event.target.value) {
                return;
              }

              setSelectedDayId(event.target.value);
              setCalendarStartDate(event.target.value);
              setSelectedCourt(null);
              setTimeConfirmed(false);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2.5 pr-8">
          {days.map((day) => {
            const selected = selectedDayId === day.id;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => {
                  setSelectedDayId(day.id);
                  setSelectedCourt(null);
                  setTimeConfirmed(false);
                }}
                className={`w-[74px] shrink-0 rounded-[18px] border px-3 py-3 text-center ${
                  selected
                    ? "border-[#8f9a61]/35 bg-[#292f25] text-white"
                    : "border-white/[0.08] bg-[#191d19] text-slate-300"
                }`}
              >
                <span className="block text-xs font-bold capitalize">{day.dayName}</span>
                <span className="mt-1 block text-2xl font-black leading-none">{day.dayNumber}</span>
                <span className="mt-1 block text-[0.68rem] font-semibold capitalize text-slate-400">{day.monthName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDayId && (
      <div className="grid grid-cols-2 rounded-[16px] bg-[#191d19] p-1">
        {[
          ["time", "Buscar por hora"],
          ["court", "Buscar por cancha"],
        ].map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setSearchMode(mode as SearchMode);
              setSelectedCourt(null);
              setTimeConfirmed(false);
            }}
            className={`rounded-[15px] px-3 py-2 text-xs font-extrabold transition ${
              searchMode === mode ? "bg-[#8f9a61] text-[#171a14]" : "text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      )}

      {selectedDayId && searchMode === "time" && (
        <section className="rounded-[18px] border border-white/[0.08] bg-[#191d19] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-white">Elegir horario</h2>
              <p className="text-xs font-medium text-slate-400">La hora del centro queda seleccionada</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#232823] px-2.5 py-1 text-xs font-bold text-slate-300">
              <Clock3 size={14} />
              {selectedTime}
            </span>
          </div>

          <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <span className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-12 -translate-y-1/2 rounded-[14px] border border-white/12" />
            <div
              ref={hourScrollRef}
              onScroll={(event) => scrollValueToCenter(event.currentTarget, hours, (hour) => {
                setSelectedHour(hour);
                setTimeConfirmed(false);
                if (hour === 23) {
                  setSelectedMinute("00");
                }
              })}
              className="h-[164px] snap-y overflow-y-auto rounded-[18px] bg-[#20261f] px-2 py-[58px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="grid gap-2">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    data-scroll-value={hour}
                    onClick={() => {
                      setSelectedHour(hour);
                      setTimeConfirmed(false);
                      hourScrollRef.current?.querySelector(`[data-scroll-value="${hour}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
                    }}
                    className={`snap-center rounded-[14px] px-3 py-2 text-center text-2xl font-black ${
                      selectedHour === hour ? "bg-[#8f9a61] text-[#171a14]" : "text-slate-400"
                    }`}
                  >
                    {String(hour).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-4xl font-black text-slate-500">:</span>
            <div
              ref={minuteScrollRef}
              onScroll={(event) => scrollValueToCenter(event.currentTarget, minutes, (minute) => {
                setSelectedMinute(minute);
                setTimeConfirmed(false);
              })}
              className="h-[164px] snap-y overflow-y-auto rounded-[18px] bg-[#20261f] px-2 py-[58px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="grid gap-2">
                {minutes.map((minute) => {
                  const disabled = selectedHour === 23 && minute === "30";

                  return (
                    <button
                      key={minute}
                      type="button"
                      data-scroll-value={minute}
                      disabled={disabled}
                      onClick={() => {
                        setSelectedMinute(minute);
                        setTimeConfirmed(false);
                        minuteScrollRef.current?.querySelector(`[data-scroll-value="${minute}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
                      }}
                      className={`snap-center rounded-[14px] px-3 py-2 text-center text-2xl font-black disabled:opacity-25 ${
                        selectedMinute === minute && !disabled ? "bg-[#8f9a61] text-[#171a14]" : "text-slate-400"
                      }`}
                    >
                      {minute}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedTimeIsValid}
            onClick={() => {
              setSelectedCourt(null);
              setTimeConfirmed(true);
            }}
            className="mt-4 w-full rounded-[16px] bg-[#8f9a61] px-4 py-3 text-sm font-black text-[#171a14] disabled:bg-[#252b24] disabled:text-slate-500"
          >
            Ver canchas disponibles
          </button>
        </section>
      )}

      {selectedDayId && (searchMode === "court" || timeConfirmed) && (
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-white">
            {searchMode === "court" ? "Elegí una cancha" : "Disponibles a las " + selectedTime}
          </h2>
          <p className="text-xs font-medium text-slate-400">
            {searchMode === "court"
              ? "Después podrás elegir uno de sus horarios disponibles"
              : "Techadas y descubiertas"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {visibleCourts.map((court) => {
            const state = getSlotState(court.id, selectedTime, duration);
            const occupied = state !== "available";

            return (
              <button
                key={court.id}
                type="button"
                onClick={() => setSelectedCourt(court)}
                className={`rounded-[20px] border p-3 text-left ${
                  occupied && searchMode === "time"
                    ? "border-white/[0.07] bg-[#171a17] opacity-70"
                    : "border-white/[0.08] bg-[#191d19]"
                }`}
              >
                <CourtDrawing court={court} />
                <div className="flex items-center justify-between gap-2">
                  <span>
                    <span className="block text-sm font-extrabold text-white">{court.name}</span>
                    <span className="text-xs font-medium text-slate-400">${court.pricePerHour}/h</span>
                  </span>
                  <ChevronRight size={17} className={occupied && searchMode === "time" ? "text-slate-600" : "text-slate-400"} />
                </div>
              </button>
            );
          })}
        </div>

        {searchMode === "time" && visibleCourts.length === 0 && (
          <div className="rounded-[18px] bg-[#1a1f1a] px-3 py-4 text-center text-sm font-semibold text-slate-400">
            No hay canchas libres en ese horario.
          </div>
        )}
      </section>
      )}

      {selectedCourt && (
        <div className="fixed inset-0 z-30 bg-black/55 px-4 pb-4 pt-12 backdrop-blur-sm">
          <div className="mx-auto max-h-[86vh] w-full max-w-[480px] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#151815]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div>
                <h2 className="text-lg font-extrabold text-white">{selectedCourt.name}</h2>
                <p className="text-xs font-medium text-slate-400">
                  {selectedCourt.covered ? "Cancha techada" : "Cancha descubierta"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourt(null)}
                aria-label="Cerrar cancha"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#20261f] text-slate-300"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Tiempo de reserva</p>
                <div className="grid grid-cols-3 gap-2">
                  {durations.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDuration(item)}
                      className={`rounded-[16px] px-3 py-2 text-sm font-bold ${
                        duration === item ? "bg-[#8f9a61] text-[#171a14]" : "bg-[#191d19] text-slate-300"
                      }`}
                    >
                      {item} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 rounded-[18px] bg-[#1a1f1a] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">Precio estimado</span>
                  <span className="text-xl font-black text-slate-100">
                    ${Math.round((selectedCourt.pricePerHour * duration) / 60)}
                  </span>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2 text-[0.66rem] font-bold">
                <span className="rounded-full bg-white/[0.06] px-2 py-1 text-center text-slate-300">Libre</span>
                <span className="rounded-full bg-red-500/20 px-2 py-1 text-center text-red-200">Reservado</span>
                <span className="rounded-full bg-slate-500/18 px-2 py-1 text-center text-slate-300">Se superpone</span>
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Horarios de la cancha</p>
              <div className="grid grid-cols-4 gap-2">
                {slotOptions.map((slot) => {
                  const state = getSlotState(selectedCourt.id, slot, duration);
                  const isSelected = slot === selectedTime;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={state !== "available"}
                      onClick={() => {
                        const [hour, minute] = slot.split(":");
                        setSelectedHour(Number(hour));
                        setSelectedMinute(minute);
                      }}
                      className={`rounded-[14px] px-2 py-2 text-xs font-bold disabled:cursor-not-allowed ${
                        state === "occupied"
                          ? "border border-red-400/25 bg-[rgba(112,38,34,0.78)] text-red-100"
                          : state === "overlap"
                            ? "border border-slate-400/10 bg-[rgba(67,75,70,0.68)] text-slate-300"
                            : isSelected
                              ? "bg-[#8f9a61] text-[#171a14]"
                              : "border border-transparent bg-[#1a1f1a] text-slate-300"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!selectedCourtAvailable}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#8f9a61] px-4 py-3 text-sm font-black text-[#171a14] disabled:bg-[#252b24] disabled:text-slate-500"
              >
                Elegir {selectedCourt.name}
                <ArrowRight size={18} />
              </button>
              {!selectedCourtAvailable && (
                <p className="mt-2 text-center text-xs font-medium text-slate-500">
                  Elegi un horario libre o reduci la duracion para evitar superposiciones.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReservationsPage;
