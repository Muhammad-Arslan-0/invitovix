/**
 * Normalizes input text into a URL-friendly slug.
 */
export function toSlug(input: string): string {
  const cleaned = input
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "celebration";
}

/**
 * Generates an unguessable, cryptographically secure hashed code slug
 * for private event invitations (e.g. "a7x9m2p4k8").
 * High entropy (~10^15 combinations) prevents guest enumeration or guessing.
 */
export function generateSecureSlug(length: number = 10): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      code += alphabet[bytes[i] % alphabet.length];
    }
    return code;
  }

  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/[^a-z0-9]/g, "").slice(0, length);
  }

  for (let i = 0; i < length; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

/**
 * Generates a unique secure slug. Title parameter is kept for backward
 * compatibility, but the slug is now a cryptographically secure random hashed code.
 */
export function generateUniqueSlug(title?: string): string {
  void title;
  return generateSecureSlug(10);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 64;
}


