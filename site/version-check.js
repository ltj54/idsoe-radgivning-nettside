(() => {
  if (window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

  const storageKey = 'idsoe-site-version';
  const parameter = 'site-version';
  const versionUrl = new URL('version.json', window.location.href);
  versionUrl.searchParams.set('cache-bust', Date.now().toString());

  fetch(versionUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('Could not read site version.');
      return response.json();
    })
    .then(({ version }) => {
      if (!version || typeof version !== 'string') return;

      const currentUrl = new URL(window.location.href);
      const requestedVersion = currentUrl.searchParams.get(parameter);
      let knownVersion = null;
      try { knownVersion = sessionStorage.getItem(storageKey); } catch { /* Storage is optional. */ }

      if (requestedVersion === version) {
        try { sessionStorage.setItem(storageKey, version); } catch { /* Storage is optional. */ }
        currentUrl.searchParams.delete(parameter);
        window.history.replaceState(null, '', currentUrl.href);
        return;
      }

      if (knownVersion === version) return;

      try { sessionStorage.setItem(storageKey, version); } catch { /* Storage is optional. */ }
      currentUrl.searchParams.set(parameter, version);
      window.location.replace(currentUrl.href);
    })
    .catch(() => { /* Keep the current page available if the version check fails. */ });
})();
