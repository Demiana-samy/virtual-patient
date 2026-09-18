/** @typedef {import('./sessionState.js').Session} SessionState */

function roundScore(value) {
  return Math.round(value);
}

/**
 * @param {{ patientAnswer: string }} fact
 */
function factTopicPhrase(fact) {
  return fact.patientAnswer.split('،')[0].trim();
}

/**
 * @param {{ patientAnswer: string, feedbackNote: string }} fact
 */
function factAskedSentence(fact) {
  return `سألتِ عن ${factTopicPhrase(fact)}: ${fact.feedbackNote}`;
}

/**
 * @param {{ patientAnswer: string, feedbackNote: string }} fact
 */
function factMissedSentence(fact) {
  return `فاتك السؤال عن ${factTopicPhrase(fact)}: ${fact.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} investigation
 */
function investigationOrderedSentence(investigation) {
  return `طلبتِ ${investigation.label}: ${investigation.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} investigation
 */
function investigationMissedSentence(investigation) {
  return `فاتك طلب ${investigation.label}: ${investigation.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} exam
 */
function examPerformedSentence(exam) {
  return `أجريتِ ${exam.label}: ${exam.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} exam
 */
function examMissedSentence(exam) {
  return `فاتك إجراء ${exam.label}: ${exam.feedbackNote}`;
}

/**
 * @param {SessionState | null} sessionState
 * @param {object} caseData
 */
export function computeScore(sessionState, caseData) {
  if (!sessionState || !caseData) {
    return emptyScore();
  }

  const askedSet = new Set(sessionState.askedFacts || []);
  const orderedList = sessionState.orderedInvestigations || [];
  const performedSet = new Set(sessionState.performedExams || []);

  // 1. History Taking Subscore (0 - 100)
  const criticalFacts = caseData.facts.filter((f) => f.critical);
  const nonCriticalFacts = caseData.facts.filter((f) => !f.critical);

  const criticalAsked = criticalFacts.filter((f) => askedSet.has(f.id)).length;
  const nonCriticalAsked = nonCriticalFacts.filter((f) => askedSet.has(f.id)).length;

  const criticalScore = criticalFacts.length > 0 ? (criticalAsked / criticalFacts.length) * 100 : 100;
  const nonCriticalScore =
    nonCriticalFacts.length > 0 ? (nonCriticalAsked / nonCriticalFacts.length) * 100 : 100;

  const historyTaking = roundScore(criticalScore * 0.85 + nonCriticalScore * 0.15);

  // 2. Clinical Examination Subscore (0 - 100)
  const physicalExamEntries = caseData.physicalExam ? Object.entries(caseData.physicalExam) : [];
  const relevantExams = physicalExamEntries.filter(([_, exam]) => exam.relevant);

  const relevantExamsPerformed = relevantExams.filter(([key]) => performedSet.has(key)).length;

  const examRaw =
    relevantExams.length > 0 ? (relevantExamsPerformed / relevantExams.length) * 100 : 100;
  const clinicalExamination = roundScore(examRaw);

  // 3. Investigation Selection Subscore (0 - 100)
  const relevantInvestigations = caseData.investigations.filter((i) => i.relevant);
  const totalRelevant = relevantInvestigations.length;
  const investigationById = new Map(caseData.investigations.map((i) => [i.id, i]));

  const relevantOrdered = orderedList.filter((id) => investigationById.get(id)?.relevant).length;
  const irrelevantOrdered = orderedList.filter((id) => {
    const inv = investigationById.get(id);
    return inv && !inv.relevant;
  }).length;

  const investigationRaw =
    totalRelevant > 0
      ? (relevantOrdered / totalRelevant) * 100 - irrelevantOrdered * 5
      : 100;
  const investigationSelection = roundScore(Math.max(0, Math.min(100, investigationRaw)));

  // 4. Diagnosis Subscore (0 - 100)
  const finalDiagnosis = sessionState.finalDiagnosis;
  const diagnosisCorrect = finalDiagnosis === caseData.correctDiagnosis;
  const isDifferential = caseData.differentials?.includes(finalDiagnosis);

  let diagnosis = 0;
  if (diagnosisCorrect) {
    diagnosis = 100;
  } else if (isDifferential) {
    diagnosis = 50;
  }

  // Critical Missed Items (ONLY genuinely critical facts omitted)
  const criticalMissedItems = criticalFacts
    .filter((f) => !askedSet.has(f.id))
    .map((f) => ({
      id: f.id,
      label: factMissedSentence(f),
    }));

  // Overall Score Calculation (weighted process)
  // History: 35%, Exam: 15%, Investigations: 25%, Diagnosis: 25%
  const weighted =
    historyTaking * 0.35 +
    clinicalExamination * 0.15 +
    investigationSelection * 0.25 +
    diagnosis * 0.25;

  // Proportional 2-point penalty per missed critical fact
  const overallPenalty = criticalMissedItems.length * 2;
  const overall = roundScore(Math.max(0, Math.min(100, weighted - overallPenalty)));

  return {
    historyTaking,
    clinicalExamination,
    investigationSelection,
    diagnosis,
    criticalMisses: {
      count: criticalMissedItems.length,
      items: criticalMissedItems,
    },
    overall,
  };
}

function emptyScore() {
  return {
    historyTaking: 0,
    clinicalExamination: 0,
    investigationSelection: 0,
    diagnosis: 0,
    criticalMisses: { count: 0, items: [] },
    overall: 0,
  };
}

/**
 * @param {SessionState | null} sessionState
 * @param {object} caseData
 * @returns {{ strengths: string[], gaps: string[], criticalErrors: string[], medicalRationale: string[] }}
 */
export function generateFeedback(sessionState, caseData) {
  if (!sessionState || !caseData) {
    return { strengths: [], gaps: [], criticalErrors: [], medicalRationale: [] };
  }

  const askedSet = new Set(sessionState.askedFacts || []);
  const orderedList = sessionState.orderedInvestigations || [];
  const orderedSet = new Set(orderedList);
  const performedSet = new Set(sessionState.performedExams || []);
  const finalDiagnosis = sessionState.finalDiagnosis;
  const diagnosisCorrect = finalDiagnosis === caseData.correctDiagnosis;
  const investigationById = new Map(caseData.investigations.map((i) => [i.id, i]));
  const relevantInvestigations = caseData.investigations.filter((i) => i.relevant);

  const strengths = [];

  for (const fact of caseData.facts) {
    if (askedSet.has(fact.id)) {
      strengths.push(factAskedSentence(fact));
    }
  }

  if (caseData.physicalExam) {
    for (const [key, exam] of Object.entries(caseData.physicalExam)) {
      if (exam.relevant && performedSet.has(key)) {
        strengths.push(examPerformedSentence(exam));
      }
    }
  }

  for (const id of orderedList) {
    const investigation = investigationById.get(id);
    if (investigation?.relevant) {
      strengths.push(investigationOrderedSentence(investigation));
    }
  }

  if (diagnosisCorrect) {
    strengths.push(`التشخيص الصحيح: وصلتِ للتشخيص الدقيق وهو "${caseData.correctDiagnosis}"`);
  }

  // Gaps: Missed non-critical facts and non-critical performed exams
  const gaps = [];

  for (const fact of caseData.facts) {
    if (!fact.critical && !askedSet.has(fact.id)) {
      gaps.push(factMissedSentence(fact));
    }
  }

  if (caseData.physicalExam) {
    for (const [key, exam] of Object.entries(caseData.physicalExam)) {
      if (!exam.relevant && performedSet.has(key)) {
        gaps.push(`إجراء فحص سياقي/غير أساسي (${exam.label}) — لم يكن ضرورياً لتأكيد التشخيص الرئيسي.`);
      }
    }
  }

  // Critical Errors: ONLY genuinely critical missed facts, missed relevant core exams/tests, or wrong diagnosis
  const criticalErrors = [];

  for (const fact of caseData.facts) {
    if (fact.critical && !askedSet.has(fact.id)) {
      criticalErrors.push(factMissedSentence(fact));
    }
  }

  if (caseData.physicalExam) {
    for (const [key, exam] of Object.entries(caseData.physicalExam)) {
      if (exam.relevant && !performedSet.has(key)) {
        criticalErrors.push(examMissedSentence(exam));
      }
    }
  }

  for (const inv of relevantInvestigations) {
    if (!orderedSet.has(inv.id)) {
      criticalErrors.push(investigationMissedSentence(inv));
    }
  }

  if (!diagnosisCorrect) {
    if (finalDiagnosis && caseData.differentials?.includes(finalDiagnosis)) {
      criticalErrors.push(
        `التشخيص المختار (${finalDiagnosis}) تشخيص تفريقي معقول — ولكن التشخيص الأحدث والأقوى بالمعطيات هو "${caseData.correctDiagnosis}"`,
      );
    } else if (finalDiagnosis) {
      criticalErrors.push(
        `التشخيص المختار (${finalDiagnosis}) غير صحيح — التشخيص الدقيق للحالة هو "${caseData.correctDiagnosis}"`,
      );
    } else {
      criticalErrors.push(`لم يتم تحديد التشخيص النهائي.`);
    }
  }

  // Dynamic Case-Specific Medical Rationale
  const medicalRationale = Array.isArray(caseData.medicalRationale) ? caseData.medicalRationale : [];

  return { strengths, gaps, criticalErrors, medicalRationale };
}

/**
 * @param {number} overall
 */
export function getPerformanceLabel(overall) {
  if (overall >= 85) return 'أداء ممتاز (Outstanding)';
  if (overall >= 70) return 'أداء جيد جداً (Very Good)';
  if (overall >= 50) return 'أداء متوسط (Satisfactory)';
  return 'يحتاج إلى مراجعة وتطوير (Needs Review)';
}


