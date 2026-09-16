import { renderMessage } from './chat.js';
import { markInvestigationOrdered, markExamPerformed, setFinalDiagnosis, getSessionState } from './sessionState.js';

const examList = document.getElementById('exam-list');
const investigationList = document.getElementById('investigation-list');
const diagnosisSelect = document.getElementById('diagnosis-select');
const confirmButton = document.getElementById('btn-confirm');

let panelInitialized = false;
/** @type {(() => void) | null} */
let onCaseCompleteCallback = null;

/**
 * @param {string} examKey
 * @param {{ label: string, result: string }} exam
 * @param {HTMLButtonElement} btn
 */
function handleExam(examKey, exam, btn) {
  markExamPerformed(examKey);
  btn.disabled = true;
  renderMessage('system', `نتيجة: ${exam.label} — ${exam.result}`);
}

/**
 * @param {{ id: string, label: string, result: string }} investigation
 * @param {HTMLButtonElement} btn
 */
function handleInvestigation(investigation, btn) {
  markInvestigationOrdered(investigation.id);
  btn.disabled = true;
  renderMessage('system', `نتيجة: ${investigation.label} — ${investigation.result}`);
}

/**
 * @param {() => void} onCaseComplete
 */
function handleDiagnosisConfirm(onCaseComplete) {
  if (!diagnosisSelect.value) return;

  setFinalDiagnosis(diagnosisSelect.value);
  onCaseComplete();
}

/**
 * @param {object} caseData
 */
export function loadPanel(caseData) {
  const state = getSessionState();
  const performedSet = new Set(state?.performedExams ?? []);
  const orderedSet = new Set(state?.orderedInvestigations ?? []);

  if (examList) {
    examList.innerHTML = '';
    if (caseData.physicalExam) {
      Object.entries(caseData.physicalExam).forEach(([examKey, exam]) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-investigation';
        btn.textContent = exam.label;
        if (performedSet.has(examKey)) {
          btn.disabled = true;
        }
        btn.addEventListener('click', () => handleExam(examKey, exam, btn));
        li.appendChild(btn);
        examList.appendChild(li);
      });
    }
  }

  investigationList.innerHTML = '';
  diagnosisSelect.innerHTML = '';

  caseData.investigations.forEach((investigation) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-investigation';
    btn.textContent = investigation.label;
    if (orderedSet.has(investigation.id)) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => handleInvestigation(investigation, btn));
    li.appendChild(btn);
    investigationList.appendChild(li);
  });

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'اختر التشخيص...';
  diagnosisSelect.appendChild(placeholder);

  caseData.diagnosisOptions.forEach((diagnosis) => {
    const option = document.createElement('option');
    option.value = diagnosis;
    option.textContent = diagnosis;
    diagnosisSelect.appendChild(option);
  });

  confirmButton.disabled = true;
}

/**
 * @param {object} caseData
 * @param {() => void} onCaseComplete
 */
export function initPanel(caseData, onCaseComplete) {
  onCaseCompleteCallback = onCaseComplete;
  loadPanel(caseData);

  if (panelInitialized) return;
  panelInitialized = true;

  confirmButton.addEventListener('click', () => handleDiagnosisConfirm(onCaseCompleteCallback));

  diagnosisSelect.addEventListener('change', () => {
    confirmButton.disabled = !diagnosisSelect.value;
  });
}

export function resetPanel() {
  diagnosisSelect.value = '';
  confirmButton.disabled = true;
}

