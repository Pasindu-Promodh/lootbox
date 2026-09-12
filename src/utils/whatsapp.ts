// Digits only, international format, no leading + or spaces (required by wa.me).
export const WHATSAPP_NUMBER = "94757007562";

/** Builds a wa.me link, optionally prefilling a message. */
export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
