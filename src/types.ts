import type { LucideIcon } from "lucide-react";

export type RoutePath =
  | "/"
  | "/reservas"
  | "/social-padel"
  | "/profesorado"
  | "/ligas"
  | `/ligas/${string}`
  | "/partidos"
  | "/ranking"
  | "/menu"
  | "/recordatorios";

export type AuthProvider = "Google" | "Apple";

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  playerCode: string;
  isRegistered: boolean;
  isActive: boolean;
  phone?: string;
  phoneVerified: boolean;
  authProviders: AuthProvider[];
}

export interface ActionItem {
  title: string;
  subtitle: string;
  route: RoutePath;
  variant: "primary" | "secondary";
  Icon: LucideIcon;
}

export interface League {
  id: string;
  name: string;
  modality: string;
  category: string;
  startDate: string;
  playerCount: number;
  registrationFee: number;
  prizes: string;
  accent: "teal" | "blue" | "violet" | "amber";
}

export interface Player {
  id: string;
  name: string;
  initials: string;
  imageSeed: string;
}

export interface UpcomingMatch {
  id: string;
  date: string;
  dateLabel: string;
  location: string;
  court: string;
  teamA: Player[];
  teamB: Player[];
  confirmations: Record<string, "confirmed" | "pending" | "unavailable">;
}

export interface Ranking {
  position: number;
  category: string;
  points: number;
  trend: number[];
}

export type ReminderKey =
  | "upcomingMatches"
  | "bookings"
  | "scheduleChanges"
  | "leagueStart"
  | "results"
  | "news";

export type ReminderStatus = "enabled" | "disabled" | "permission-pending";
export type ReminderChannel = "push" | "WhatsApp";

export interface Reminder {
  key: ReminderKey;
  label: string;
  status: ReminderStatus;
  preferredChannel: ReminderChannel;
}

export type QuickAccessModal = "agenda" | "ranking" | "history" | "partner" | null;

export interface AgendaItem {
  id: string;
  day: string;
  time: string;
  partner: string;
  rivals: string;
  court: string;
  note: string;
}

export interface RankingDetail {
  position: number;
  category: string;
  points: number;
  won: number;
  lost: number;
  played: number;
  winRate: string;
  bestStreak: number;
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  result: "Ganado" | "Perdido" | "Jugado";
  score: string;
  partner: string;
  rivals: string;
  court: string;
}

export interface LiveMatch {
  id: string;
  time: string;
  court: string;
  status: "En juego" | "Por empezar" | "Finalizando";
  teamA: string;
  teamB: string;
  score: string;
}
