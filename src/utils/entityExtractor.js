const MODE_RULES = [
  { mode: "FD", pattern: /\bFD\b/i },
  { mode: "NEFT", pattern: /\bNEFT\b/i },
  { mode: "UPI", pattern: /\bUPI\b/i },
  { mode: "IMPS", pattern: /\bIMPS\b/i },
  { mode: "RTGS", pattern: /\bRTGS\b/i },
  { mode: "ACH", pattern: /\b(?:ACH|NACH)\b/i },
  { mode: "NIP", pattern: /\bNIP\b/i },
];

const TOKEN_NOISE_WORDS = new Set([
  "UPI", "NEFT", "IMPS", "RTGS", "ACH", "NACH", "NIP", "FD",
  "CR", "DR", "D", "C", "TO", "BY", "FROM",
  "TRANSFER", "PAYMENT", "PAID", "RECEIVED", "THROUGH", "USING",
  "BANK", "YESB", "YES", "SENT",
  "SALARY", "BONUS",
  "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  "JANUARY", "FEBRUARY", "MARCH",
  "PRIVATE", "PVT", "LIMITED", "LTD",
  "MOBILE", "ACCOUNT", "A", "AN", "THE",
]);

function normalizeSeparators(text = "") {
  return String(text || "")
    .toUpperCase()
    .replace(/[_]/g, " ")
    .replace(/[\/\\\-:;,]+/g, "|")
    .replace(/\s+/g, " ")
    .replace(/\|{2,}/g, "|")
    .trim();
}

function detectMode(text = "") {
  for (const rule of MODE_RULES) {
    if (rule.pattern.test(text)) {
      return rule.mode;
    }
  }
  return "GENERIC";
}

function isIdLikeToken(token = "") {
  if (!token) return true;
  if (/^\d+$/.test(token) && token.length >= 4) return true;
  if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(token)) return true; // IFSC-ish
  if (/^IN\d{8,}$/.test(token)) return true;
  if (/^[A-Z]{2,}\d{6,}$/i.test(token)) return true;
  if (/^\S+@\S+$/.test(token)) return true;
  if (/^(?=.*[A-Z])(?=.*\d)[A-Z0-9]{12,}$/i.test(token)) return true;
  return false;
}

function cleanupSegment(segment = "") {
  const rawTokens = String(segment || "")
    .replace(/[^A-Z0-9@&.\s]/gi, " ")
    .split(/\s+/)
    .filter(Boolean);

  const tokens = rawTokens.filter((token) => {
    if (TOKEN_NOISE_WORDS.has(token)) return false;
    if (isIdLikeToken(token)) return false;
    return /[A-Z]/.test(token);
  });

  if (tokens.length === 0) return null;

  return tokens
    .join(" ")
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

function cleanupSegmentGeneric(segment = "") {
  const rawTokens = String(segment || "")
    .replace(/[^A-Z0-9@&.\s]/gi, " ")
    .split(/\s+/)
    .filter(Boolean);

  const tokens = rawTokens.filter((token) => !isIdLikeToken(token));
  if (tokens.length === 0) return null;

  return tokens
    .join(" ")
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

function chooseSegmentByMode(mode, segments) {
  const cleaned = segments
    .map((segment) => cleanupSegment(segment))
    .filter(Boolean);

  if (cleaned.length === 0) return null;

  if (mode === "UPI") {
    return cleaned[0] || null;
  }

  if (mode === "NEFT" || mode === "ACH" || mode === "NIP") {
    return cleaned.sort((a, b) => b.length - a.length)[0] || null;
  }

  if (mode === "FD") {
    const core = cleaned.sort((a, b) => b.length - a.length)[0] || null;
    if (!core) return null;
    return /^FD\b/i.test(core) ? core : `FD ${core}`;
  }

  const genericMerged = segments
    .map((segment) => cleanupSegmentGeneric(segment))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return genericMerged || null;
}

function extractEntity(description = "") {
  const normalized = normalizeSeparators(description);
  if (!normalized) return null;

  const mode = detectMode(normalized);
  const segments = normalized.split("|").map((item) => item.trim()).filter(Boolean);
  if (segments.length === 0) return null;

  return chooseSegmentByMode(mode, segments);
}

module.exports = {
  extractEntity,
};
