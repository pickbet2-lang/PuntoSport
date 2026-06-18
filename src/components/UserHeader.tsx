import type { User } from "../types";
import puntoSportLogo from "../assets/punto-sport-logo.png";

interface UserHeaderProps {
  user: User;
  onProfileOpen: () => void;
}

const UserHeader = ({ user, onProfileOpen }: UserHeaderProps) => {
  return (
    <header className={`px-1 pb-1 pt-1 ${user.isRegistered ? "flex items-center justify-between gap-3" : ""}`}>
      {user.isRegistered ? (
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onProfileOpen}
            aria-label="Abrir perfil"
            className="relative grid h-11 w-11 shrink-0 place-items-center overflow-visible rounded-full bg-[#222821]"
          >
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#747f4b] text-sm font-black text-white">
                {user.name.slice(0, 1)}
              </div>
            )}
            {user.isActive && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-[2px] border-[#121612] bg-ball-300" />
            )}
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-[1.12rem] font-extrabold leading-tight tracking-normal text-white min-[390px]:text-[1.22rem]">
                Hola, <span className="text-slate-100">{user.name}</span>
              </h1>
              <p className="truncate text-xs font-medium text-slate-400">Usuario registrado</p>
            </div>
            <div
              title="Código único de jugador"
              className="grid h-7 shrink-0 place-items-center rounded-full bg-white/[0.06] px-2.5 text-center ring-1 ring-white/10"
            >
              <span className="block text-[0.74rem] font-black leading-none tracking-wide text-slate-300">
                {user.playerCode}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <img
          src={puntoSportLogo}
          alt="Punto Sport"
          className="mx-auto h-auto w-[62%] max-w-[245px] object-contain"
        />
      )}
    </header>
  );
};

export default UserHeader;
