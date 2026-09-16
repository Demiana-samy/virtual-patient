/** @type {Session | null} */
let session = null;

/**
 * @typedef {object} Session
 * @property {string} caseId
 * @property {Set<string>} askedFacts
 * @property {Set<string>} orderedInvestigations
 * @property {Set<string>} performedExams
 * @property {string | null} finalDiagnosis
 * @property {number} startedAt
 */

export function initSession(caseId) {
  session = {
    caseId,
    askedFacts: new Set(),
    orderedInvestigations: new Set(),
    performedExams: new Set(),
    finalDiagnosis: null,
    startedAt: Date.now(),
  };
}

export function markFactAsked(factId) {
  if (!session || session.askedFacts.has(factId)) {
    return false;
  }
  session.askedFacts.add(factId);
  return true;
}

export function markInvestigationOrdered(investigationId) {
  if (!session) return false;
  const isNew = !session.orderedInvestigations.has(investigationId);
  session.orderedInvestigations.add(investigationId);
  return isNew;
}

export function markExamPerformed(examKey) {
  if (!session) return false;
  const isNew = !session.performedExams.has(examKey);
  session.performedExams.add(examKey);
  return isNew;
}

export function setFinalDiagnosis(value) {
  if (!session) return;
  session.finalDiagnosis = value;
}

export function getSessionState() {
  if (!session) return null;
  return {
    caseId: session.caseId,
    askedFacts: [...session.askedFacts],
    orderedInvestigations: [...session.orderedInvestigations],
    performedExams: [...session.performedExams],
    finalDiagnosis: session.finalDiagnosis,
    startedAt: session.startedAt,
  };
}

export function getSessionStartedAt() {
  return session?.startedAt ?? Date.now();
}
