import { BookOpenCheck, CalendarCheck, UsersRound } from "lucide-react";
import type {
  ActionItem,
  AgendaItem,
  League,
  LiveMatch,
  MatchHistoryItem,
  Ranking,
  RankingDetail,
  Reminder,
  UpcomingMatch,
  User,
} from "../types";

export const mockUser: User = {
  id: "usr_victor_001",
  name: "Víctor",
  email: "victor@puntosport.com",
  photoUrl: "",
  playerCode: "K3J6H9",
  isRegistered: true,
  isActive: true,
  phone: "+54 9 11 5555-0184",
  phoneVerified: true,
  authProviders: ["Google", "Apple"],
};

export const actionItems: ActionItem[] = [
  {
    title: "Reservar en Punto Sport",
    subtitle: "Reservá tu cancha de pádel",
    route: "/reservas",
    variant: "primary",
    Icon: CalendarCheck,
  },
  {
    title: "Social Pádel",
    subtitle: "Jugá. Conectá. Disfrutá.",
    route: "/social-padel",
    variant: "secondary",
    Icon: UsersRound,
  },
  {
    title: "Profesorado",
    subtitle: "Entrená. Aprendé. Mejorá.",
    route: "/profesorado",
    variant: "secondary",
    Icon: BookOpenCheck,
  },
];

export const leagues: League[] = [
  {
    id: "league_suma_13",
    name: "LIGA SUMA 13",
    modality: "MIXTA",
    category: "Cat. 7ma",
    startDate: "Inicio 12/06/2026",
    playerCount: 24,
    registrationFee: 18000,
    prizes: "Trofeos, indumentaria y órdenes de compra",
    accent: "teal",
  },
  {
    id: "league_power",
    name: "LIGA POWER",
    modality: "MASCULINA",
    category: "Cat. 6ta",
    startDate: "Inicio 15/06/2026",
    playerCount: 32,
    registrationFee: 20000,
    prizes: "Trofeos, paletas y órdenes de compra",
    accent: "blue",
  },
  {
    id: "league_next",
    name: "LIGA NEXT",
    modality: "FEMENINA",
    category: "Cat. 8va",
    startDate: "Inicio 18/06/2026",
    playerCount: 20,
    registrationFee: 18000,
    prizes: "Trofeos, indumentaria y premios de auspiciantes",
    accent: "violet",
  },
  {
    id: "league_americana",
    name: "LIGA AMERICANA",
    modality: "MIXTA",
    category: "Cat. 5ta",
    startDate: "Inicio 22/06/2026",
    playerCount: 28,
    registrationFee: 22000,
    prizes: "Trofeos, paletas y crédito en Punto Sport",
    accent: "amber",
  },
];

export const upcomingMatches: UpcomingMatch[] = [
  {
    id: "upcoming_01",
    date: "2026-06-20T18:00:00-03:00",
    dateLabel: "SÁB 20 JUN · 18:00",
    location: "Punto Sport",
    court: "Cancha 2",
    teamA: [
      { id: "p_01", name: "Víctor", initials: "VR", imageSeed: "teal" },
      { id: "p_02", name: "Nicolás", initials: "NC", imageSeed: "mint" },
    ],
    teamB: [
      { id: "p_03", name: "Martín", initials: "MS", imageSeed: "gray" },
      { id: "p_04", name: "Lucas", initials: "LA", imageSeed: "blue" },
    ],
    confirmations: {
      p_01: "confirmed",
      p_02: "confirmed",
      p_03: "confirmed",
      p_04: "confirmed",
    },
  },
  {
    id: "upcoming_02",
    date: "2026-06-23T20:30:00-03:00",
    dateLabel: "MAR 23 JUN · 20:30",
    location: "Punto Sport",
    court: "Cancha 1",
    teamA: [
      { id: "p_01", name: "Víctor", initials: "VR", imageSeed: "teal" },
      { id: "p_05", name: "Santiago", initials: "ST", imageSeed: "mint" },
    ],
    teamB: [
      { id: "p_06", name: "Tomás", initials: "TM", imageSeed: "gray" },
      { id: "p_07", name: "Leo", initials: "LE", imageSeed: "blue" },
    ],
    confirmations: {
      p_01: "confirmed",
      p_05: "confirmed",
      p_06: "pending",
      p_07: "pending",
    },
  },
  {
    id: "upcoming_03",
    date: "2026-06-27T19:00:00-03:00",
    dateLabel: "SÁB 27 JUN · 19:00",
    location: "Punto Sport",
    court: "Cancha 3",
    teamA: [
      { id: "p_01", name: "Víctor", initials: "VR", imageSeed: "teal" },
      { id: "p_02", name: "Nicolás", initials: "NC", imageSeed: "mint" },
    ],
    teamB: [
      { id: "p_08", name: "Federico", initials: "FD", imageSeed: "gray" },
      { id: "p_09", name: "Juan", initials: "JN", imageSeed: "blue" },
    ],
    confirmations: {
      p_01: "confirmed",
      p_02: "unavailable",
      p_08: "pending",
      p_09: "confirmed",
    },
  },
];

export const ranking: Ranking = {
  position: 27,
  category: "Cat. 7ma",
  points: 1280,
  trend: [22, 32, 29, 40, 35, 31, 45, 52],
};

export const reminders: Reminder[] = [
  {
    key: "upcomingMatches",
    label: "Próximos partidos",
    status: "enabled",
    preferredChannel: "push",
  },
  {
    key: "bookings",
    label: "Reservas",
    status: "enabled",
    preferredChannel: "push",
  },
  {
    key: "scheduleChanges",
    label: "Cambios de horario",
    status: "permission-pending",
    preferredChannel: "WhatsApp",
  },
  {
    key: "leagueStart",
    label: "Inicio de liga",
    status: "enabled",
    preferredChannel: "WhatsApp",
  },
  {
    key: "results",
    label: "Resultados",
    status: "disabled",
    preferredChannel: "push",
  },
  {
    key: "news",
    label: "Novedades",
    status: "disabled",
    preferredChannel: "push",
  },
];

export const agendaItems: AgendaItem[] = [
  {
    id: "agenda_01",
    day: "Sab 17 May",
    time: "18:00",
    partner: "Nicolas",
    rivals: "Martin / Lucas",
    court: "Cancha 2",
    note: "Llegar 15 min antes",
  },
  {
    id: "agenda_02",
    day: "Mar 20 May",
    time: "20:30",
    partner: "Santiago",
    rivals: "Tomas / Leo",
    court: "Cancha 1",
    note: "Partido de liga",
  },
  {
    id: "agenda_03",
    day: "Jue 22 May",
    time: "19:00",
    partner: "Nicolas",
    rivals: "A confirmar",
    court: "Cancha 3",
    note: "Reserva recreativa",
  },
];

export const rankingDetail: RankingDetail = {
  position: 27,
  category: "Cat. 7ma",
  points: 1280,
  won: 18,
  lost: 9,
  played: 27,
  winRate: "67%",
  bestStreak: 5,
};

export const matchHistory: MatchHistoryItem[] = [
  {
    id: "history_01",
    date: "12 May",
    result: "Ganado",
    score: "6-4 / 6-3",
    partner: "Nicolas",
    rivals: "Martin / Lucas",
    court: "Cancha 2",
  },
  {
    id: "history_02",
    date: "08 May",
    result: "Perdido",
    score: "4-6 / 6-7",
    partner: "Santiago",
    rivals: "Tomas / Leo",
    court: "Cancha 1",
  },
  {
    id: "history_03",
    date: "04 May",
    result: "Ganado",
    score: "7-5 / 6-2",
    partner: "Nicolas",
    rivals: "Fede / Juan",
    court: "Cancha 3",
  },
];

export const liveMatches: LiveMatch[] = [
  {
    id: "live_01",
    time: "18:00",
    court: "Cancha 1",
    status: "En juego",
    teamA: "Nico / Victor",
    teamB: "Martin / Lucas",
    score: "4-3",
  },
  {
    id: "live_02",
    time: "18:30",
    court: "Cancha 2",
    status: "Por empezar",
    teamA: "Santi / Leo",
    teamB: "Tomas / Fede",
    score: "0-0",
  },
  {
    id: "live_03",
    time: "19:00",
    court: "Cancha 3",
    status: "Finalizando",
    teamA: "Ana / Flor",
    teamB: "Sofi / Vale",
    score: "5-5",
  },
];
