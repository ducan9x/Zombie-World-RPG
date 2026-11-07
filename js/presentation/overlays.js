/* Focus/scroll lifecycle only. Cancellation invokes the existing close control. */
export function initOverlays() {
  let active = null;
  let returnFocus = null;
  let inerted = [];
  let previousOverflow = '';
  let visibleBefore = [];
  let layer = 200;
  const restore = () => {
    for (const [node, wasInert] of inerted) node.inert = wasInert;
    inerted = [];
    document.body.style.overflow = previousOverflow;
    if (returnFocus?.isConnected && !returnFocus.closest('[hidden]')) returnFocus.focus({ preventScroll: true });
  };
  const focusables = node => [...node.querySelectorAll('button:not(:disabled), input:not(:disabled), select, a[href], [tabindex="0"]')]
    .filter(el => el.getClientRects().length && !el.hidden);
  const sync = () => {
    const candidates = [...document.querySelectorAll('.modal-overlay, #devtools-overlay')];
    const visible = candidates.filter(el => el.style.display !== 'none' && el.getClientRects().length && (el.id !== 'devtools-overlay' || el.classList.contains('show')));
    const next = visible.filter(el => !visibleBefore.includes(el)).at(-1) || (visible.includes(active) ? active : visible.at(-1)) || null;
    visibleBefore = visible;
    if (next === active) {
      if (active && !active.contains(document.activeElement)) focusables(active)[0]?.focus({ preventScroll: true });
      return;
    }
    if (active) restore();
    active = next;
    if (!active) return;
    active.style.zIndex = String(++layer);
    returnFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const box = active.querySelector('.modal-box, .devtools-modal') || active;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', active.querySelector('.modal-title, .devtools-modal-title')?.textContent || 'Hộp thoại');
    let branch = active;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && !['SCRIPT', 'STYLE', 'LINK'].includes(sibling.tagName)) {
          inerted.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    (focusables(box)[0] || box).focus({ preventScroll: true });
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      active.querySelector('.modal-close-btn, #devtools-cancel')?.click();
    }
    if (event.key !== 'Tab') return;
    const items = focusables(active);
    if (!items.length) { event.preventDefault(); return; }
    const index = items.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); items.at(-1).focus(); }
    else if (!event.shiftKey && (index < 0 || index === items.length - 1)) { event.preventDefault(); items[0].focus(); }
  });
  return { sync, destroy() { observer.disconnect(); if (active) restore(); } };
}
