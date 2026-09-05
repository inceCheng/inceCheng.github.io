(() => {
  const control = document.querySelector('.theme-toggle');
  if (!control) return;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let choice;
  try { choice = localStorage.getItem('portfolio-theme'); } catch (_) { /* Storage is optional. */ }
  if (choice !== 'light' && choice !== 'dark') choice = null;

  function renderTheme() {
    const dark = choice ? choice === 'dark' : preference.matches;
    if (choice) document.documentElement.dataset.theme = choice;
    else delete document.documentElement.dataset.theme;
    control.setAttribute('aria-label', dark ? '切换至浅色外观' : '切换至深色外观');
    control.hidden = false;
  }
  control.addEventListener('click', () => {
    const currentDark = choice ? choice === 'dark' : preference.matches;
    choice = currentDark ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', choice); } catch (_) { /* Continue without persistence. */ }
    renderTheme();
  });
  preference.addEventListener('change', renderTheme);
  renderTheme();
})();

(() => {
  const dialog = document.querySelector('.award-dialog');
  const entries = [...document.querySelectorAll('[data-award-open]')];
  if (!dialog || !entries.length || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.award-viewer-image');
  const title = dialog.querySelector('#award-viewer-title');
  const detail = dialog.querySelector('#award-viewer-detail');
  const count = dialog.querySelector('[data-award-count]');
  const original = dialog.querySelector('[data-award-original]');
  const stage = dialog.querySelector('.award-viewer-stage');
  let current = 0;
  let opener;

  function show(index) {
    current = (index + entries.length) % entries.length;
    const entry = entries[current];
    image.src = entry.dataset.image;
    image.alt = entry.dataset.alt;
    title.textContent = entry.dataset.title;
    detail.textContent = entry.dataset.detail;
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
    original.href = entry.href;
    original.textContent = `${entry.dataset.originalLabel} ↗`;
    stage.scrollTop = 0;
  }

  for (const [index, entry] of entries.entries()) {
    entry.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = entry;
      show(index);
      dialog.showModal();
      document.documentElement.classList.add('award-viewer-open');
    });
  }
  dialog.querySelector('.award-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-award-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-award-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('award-viewer-open');
    opener?.focus({ preventScroll: true });
  });
})();
