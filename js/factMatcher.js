const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;
const ALEF_VARIANTS = /[أإآٱ]/g;

/**
 * Normalizes text for deterministic Arabic keyword matching.
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  if (!text) return '';
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
 * Checks if a specific keyword matches the normalized student message.
 * Applies stem matching & negative-context checks to avoid false positives.
 * @param {string} normalizedMsg
 * @param {string} rawKeyword
 * @param {string} factId
 * @returns {boolean}
 */
function keywordMatchesMessage(normalizedMsg, rawKeyword, factId) {
  const normKw = normalizeText(rawKeyword);
  if (!normKw) return false;

  // Direct phrase inclusion check
  if (normalizedMsg.includes(normKw)) {
    // Guard against false positives for GI bleeding
    if (factId === 'no_gi_bleeding' && normKw === 'دم') {
      const hasGiContext = ['براز', 'اسود', 'هضم', 'معده', 'ترجيع', 'قيء'].some((w) =>
        normalizedMsg.includes(w),
      );
      if (!hasGiContext) return false;
    }
    // Guard against false positives for menorrhagia
    if (factId === 'menorrhagia' && (normKw === 'دم' || normKw === 'نزيف')) {
      const hasMensesContext = ['دوره', 'حيض', 'طمث', 'فوطه', 'شهريه', 'رحم'].some((w) =>
        normalizedMsg.includes(w),
      );
      if (!hasMensesContext) return false;
    }
    return true;
  }

  // Stem / root variations for Arabic dialectal forms
  // Dizziness (دوخة / دوار / تدوخ / بتبدوخي / بدوخ)
  if (factId === 'dizziness') {
    if (
      normalizedMsg.includes('دوخ') ||
      normalizedMsg.includes('دوار') ||
      normalizedMsg.includes('دايخ') ||
      normalizedMsg.includes('دايخه')
    ) {
      return true;
    }
  }

  // Fatigue (تعب / تعبانه / خمول / مجهود)
  if (factId === 'fatigue') {
    if (
      normalizedMsg.includes('تعب') ||
      normalizedMsg.includes('مجهود') ||
      normalizedMsg.includes('خمول') ||
      normalizedMsg.includes('ارهاق') ||
      normalizedMsg.includes('ضعف')
    ) {
      return true;
    }
  }

  // Dyspnea (ضيق نفس / نهجان / اتنفس / تنفس)
  if (factId === 'dyspnea_exertion') {
    if (
      normalizedMsg.includes('نفس') ||
      normalizedMsg.includes('تنفس') ||
      normalizedMsg.includes('نهج') ||
      normalizedMsg.includes('كتمنه')
    ) {
      return true;
    }
  }

  // Pica (ثلج / تلج / كريفينج / شهيه غريبه)
  if (factId === 'pica') {
    if (
      normalizedMsg.includes('ثلج') ||
      normalizedMsg.includes('تلج') ||
      normalizedMsg.includes('طين') ||
      normalizedMsg.includes('تراب')
    ) {
      return true;
    }
  }

  // Menorrhagia (دورة / حيض / فوطة / نزيف)
  if (factId === 'menorrhagia') {
    if (
      normalizedMsg.includes('دوره') ||
      normalizedMsg.includes('حيض') ||
      normalizedMsg.includes('طمث') ||
      normalizedMsg.includes('فوطه') ||
      normalizedMsg.includes('فوط') ||
      normalizedMsg.includes('شهريه')
    ) {
      return true;
    }
  }

  // Onset / duration (امتى / من امتى / كم شهر / مدة / بداية)
  if (factId === 'onset_duration' || factId === 'onset') {
    if (
      normalizedMsg.includes('امتى') ||
      normalizedMsg.includes('متى') ||
      normalizedMsg.includes('منذ') ||
      normalizedMsg.includes('كام شهر') ||
      normalizedMsg.includes('كم شهر') ||
      normalizedMsg.includes('مده') ||
      normalizedMsg.includes('زمان') ||
      normalizedMsg.includes('بقالك') ||
      normalizedMsg.includes('بقالها')
    ) {
      return true;
    }
  }

  // Pallor (شاحب / شحوب / مصفرة / صفراء / لون الوجه)
  if (factId === 'pallor') {
    if (
      normalizedMsg.includes('شحب') ||
      normalizedMsg.includes('شاحب') ||
      normalizedMsg.includes('صفار') ||
      normalizedMsg.includes('اصفر') ||
      normalizedMsg.includes('بياض الوجه') ||
      normalizedMsg.includes('لون الوجه') ||
      normalizedMsg.includes('لون الجلد')
    ) {
      return true;
    }
  }

  // Diet (نباتي / نظام غذائي / تغذية / أكل لحوم / مدخول الحديد)
  if (factId === 'diet') {
    // Avoid triggering diet on "أكل التلج" (which is pica)
    if (normalizedMsg.includes('تلج') || normalizedMsg.includes('ثلج')) {
      return false;
    }
    if (
      normalizedMsg.includes('نباتي') ||
      normalizedMsg.includes('نباتيه') ||
      normalizedMsg.includes('لحم') ||
      normalizedMsg.includes('تغذيه') ||
      normalizedMsg.includes('طعام') ||
      normalizedMsg.includes('نظام غذائي') ||
      normalizedMsg.includes('وجبات')
    ) {
      return true;
    }
  }


  return false;
}

/**
 * Returns fact ids whose keywords appear in the student message.
 * Pure function — no DOM or session access.
 * @param {string} message
 * @param {{ facts: { id: string, keywords: string[] }[] }} caseData
 * @returns {string[]}
 */
export function matchFactsInMessage(message, caseData) {
  if (!message || !caseData || !caseData.facts) return [];

  const normalizedMessage = normalizeText(message);
  const matched = [];

  for (const fact of caseData.facts) {
    const hit = fact.keywords.some((keyword) =>
      keywordMatchesMessage(normalizedMessage, keyword, fact.id),
    );
    if (hit) {
      matched.push(fact.id);
    }
  }

  return matched;
}

