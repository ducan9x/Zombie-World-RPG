// Shared offline reader presentation; CSV/data and lookup algorithms are unchanged.
for (const file of ['tokens.css', 'foundation.css', 'tools.css']) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(`../css/ui/${file}`, import.meta.url).href;
  document.head.append(link);
}
const sidebar = document.querySelector('.sidebar');
if (sidebar) {
  const disclosure = document.createElement('details');
  disclosure.className = 'tool-categories';
  const summary = document.createElement('summary');
  summary.textContent = 'Danh mục tra cứu';
  sidebar.before(disclosure);
  disclosure.append(summary, sidebar);
  sidebar.addEventListener('click', event => {
    if (event.target.closest('.nav-item')) disclosure.open = false;
  });
}
function decorate() {
  for (const item of document.querySelectorAll('.nav-item:not([tabindex]), .category-btn:not([tabindex])')) {
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); item.click(); }
    });
  }
  for (const table of document.querySelectorAll('table:not([data-mobile-labels])')) {
    table.dataset.mobileLabels = 'true';
    const labels = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
    for (const row of table.querySelectorAll('tbody tr')) {
      [...row.children].forEach((cell, index) => { cell.dataset.label = labels[index] || ''; });
    }
  }
}
decorate();
new MutationObserver(decorate).observe(document.body, { subtree: true, childList: true });
if (window.parent !== window) {
  const sendHeight = () => window.parent.postMessage({ type: 'field-tool-height', height: document.body.scrollHeight }, window.location.origin);
  new ResizeObserver(sendHeight).observe(document.body);
  window.addEventListener('load', sendHeight);
}
