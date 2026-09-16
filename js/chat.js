import { markFactAsked } from './sessionState.js';
import { matchFactsInMessage } from './factMatcher.js';

const messageList = document.getElementById('message-list');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('btn-send');

const API_URL = 'http://localhost:3000/api/chat';

/** @type {{ role: 'user' | 'assistant', content: string }[]} */
let conversationHistory = [];
let isSending = false;
/** @type {string} */
let caseId = '';
/** @type {object | null} */
let caseData = null;
/** @type {(() => void) | null} */
let onFactsUpdated = null;

function scrollToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}

function createMessageElement(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message message--${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;

  wrapper.appendChild(bubble);
  return wrapper;
}

export function renderMessage(role, text) {
  const el = createMessageElement(role, text);
  messageList.appendChild(el);
  scrollToBottom();
  return el;
}

export function renderInitialMessages(messages) {
  messages.forEach(({ role, text }) => renderMessage(role, text));
}

function setInputEnabled(enabled) {
  chatInput.disabled = !enabled;
  sendButton.disabled = !enabled;
}

function trackFactsInMessage(message) {
  if (!caseData) return [];

  const newlyMatched = [];
  for (const factId of matchFactsInMessage(message, caseData)) {
    if (markFactAsked(factId)) {
      newlyMatched.push(factId);
    }
  }

  if (newlyMatched.length > 0) {
    onFactsUpdated?.();
  }

  return newlyMatched;
}

async function handleSend() {
  const text = chatInput.value.trim();
  if (!text || isSending) return;

  trackFactsInMessage(text);

  renderMessage('student', text);
  chatInput.value = '';

  isSending = true;
  setInputEnabled(false);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId,
        conversationHistory,
        studentMessage: text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    conversationHistory.push({ role: 'user', content: text });
    conversationHistory.push({ role: 'assistant', content: data.reply });

    renderMessage('patient', data.reply);
  } catch {
    renderMessage('system', 'حدث خطأ في الاتصال. تأكد أن خادم الـ API يعمل على المنفذ 3000.');
  } finally {
    isSending = false;
    setInputEnabled(true);
    chatInput.focus();
  }
}

let chatInitialized = false;

/**
 * @param {string} id
 * @param {object} data
 * @param {(() => void) | undefined} factsUpdatedCallback
 */
export function initChat(id, data, factsUpdatedCallback) {
  setActiveCase(id, data, factsUpdatedCallback);

  if (chatInitialized) return;
  chatInitialized = true;

  sendButton.addEventListener('click', handleSend);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

/**
 * @param {string} id
 * @param {object} data
 * @param {(() => void) | undefined} factsUpdatedCallback
 */
export function setActiveCase(id, data, factsUpdatedCallback) {
  caseId = id;
  caseData = data;
  onFactsUpdated = factsUpdatedCallback ?? null;
}

/**
 * @param {{ role: string, text: string }[]} initialMessages
 */
export function resetChat(initialMessages) {
  conversationHistory = [];
  isSending = false;
  messageList.innerHTML = '';
  chatInput.value = '';
  setInputEnabled(true);
  renderInitialMessages(initialMessages);
}
