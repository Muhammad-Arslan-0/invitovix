export function isLightHexColor(hex: string): boolean {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length !== 3 && clean.length !== 6) return false;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return false;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // Relative luminance threshold (WCAG sRGB approximation)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62;
}

export function getContrastTextColor(bgHex: string): string {
  return isLightHexColor(bgHex) ? "#111111" : "#FFFFFF";
}

export function hexToRgba(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length !== 3 && clean.length !== 6) {
    return `rgba(255, 255, 255, ${clamped})`;
  }
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) {
    return `rgba(255, 255, 255, ${clamped})`;
  }
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${clamped})`;
}


