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
  const items = [...document.querySelectorAll('.award-card, .resume-honors')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !items.length || !window.IntersectionObserver || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver(changes => {
    for (const change of changes) {
      if (!change.isIntersecting) continue;
      observer.unobserve(change.target);
      if (motion.matches) continue;
      const columns = window.innerWidth > 900 ? 4 : window.innerWidth > 460 ? 2 : 1;
      const animation = change.target.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, delay: (items.indexOf(change.target) % columns) * 75, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    }
  }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
  items.forEach(item => observer.observe(item));
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();

(() => {
  const deck = document.querySelector('.resume-award-deck');
  if (!deck) return;
  const section = deck.closest('.resume-honors');
  const sheets = [...deck.querySelectorAll('[data-deck-sheet]')];
  const previews = [...section.querySelectorAll('[data-deck-preview]')];
  let selected = 0;

  function select(index) {
    selected = (index + sheets.length) % sheets.length;
    for (const [position, sheet] of sheets.entries()) {
      sheet.dataset.position = (position - selected + sheets.length) % sheets.length;
      sheet.setAttribute('aria-hidden', String(position !== selected));
      previews[position].hidden = position !== selected;
    }
    const preview = previews[selected];
    section.querySelector('[data-deck-title]').textContent = preview.dataset.shortTitle;
    section.querySelector('[data-deck-distinction]').textContent = preview.dataset.distinction;
    section.querySelector('[data-deck-count]').textContent = `${String(selected + 1).padStart(2, '0')} / ${String(sheets.length).padStart(2, '0')}`;
    deck.setAttribute('aria-label', `当前：${preview.dataset.title}。点击切换下一项获奖证书`);
  }
  deck.addEventListener('click', () => select(selected + 1));
  deck.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(selected + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  select(0);
  deck.disabled = false;
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
  const status = dialog.querySelector('.award-viewer-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let opener;
  let imageAnimation;
  let closeAnimation;

  image.addEventListener('load', () => {
    stage.classList.remove('is-loading', 'has-error');
    stage.setAttribute('aria-busy', 'false');
    status.hidden = true;
    imageAnimation?.cancel();
    if (!motion.matches && image.animate && dialog.open) {
      imageAnimation = image.animate([
        { opacity: 0, transform: 'translateY(7px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
  });
  image.addEventListener('error', () => {
    stage.classList.remove('is-loading');
    stage.classList.add('has-error');
    stage.setAttribute('aria-busy', 'false');
    status.textContent = '图片暂时无法显示，可打开原始文件查看。';
    status.hidden = false;
  });

  function show(index) {
    if (closeAnimation) return;
    current = (index + entries.length) % entries.length;
    const entry = entries[current];
    imageAnimation?.cancel();
    stage.classList.remove('has-error');
    stage.classList.add('is-loading');
    stage.setAttribute('aria-busy', 'true');
    status.textContent = '正在载入图片…';
    status.hidden = false;
    image.src = entry.dataset.image;
    image.alt = entry.dataset.alt;
    title.textContent = entry.dataset.title;
    detail.textContent = entry.dataset.detail;
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
    original.href = entry.href;
    original.textContent = `${entry.dataset.originalLabel} ↗`;
    stage.scrollTop = 0;
  }

  function close() {
    if (!dialog.open || closeAnimation) return;
    if (motion.matches || !dialog.animate) { dialog.close(); return; }
    const style = getComputedStyle(dialog);
    closeAnimation = dialog.animate([
      { opacity: style.opacity, transform: style.transform },
      { opacity: 0, transform: 'translateY(8px) scale(.99)' }
    ], { duration: 170, easing: 'ease-out', fill: 'forwards' });
    closeAnimation.finished.then(() => dialog.close(), () => dialog.close());
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
  dialog.querySelector('.award-close').addEventListener('click', close);
  dialog.querySelector('[data-award-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-award-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  });
  dialog.addEventListener('close', () => {
    closeAnimation?.cancel();
    closeAnimation = null;
    imageAnimation?.cancel();
    document.documentElement.classList.remove('award-viewer-open');
    opener?.focus({ preventScroll: true });
  });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    imageAnimation?.cancel();
    closeAnimation?.finish();
  });
})();
