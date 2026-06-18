import type { Player } from "../types";

interface PlayerAvatarProps {
  player: Player;
}

const PlayerAvatar = ({ player }: PlayerAvatarProps) => {
  return (
    <span
      title={player.name}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-[#5f675f]/55 text-xs font-black text-slate-200 shadow-none ring-1 ring-black/20 backdrop-blur-sm"
    >
      {player.initials}
    </span>
  );
};

export default PlayerAvatar;
