// Both languages are complete static pages; the links also work without JavaScript.
(() => {
  const key = 'idsoe-language';
  const current = document.documentElement.lang;
  const url = new URL(window.location.href);
  const requested = url.searchParams.get('lang');
  const read = () => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const remember = (language) => {
    try { localStorage.setItem(key, language); } catch { /* Storage may be disabled. */ }
  };

  // An explicit language link takes priority over a previously saved choice.
  if (requested === 'nb' || requested === 'en') {
    remember(requested);
    if (requested !== current) {
      const target = new URL(requested === 'en' ? 'en.html' : 'index.html', url);
      target.search = url.search;
      target.hash = url.hash;
      window.location.replace(target.href);
      return;
    }
  } else if (current === 'en') {
    remember('en');
  } else if (read() === 'en') {
    const target = new URL('en.html', url);
    target.search = url.search;
    target.hash = url.hash;
    window.location.replace(target.href);
    return;
  }

  document.querySelectorAll('[data-language]').forEach((link) => {
    const updateTarget = () => {
      const target = new URL(link.getAttribute('href'), url);
      target.hash = window.location.hash;
      link.href = target.href;
    };
    updateTarget();
    window.addEventListener('hashchange', updateTarget);
    link.addEventListener('click', () => remember(link.dataset.language));
  });
})();
