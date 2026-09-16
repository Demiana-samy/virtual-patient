import { cases } from './data/cases/index.js';
import { initSession, getSessionState, getSessionStartedAt } from './sessionState.js';
import { renderInitialMessages, initChat, resetChat, setActiveCase } from './chat.js';
import { initPanel, loadPanel, resetPanel } from './panel.js';
import { computeScore, generateFeedback } from './scoring.js';
import { renderResults, toggleResultsView } from './results.js';
import { renderCaseSelector, toggleCaseSelectorView } from './caseSelector.js';

const SESSION_START_MESSAGE = {
  role: 'system',
  text: 'بدأت الجلسة — يمكنك البدء بسؤال المريض عن أعراضه.',
};

/** @type {string | null} */
let currentCaseId = null;
/** @type {object | null} */
let currentCaseData = null;

function toArabicNumerals(n) {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function getPatientInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}.${parts[1][0]}`;
  }
  return name[0] ?? '';
}

function updateFactsProgress() {
  const state = getSessionState();
  const el = document.getElementById('facts-progress');
  if (!state || !el || !currentCaseData) return;

  const covered = state.askedFacts.length;
  const total = currentCaseData.facts.length;
  el.textContent = `${toArabicNumerals(covered)} من ${toArabicNumerals(total)}`;
}

function startSessionTimer() {
  const el = document.getElementById('session-time');
  if (!el) return;

  const tick = () => {
    const elapsed = Date.now() - getSessionStartedAt();
    el.textContent = formatElapsed(elapsed);
  };

  tick();
  setInterval(tick, 1000);
}

function initPatientHeader() {
  if (!currentCaseData) return;

  const { name, age, chiefComplaint } = currentCaseData.patient;

  document.getElementById('patient-initials').textContent = getPatientInitials(name);
  document.getElementById('patient-name').textContent = name;
  document.getElementById('patient-meta').textContent =
    `${age} سنة — ${chiefComplaint}`;
}

const appContainer = document.getElementById('app');
const resultsContainer = document.getElementById('results-view');
const caseSelectorContainer = document.getElementById('case-selector');

function showCaseSelector() {
  toggleResultsView(resultsContainer, appContainer, false);
  toggleCaseSelectorView(caseSelectorContainer, appContainer, true);
  renderCaseSelector(caseSelectorContainer, startCase);
}

function startCase(caseId) {
  currentCaseId = caseId;
  currentCaseData = cases[caseId];

  initSession(caseId);
  setActiveCase(caseId, currentCaseData, updateFactsProgress);
  loadPanel(currentCaseData);
  initPatientHeader();
  resetChat([SESSION_START_MESSAGE]);
  resetPanel();
  updateFactsProgress();

  toggleCaseSelectorView(caseSelectorContainer, appContainer, false);
  toggleResultsView(resultsContainer, appContainer, false);
  document.getElementById('chat-input')?.focus();
}

function returnToCaseSelector() {
  currentCaseId = null;
  currentCaseData = null;
  showCaseSelector();
}

export function onCaseComplete() {
  const state = getSessionState();
  const scoreResult = computeScore(state, currentCaseData);
  const feedback = generateFeedback(state, currentCaseData);

  renderResults(resultsContainer, scoreResult, feedback, currentCaseData, returnToCaseSelector);
  toggleResultsView(resultsContainer, appContainer, true);
}

document.addEventListener('DOMContentLoaded', () => {
  startSessionTimer();
  initChat('', null, updateFactsProgress);
  initPanel(cases.appendicitis, onCaseComplete);
  showCaseSelector();
});
