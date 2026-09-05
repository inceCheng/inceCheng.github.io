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
