// Shared page-shell behavior used across static pages.
(function () {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const icon = btn.querySelector('use');
  if (!icon) return;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function updateIcon(theme) {
    if (theme === 'dark') {
      icon.setAttribute('href', '#icon-sun');
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.setAttribute('href', '#icon-moon');
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateIcon(theme);
  }

  updateIcon(getTheme());

  btn.addEventListener('click', function () {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}());
