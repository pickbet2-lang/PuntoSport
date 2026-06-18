const normalizeWhatsAppNumber = (number: string) => number.replace(/\D/g, "");

export const clubConfig = {
  whatsappNumber: normalizeWhatsAppNumber(
    import.meta.env.VITE_CLUB_WHATSAPP ?? "5491130000000",
  ),
  instagramUrl:
    import.meta.env.VITE_INSTAGRAM_URL ?? "https://www.instagram.com/puntosport/",
};

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${clubConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
