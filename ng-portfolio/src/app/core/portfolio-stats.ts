// Actualizado automáticamente por scripts/add-cert.mjs al agregar un certificado.
export const CERTIFICATION_COUNT = 4;

// 4 -> "4", 12 -> "10+", 27 -> "20+". Solo agrega "+" desde 10 en adelante.
export function formatCount(total: number): string {
  if (total < 10) return String(total);
  const floor = Math.floor(total / 10) * 10;
  return `${floor}+`;
}
