import { cases } from './data/cases/index.js';

/**
 * @param {HTMLElement} container
 * @param {(caseId: string) => void} onSelect
 */
export function renderCaseSelector(container, onSelect) {
  const caseList = Object.values(cases);

  container.innerHTML = '';
  container.className = 'case-selector';

  container.innerHTML = `
    <div class="case-selector__inner">
      <header class="case-selector__header">
        <h1 class="case-selector__title">المريض الافتراضي</h1>
        <p class="case-selector__subtitle">اختاري حالة للتدريب على أخذ التاريخ السريري والتشخيص</p>
      </header>
      <div class="case-selector__grid">
        ${caseList
          .map(
            (c) => `
          <article class="case-card">
            <h2 class="case-card__title">${c.displayName}</h2>
            <p class="case-card__teaser">${c.patient.chiefComplaint}</p>
            <button type="button" class="btn-start" data-case-id="${c.id}">ابدأ</button>
          </article>`,
          )
          .join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.btn-start').forEach((btn) => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-case-id');
      if (caseId) onSelect(caseId);
    });
  });
}

/**
 * @param {HTMLElement} selectorContainer
 * @param {HTMLElement} appContainer
 * @param {boolean} showSelector
 */
export function toggleCaseSelectorView(selectorContainer, appContainer, showSelector) {
  selectorContainer.hidden = !showSelector;
  appContainer.hidden = showSelector;
}
