import { useEffect, useState } from "react";
import { Camera, Edit3, Upload, X } from "lucide-react";
import type { User } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSave: (profile: Pick<User, "name" | "email" | "phone" | "photoUrl">) => void;
}

const ProfileModal = ({ isOpen, user, onClose, onSave }: ProfileModalProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [photoName, setPhotoName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? "");
      setPhotoUrl(user.photoUrl);
      setPhotoError("");
    }
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/55 px-4 pb-4 pt-12 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[86vh] w-full max-w-[480px] flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#151815] shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-slate-300">
              <Edit3 size={19} />
            </span>
            <h2 className="truncate text-lg font-extrabold text-white">Mi perfil</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar perfil"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#20261f] text-slate-300"
          >
            <X size={19} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          <section className="rounded-[22px] bg-[#1a1f1a] p-4">
            <div className="flex items-center gap-3">
              <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#222821]">
                {photoUrl ? (
                  <img src={photoUrl} alt={name} className="h-[52px] w-[52px] rounded-full object-cover" />
                ) : (
                  <div className="grid h-[52px] w-[52px] place-items-center rounded-full bg-[#747f4b] text-lg font-black text-white">
                    {name.slice(0, 1)}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-[#151a15] text-ball-200 ring-2 ring-[#1a1f1a]">
                  <Camera size={15} />
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold text-white">{name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{user.playerCode}</p>
                {photoName && <p className="mt-1 truncate text-xs text-slate-400">{photoName}</p>}
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-[16px] bg-[#252b24] px-3 py-2.5 text-sm font-bold text-slate-200">
              <Upload size={17} />
              Cargar foto de perfil
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  if (file.size > 1_500_000) {
                    setPhotoError("La foto debe pesar menos de 1,5 MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    setPhotoUrl(String(reader.result ?? ""));
                    setPhotoName(file.name);
                    setPhotoError("");
                  };
                  reader.onerror = () => setPhotoError("No se pudo leer la imagen.");
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {photoError && <p className="mt-2 text-xs font-bold text-red-400">{photoError}</p>}
          </section>

          <section className="mt-3 grid gap-2 rounded-[22px] bg-[#1a1f1a] p-4">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-400">Nombre</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-[14px] bg-[#252b24] px-3 py-2 text-sm font-semibold text-white outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-400">Email</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-[14px] bg-[#252b24] px-3 py-2 text-sm font-semibold text-white outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-400">Telefono</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded-[14px] bg-[#252b24] px-3 py-2 text-sm font-semibold text-white outline-none" />
            </label>
          </section>

          <button
            type="button"
            onClick={() => {
              onSave({
                name: name.trim() || user.name,
                email: email.trim(),
                phone: phone.trim(),
                photoUrl,
              });
              onClose();
            }}
            className="mt-3 flex w-full items-center justify-center rounded-[16px] bg-[#9daa65] px-4 py-3.5 text-sm font-black text-[#171a14] transition active:scale-[0.99]"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
