const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;
const ALEF_VARIANTS = /[أإآٱ]/g;

/**
 * Normalizes text for deterministic Arabic keyword matching.
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(TATWEEL, '')
    .replace(DIACRITICS, '')
    .replace(ALEF_VARIANTS, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

/**
 * Returns fact ids whose keywords appear in the student message.
 * Pure function — no DOM or session access.
 * @param {string} message
 * @param {{ facts: { id: string, keywords: string[] }[] }} caseData
 * @returns {string[]}
 */
export function matchFactsInMessage(message, caseData) {
  const normalizedMessage = normalizeText(message);
  const matched = [];

  for (const fact of caseData.facts) {
    const hit = fact.keywords.some((keyword) =>
      normalizedMessage.includes(normalizeText(keyword)),
    );
    if (hit) {
      matched.push(fact.id);
    }
  }

  return matched;
}
