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
  return `سألتِ عن ${factTopicPhrase(fact)}، و${fact.feedbackNote}`;
}

/**
 * @param {{ patientAnswer: string, feedbackNote: string }} fact
 */
function factMissedSentence(fact) {
  return `فاتك السؤال عن ${factTopicPhrase(fact)}، و${fact.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} investigation
 */
function investigationOrderedSentence(investigation) {
  return `طلبتِ ${investigation.label}، و${investigation.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} investigation
 */
function investigationMissedSentence(investigation) {
  return `فاتك طلب ${investigation.label}، و${investigation.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} exam
 */
function examPerformedSentence(exam) {
  return `أجريتِ ${exam.label}، و${exam.feedbackNote}`;
}

/**
 * @param {{ label: string, feedbackNote: string }} exam
 */
function examMissedSentence(exam) {
  return `فاتك إجراء ${exam.label}، و${exam.feedbackNote}`;
}

/**
 * @param {SessionState | null} sessionState
 * @param {object} caseData
 */
export function computeScore(sessionState, caseData) {
  if (!sessionState) {
    return emptyScore();
  }

  const askedSet = new Set(sessionState.askedFacts);
  const orderedList = sessionState.orderedInvestigations;
  const performedSet = new Set(sessionState.performedExams || []);

  const criticalFacts = caseData.facts.filter((f) => f.critical);
  const nonCriticalFacts = caseData.facts.filter((f) => !f.critical);

  const physicalExamEntries = caseData.physicalExam ? Object.entries(caseData.physicalExam) : [];
  const relevantExams = physicalExamEntries.filter(([_, exam]) => exam.relevant);
  const nonRelevantExams = physicalExamEntries.filter(([_, exam]) => !exam.relevant);

  const totalImportant = criticalFacts.length + relevantExams.length;
  const importantAsked =
    criticalFacts.filter((f) => askedSet.has(f.id)).length +
    relevantExams.filter(([key]) => performedSet.has(key)).length;

  const totalNonImportant = nonCriticalFacts.length + nonRelevantExams.length;
  const nonImportantAsked =
    nonCriticalFacts.filter((f) => askedSet.has(f.id)).length +
    nonRelevantExams.filter(([key]) => performedSet.has(key)).length;

  let historyRaw;
  if (totalNonImportant === 0) {
    historyRaw = totalImportant > 0 ? (importantAsked / totalImportant) * 100 : 0;
  } else if (totalImportant === 0) {
    historyRaw = (nonImportantAsked / totalNonImportant) * 100;
  } else {
    historyRaw =
      ((importantAsked / totalImportant) * 0.7 + (nonImportantAsked / totalNonImportant) * 0.3) * 100;
  }
  const historyTaking = roundScore(historyRaw);

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
      ? (relevantOrdered / totalRelevant) * 100 - irrelevantOrdered * 10
      : 0;
  const investigationSelection = roundScore(Math.max(0, investigationRaw));

  const finalDiagnosis = sessionState.finalDiagnosis;
  const diagnosisCorrect = finalDiagnosis === caseData.correctDiagnosis;
  const diagnosis = diagnosisCorrect ? 100 : 0;

  const criticalMissedItems = criticalFacts
    .filter((f) => !askedSet.has(f.id))
    .map((f) => ({
      id: f.id,
      label: factMissedSentence(f),
    }));

  const weighted =
    historyTaking * 0.35 + investigationSelection * 0.2 + diagnosis * 0.35;
  const overall = roundScore(Math.max(0, weighted - criticalMissedItems.length * 5));

  return {
    historyTaking,
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
    investigationSelection: 0,
    diagnosis: 0,
    criticalMisses: { count: 0, items: [] },
    overall: 0,
  };
}

/**
 * @param {SessionState | null} sessionState
 * @param {object} caseData
 * @returns {{ strengths: string[], gaps: string[] }}
 */
export function generateFeedback(sessionState, caseData) {
  if (!sessionState) {
    return { strengths: [], gaps: [] };
  }

  const askedSet = new Set(sessionState.askedFacts);
  const orderedList = sessionState.orderedInvestigations;
  const orderedSet = new Set(orderedList);
  const performedSet = new Set(sessionState.performedExams || []);
  const finalDiagnosis = sessionState.finalDiagnosis;
  const diagnosisCorrect = finalDiagnosis === caseData.correctDiagnosis;
  const investigationById = new Map(caseData.investigations.map((i) => [i.id, i]));
  const relevantInvestigations = caseData.investigations.filter((i) => i.relevant);

  const strengths = [];

  for (const fact of caseData.facts) {
    if (fact.critical && askedSet.has(fact.id)) {
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
    strengths.push(`وصلتِ للتشخيص الصحيح: ${caseData.correctDiagnosis}`);
  }

  const gaps = [];

  for (const fact of caseData.facts) {
    if (fact.critical && !askedSet.has(fact.id)) {
      gaps.push(factMissedSentence(fact));
    }
  }

  if (caseData.physicalExam) {
    for (const [key, exam] of Object.entries(caseData.physicalExam)) {
      if (exam.relevant && !performedSet.has(key)) {
        gaps.push(examMissedSentence(exam));
      }
    }
  }

  for (const inv of relevantInvestigations) {
    if (!orderedSet.has(inv.id)) {
      gaps.push(investigationMissedSentence(inv));
    }
  }

  if (!diagnosisCorrect && finalDiagnosis) {
    if (caseData.differentials.includes(finalDiagnosis)) {
      gaps.push(
        `التشخيص اللي اخترتيه (${finalDiagnosis}) تشخيص بديل معقول — راجعي التاريخ والفحوصات لتمييز ${caseData.correctDiagnosis}`,
      );
    } else {
      const differentialHint = caseData.differentials.slice(0, 2).join('، ');
      gaps.push(
        `التشخيص الصحيح كان ${caseData.correctDiagnosis} — كان مفيد تفكري في بدائل زي ${differentialHint}`,
      );
    }
  }

  return { strengths, gaps };
}

/**
 * @param {number} overall
 */
export function getPerformanceLabel(overall) {
  if (overall >= 80) return 'أداء جيد جدًا';
  if (overall >= 50) return 'أداء متوسط';
  return 'محتاج مراجعة';
}
