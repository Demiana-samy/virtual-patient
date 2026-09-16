import { getPerformanceLabel } from './scoring.js';

function toArabicNumerals(n) {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

/**
 * @param {HTMLElement} container
 * @param {ReturnType<import('./scoring.js').computeScore>} scoreResult
 * @param {{ strengths: string[], gaps: string[] }} feedback
 * @param {object} caseData
 * @param {() => void} onRetry
 */
export function renderResults(container, scoreResult, feedback, caseData, onRetry) {
  const label = getPerformanceLabel(scoreResult.overall);

  container.innerHTML = '';
  container.className = 'results-view';

  const subScores = [
    { key: 'historyTaking', label: 'أخذ التاريخ', value: scoreResult.historyTaking },
    { key: 'investigationSelection', label: 'اختيار الفحوصات', value: scoreResult.investigationSelection },
    { key: 'diagnosis', label: 'التشخيص', value: scoreResult.diagnosis },
  ];

  container.innerHTML = `
    <div class="results-card">
      <header class="results-header">
        <p class="results-case-name">${caseData.displayName}</p>
        <div class="results-overall">
          <span class="results-overall__score">${toArabicNumerals(scoreResult.overall)}</span>
          <span class="results-overall__divider">/</span>
          <span class="results-overall__max">${toArabicNumerals(100)}</span>
        </div>
        <p class="results-label">${label}</p>
      </header>

      <div class="results-subscores">
        ${subScores
          .map(
            (s) => `
          <div class="subscore-card">
            <div class="subscore-card__header">
              <span class="subscore-card__label">${s.label}</span>
              <span class="subscore-card__value">${toArabicNumerals(s.value)}</span>
            </div>
            <div class="subscore-bar" role="presentation">
              <div class="subscore-bar__fill" style="width: ${s.value}%"></div>
            </div>
          </div>`,
          )
          .join('')}
        <div class="subscore-card subscore-card--misses">
          <div class="subscore-card__header">
            <span class="subscore-card__label">أخطاء حرجة</span>
            <span class="subscore-card__value">${toArabicNumerals(scoreResult.criticalMisses.count)}</span>
          </div>
          <p class="subscore-card__hint">نقاط مهمة في التاريخ ما اتسألتش عنها</p>
        </div>
      </div>

      <div class="results-feedback">
        <section class="feedback-column">
          <h2 class="feedback-column__title">✓ إيه اللي عملته صح</h2>
          <ul class="feedback-list">
            ${
              feedback.strengths.length > 0
                ? feedback.strengths.map((item) => `<li>${item}</li>`).join('')
                : '<li class="feedback-list__empty">لم تُسجَّل نقاط قوة في هذه الجلسة</li>'
            }
          </ul>
        </section>
        <section class="feedback-column">
          <h2 class="feedback-column__title">إيه اللي فاتك</h2>
          <ul class="feedback-list">
            ${
              feedback.gaps.length > 0
                ? feedback.gaps.map((item) => `<li>${item}</li>`).join('')
                : '<li class="feedback-list__empty">ممتاز — مفيش نقاط فاتتك!</li>'
            }
          </ul>
        </section>
      </div>

      <footer class="results-footer">
        <button type="button" class="btn-retry" id="btn-retry">حاولي تاني</button>
      </footer>
    </div>
  `;

  container.querySelector('#btn-retry')?.addEventListener('click', onRetry);
}

/**
 * @param {HTMLElement} resultsContainer
 * @param {HTMLElement} appContainer
 * @param {boolean} showResults
 */
export function toggleResultsView(resultsContainer, appContainer, showResults) {
  resultsContainer.hidden = !showResults;
  appContainer.hidden = showResults;
}
