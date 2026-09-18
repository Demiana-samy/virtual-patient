import { getPerformanceLabel } from './scoring.js';

function toArabicNumerals(n) {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

/**
 * @param {HTMLElement} container
 * @param {ReturnType<import('./scoring.js').computeScore>} scoreResult
 * @param {ReturnType<import('./scoring.js').generateFeedback>} feedback
 * @param {object} caseData
 * @param {() => void} onRetry
 */
export function renderResults(container, scoreResult, feedback, caseData, onRetry) {
  const label = getPerformanceLabel(scoreResult.overall);

  container.innerHTML = '';
  container.className = 'results-view';

  const subScores = [
    { key: 'historyTaking', label: 'أخذ التاريخ المرضي', value: scoreResult.historyTaking },
    { key: 'clinicalExamination', label: 'الفحص السريري', value: scoreResult.clinicalExamination },
    { key: 'investigationSelection', label: 'اختيار الفحوصات', value: scoreResult.investigationSelection },
    { key: 'diagnosis', label: 'التشخيص النهائي', value: scoreResult.diagnosis },
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
              <span class="subscore-card__value">${toArabicNumerals(s.value)}%</span>
            </div>
            <div class="subscore-bar" role="presentation">
              <div class="subscore-bar__fill" style="width: ${s.value}%"></div>
            </div>
          </div>`,
          )
          .join('')}
      </div>

      <div class="results-feedback-sections">
        ${
          feedback.criticalErrors && feedback.criticalErrors.length > 0
            ? `
        <section class="feedback-section feedback-section--critical">
          <h2 class="feedback-section__title">⚠️ أخطاء وملاحظات حرجة</h2>
          <ul class="feedback-list">
            ${feedback.criticalErrors.map((item) => `<li class="feedback-item--critical">${item}</li>`).join('')}
          </ul>
        </section>`
            : ''
        }

        <div class="results-feedback-grid">
          <section class="feedback-column">
            <h2 class="feedback-column__title">✓ نقاط القوة والأداء الصحيح</h2>
            <ul class="feedback-list">
              ${
                feedback.strengths && feedback.strengths.length > 0
                  ? feedback.strengths.map((item) => `<li>${item}</li>`).join('')
                  : '<li class="feedback-list__empty">لم تُسجَّل نقاط قوة رئيسية في هذه الجلسة</li>'
              }
            </ul>
          </section>

          <section class="feedback-column">
            <h2 class="feedback-column__title">📌 نقاط فرعية لم تُستكمل</h2>
            <ul class="feedback-list">
              ${
                feedback.gaps && feedback.gaps.length > 0
                  ? feedback.gaps.map((item) => `<li>${item}</li>`).join('')
                  : '<li class="feedback-list__empty">ممتاز — قمت باكتشاف كافة النقاط المساندة!</li>'
              }
            </ul>
          </section>
        </div>

        ${
          feedback.medicalRationale && feedback.medicalRationale.length > 0
            ? `
        <section class="feedback-section feedback-section--rationale">
          <h2 class="feedback-section__title">💡 النصيحة والتعليل الطبي التعليمي</h2>
          <ul class="feedback-list">
            ${feedback.medicalRationale.map((item) => `<li class="feedback-item--rationale">${item}</li>`).join('')}
          </ul>
        </section>`
            : ''
        }
      </div>

      <footer class="results-footer">
        <button type="button" class="btn-retry" id="btn-retry">إعادة الجلسة / حالة جديدة</button>
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
