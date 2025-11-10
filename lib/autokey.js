export function normalizeText(text) {
  if (!text) return "";
  // Collapse all whitespace (including newlines) to single spaces, then trim
  return text.replace(/\s+/g, " ").trim();
}

// FNV-1a hash (stable across Node & browser)
function fnv1aHex(str) {
  if (typeof BigInt !== "undefined") {
    const FNV_OFFSET_BASIS_64 = 0xcbf29ce484222325n; // 14695981039346656037
    const FNV_PRIME_64 = 0x100000001b3n; // 1099511628211
    let h = FNV_OFFSET_BASIS_64;
    for (let i = 0; i < str.length; i++) {
      h ^= BigInt(str.charCodeAt(i));
      h = (h * FNV_PRIME_64) & ((1n << 64n) - 1n); // keep 64-bit wrap
    }
    return h.toString(16).padStart(16, "0"); // 16 hex chars
  }

  // Fallback: original 32-bit FNV-1a
  let h32 = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h32 ^= str.charCodeAt(i);
    h32 = Math.imul(h32, 16777619) >>> 0;
  }
  return h32.toString(16).padStart(8, "0");
}

export function autoKeyFromText(text) {
  const normalized = normalizeText(text);
  if (!normalized) return "";
  return `auto.${fnv1aHex(normalized)}`;
}
