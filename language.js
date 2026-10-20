// Static language links work without JavaScript. Storage only remembers a preference.
(() => {
  const key = 'idsoe-language';
  const current = document.documentElement.lang;
  const url = new URL(window.location.href);
  const requested = url.searchParams.get('lang');
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const remember = (language) => { try { localStorage.setItem(key, language); } catch { /* Optional storage. */ } };
  const preferred = requested === 'nb' || requested === 'en' ? requested : current === 'en' ? 'en' : read();
  if (preferred === 'nb' || preferred === 'en') {
    remember(preferred);
    if (preferred !== current) {
      const alternate = document.querySelector(`link[rel="alternate"][hreflang="${preferred}"]`);
      if (alternate) {
        const target = new URL(alternate.getAttribute('href'), url);
        target.search = url.search;
        target.hash = url.hash;
        window.location.replace(target.href);
        return;
      }
    }
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

  const isEnglish = current === 'en';
  const contactEmail = 'kontakt@emidsoe.no';
  const encodedEmail = encodeURIComponent(contactEmail);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail}`;
  const dialog = document.createElement('dialog');
  dialog.id = 'contact-form-dialog';
  dialog.className = 'contact-form-dialog contact-email-dialog';
  dialog.setAttribute('aria-labelledby', 'contact-form-dialog-title');
  dialog.innerHTML = isEnglish
    ? `<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Close contact window">×</button><p class="eyebrow">CONTACT</p><h2 id="contact-form-dialog-title">Write to us</h2><p>Contact us at this email address:</p><p class="contact-address"><a href="mailto:${contactEmail}">${contactEmail}</a></p><p class="contact-warning">Do not send sensitive or confidential information about children by ordinary email.</p><div class="contact-email-actions"><button class="button" type="button" data-copy-email>Copy address</button><a class="button button-secondary" href="mailto:${contactEmail}">Open email app</a></div><details class="contact-webmail"><summary>Use email in your browser?</summary><p><a href="${gmailUrl}" target="_blank" rel="noopener noreferrer">Open Gmail</a><a href="${outlookUrl}" target="_blank" rel="noopener noreferrer">Open Outlook / Hotmail</a></p><p>For another service, copy the address above and paste it there.</p></details><p class="form-note" data-copy-status role="status" aria-live="polite">No message is sent from this website.</p></div>`
    : `<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Lukk kontaktvindu">×</button><p class="eyebrow">KONTAKT</p><h2 id="contact-form-dialog-title">Skriv til oss</h2><p>Kontakt oss på denne e-postadressen:</p><p class="contact-address"><a href="mailto:${contactEmail}">${contactEmail}</a></p><p class="contact-warning">Ikke send sensitive eller fortrolige opplysninger om barn via vanlig e-post.</p><div class="contact-email-actions"><button class="button" type="button" data-copy-email>Kopier adresse</button><a class="button button-secondary" href="mailto:${contactEmail}">Åpne e-postprogram</a></div><details class="contact-webmail"><summary>Bruker du e-post i nettleseren?</summary><p><a href="${gmailUrl}" target="_blank" rel="noopener noreferrer">Åpne Gmail</a><a href="${outlookUrl}" target="_blank" rel="noopener noreferrer">Åpne Outlook / Hotmail</a></p><p>For andre tjenester kan du kopiere adressen over og lime den inn der.</p></details><p class="form-note" data-copy-status role="status" aria-live="polite">Ingen melding sendes fra nettsiden.</p></div>`;
  document.body.append(dialog);
  document.querySelectorAll('a[href$="#kontakt"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); dialog.showModal(); }));
  dialog.querySelector('[data-contact-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  if (window.location.hash === '#kontakt') dialog.showModal();
  dialog.querySelector('[data-copy-email]').addEventListener('click', async () => {
    const status = dialog.querySelector('[data-copy-status]');
    try {
      await navigator.clipboard.writeText(contactEmail);
      status.textContent = isEnglish ? 'Address copied.' : 'Adressen er kopiert.';
    } catch {
      status.textContent = isEnglish
        ? 'Could not copy automatically. Select the address above and copy it manually.'
        : 'Kunne ikke kopiere automatisk. Merk adressen over og kopier den manuelt.';
    }
  });
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#kontakt' && !dialog.open) dialog.showModal();
  });
})();
