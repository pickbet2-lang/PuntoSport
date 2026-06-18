import { BellRing, ChevronRight, MessageCircle, Smartphone } from "lucide-react";
import type { Reminder, User } from "../types";

interface ReminderSettingsProps {
  reminders: Reminder[];
  user: User;
  onOpenSettings: () => void;
}

const statusLabel: Record<Reminder["status"], string> = {
  enabled: "Activada",
  disabled: "Desactivada",
  "permission-pending": "Permiso pendiente",
};

const ReminderSettings = ({ reminders, user, onOpenSettings }: ReminderSettingsProps) => {
  const canUseWhatsApp = Boolean(user.phone && user.phoneVerified);

  const requestWebPushPermission = async () => {
    if (!("Notification" in window)) {
      onOpenSettings();
      return;
    }

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    onOpenSettings();
  };

  return (
    <section className="rounded-[22px] border border-white/10 bg-[#1a1f1a] p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-ball-300/12 text-ball-300">
            <BellRing size={21} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-white">Recordatorios</h2>
            <p className="text-xs font-semibold text-slate-400">Push web o WhatsApp</p>
          </div>
        </div>
        <button
          type="button"
          onClick={requestWebPushPermission}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#252b24] text-ball-300"
          aria-label="Configurar recordatorios"
        >
          <ChevronRight size={19} />
        </button>
      </div>
      <div className="grid gap-2">
        {reminders.map((reminder) => {
          const isEnabled = reminder.status === "enabled";
          const isPending = reminder.status === "permission-pending";
          const ChannelIcon = reminder.preferredChannel === "WhatsApp" ? MessageCircle : Smartphone;
          const channelAvailable = reminder.preferredChannel === "push" || canUseWhatsApp;

          return (
            <button
              key={reminder.key}
              type="button"
              onClick={onOpenSettings}
              className="flex items-center justify-between gap-3 rounded-2xl bg-[#20261f] px-3 py-2.5 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-white">{reminder.label}</span>
                <span className="mt-1 flex items-center gap-1.5 text-[0.68rem] font-semibold text-slate-400">
                  <ChannelIcon size={13} />
                  {channelAvailable ? reminder.preferredChannel : "Validar WhatsApp"}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[0.66rem] font-bold ${
                  isEnabled
                    ? "bg-ball-300 text-[#1b2117]"
                    : isPending
                      ? "bg-amber-300 text-slate-950"
                      : "bg-white/10 text-slate-400"
                }`}
              >
                {statusLabel[reminder.status]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ReminderSettings;
