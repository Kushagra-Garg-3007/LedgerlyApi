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

// Long numeric IDs (account/reference numbers)
const ONLY_DIGITS_REGEX = /^\d+$/;
// IFSC-like token, e.g. HDFC0123456
const IFSC_LIKE_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
// UTR-like token, e.g. IN12345678
const IN_REFERENCE_REGEX = /^IN\d{8,}$/;
// Token with text prefix and long numeric suffix
const TEXT_WITH_LONG_NUMBER_REGEX = /^[A-Z]{2,}\d{6,}$/i;
// Simple email pattern
const EMAIL_REGEX = /^\S+@\S+$/;
// Mixed upper+digits with long length, common in reference IDs
const LONG_MIXED_ID_REGEX = /^(?=.*[A-Z])(?=.*\d)[A-Z0-9]{12,}$/i;

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
  if (!token) {
    return true;
  }

  if (token.length >= 4 && ONLY_DIGITS_REGEX.test(token)) {
    return true;
  }
  if (IFSC_LIKE_REGEX.test(token)) {
    return true;
  }
  if (IN_REFERENCE_REGEX.test(token)) {
    return true;
  }
  if (TEXT_WITH_LONG_NUMBER_REGEX.test(token)) {
    return true;
  }
  if (EMAIL_REGEX.test(token)) {
    return true;
  }
  if (LONG_MIXED_ID_REGEX.test(token)) {
    return true;
  }

  return false;
}

function getCleanTokens(segment = "", removeNoiseWords) {
  const sanitized = String(segment).replace(/[^A-Z0-9@&.\s]/gi, " ");
  const splitTokens = sanitized.split(/\s+/);
  const rawTokens = [];
  for (const token of splitTokens) {
    if (!token) {
      continue;
    }
    rawTokens.push(token);
  }

  const tokens = [];
  for (const token of rawTokens) {
    if (isIdLikeToken(token)) {
      continue;
    }
    if (removeNoiseWords && TOKEN_NOISE_WORDS.has(token)) {
      continue;
    }
    if (!/[A-Z]/.test(token)) {
      continue;
    }

    tokens.push(token);
  }

  return tokens;
}

function toTitleCase(text = "") {
  return text
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

function cleanupSegment(segment = "") {
  const tokens = getCleanTokens(segment, true);
  if (tokens.length === 0) return null;

  return toTitleCase(tokens.join(" "));
}

function cleanupSegmentGeneric(segment = "") {
  const tokens = getCleanTokens(segment, false);
  if (tokens.length === 0) return null;

  return toTitleCase(tokens.join(" "));
}

function chooseSegmentByMode(mode, segments) {
  const cleanedSegments = [];
  for (const segment of segments) {
    const cleaned = cleanupSegment(segment);
    if (cleaned) {
      cleanedSegments.push(cleaned);
    }
  }

  if (cleanedSegments.length === 0) return null;

  if (mode === "UPI") {
    return cleanedSegments[0] || null;
  }

  if (mode === "NEFT" || mode === "ACH" || mode === "NIP") {
    let longest = null;
    for (const candidate of cleanedSegments) {
      if (!longest || candidate.length > longest.length) {
        longest = candidate;
      }
    }
    return longest;
  }

  if (mode === "FD") {
    let core = null;
    for (const candidate of cleanedSegments) {
      if (!core || candidate.length > core.length) {
        core = candidate;
      }
    }
    if (!core) return null;
    return /^FD\b/i.test(core) ? core : `FD ${core}`;
  }

  const genericSegments = [];
  for (const segment of segments) {
    const cleaned = cleanupSegmentGeneric(segment);
    if (cleaned) {
      genericSegments.push(cleaned);
    }
  }

  const genericMerged = genericSegments.join(" ").replace(/\s+/g, " ").trim();

  return genericMerged || null;
}

function extractEntity(description = "") {
  const normalized = normalizeSeparators(description);
  if (!normalized) return null;

  const mode = detectMode(normalized);
  const segments = [];
  const parts = normalized.split("|");
  for (const part of parts) {
    const segment = part.trim();
    if (!segment) {
      continue;
    }
    segments.push(segment);
  }

  if (segments.length === 0) return null;

  return chooseSegmentByMode(mode, segments);
}

module.exports = {
  extractEntity,
};
