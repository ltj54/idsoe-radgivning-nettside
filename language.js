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
  const contactEmail = 'emidsoe@gmail.com';
  const dialog = document.createElement('dialog');
  dialog.id = 'contact-form-dialog';
  dialog.className = 'contact-form-dialog';
  dialog.setAttribute('aria-labelledby', 'contact-form-dialog-title');
  dialog.innerHTML = isEnglish
    ? '<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Close contact form">×</button><p class="eyebrow">CONTACT</p><h2 id="contact-form-dialog-title">Write to us</h2><p>Complete the fields to prepare an email.</p><p class="contact-warning" id="contact-warning">Do not include sensitive or confidential information about children.</p><form class="contact-form" data-contact-form><label for="contact-name">Name</label><input id="contact-name" name="name" type="text" autocomplete="name" maxlength="120" required><label for="contact-email">Your email address</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="200" required><label for="contact-subject">Subject</label><input id="contact-subject" name="subject" type="text" maxlength="160" required><label for="contact-message">Message</label><textarea id="contact-message" name="message" aria-describedby="contact-warning" rows="6" maxlength="3000" required></textarea><div class="contact-actions"><button class="button" type="submit" name="provider" value="default">Open email</button></div><details class="contact-alternatives"><summary>Use Gmail or Outlook instead</summary><div class="contact-provider-options"><button class="button button-secondary" type="submit" name="provider" value="gmail">Gmail</button><button class="button button-secondary" type="submit" name="provider" value="outlook">Outlook / Hotmail</button></div></details><p class="form-note" data-contact-note tabindex="-1">Review the message in your email service before sending.</p></form></div>'
    : '<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Lukk kontaktskjema">×</button><p class="eyebrow">KONTAKT</p><h2 id="contact-form-dialog-title">Skriv til oss</h2><p>Fyll ut feltene for å klargjøre en e-post.</p><p class="contact-warning" id="contact-warning">Ikke skriv sensitive eller fortrolige opplysninger om barn i meldingen.</p><form class="contact-form" data-contact-form><label for="contact-name">Navn</label><input id="contact-name" name="name" type="text" autocomplete="name" maxlength="120" required><label for="contact-email">Din e-postadresse</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="200" required><label for="contact-subject">Emne</label><input id="contact-subject" name="subject" type="text" maxlength="160" required><label for="contact-message">Melding</label><textarea id="contact-message" name="message" aria-describedby="contact-warning" rows="6" maxlength="3000" required></textarea><div class="contact-actions"><button class="button" type="submit" name="provider" value="default">Åpne e-post</button></div><details class="contact-alternatives"><summary>Bruker du Gmail eller Outlook?</summary><div class="contact-provider-options"><button class="button button-secondary" type="submit" name="provider" value="gmail">Gmail</button><button class="button button-secondary" type="submit" name="provider" value="outlook">Outlook / Hotmail</button></div></details><p class="form-note" data-contact-note tabindex="-1">Kontroller meldingen i e-posttjenesten før du sender.</p></form></div>';
  document.body.append(dialog);
  document.querySelectorAll('a[href$="#kontakt"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); dialog.showModal(); }));
  dialog.querySelector('[data-contact-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  if (window.location.hash === '#kontakt') dialog.showModal();
  dialog.querySelector('[data-contact-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const note = form.querySelector('[data-contact-note]');
    const data = new FormData(form);
    const subject = data.get('subject').toString().trim();
    const body = isEnglish
      ? `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
      : `Navn: ${data.get('name')}\nE-post: ${data.get('email')}\n\n${data.get('message')}`;
    const provider = event.submitter?.value || 'default';
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (provider === 'default') {
      note.textContent = isEnglish ? 'Your email application is opening. Review the message before sending.' : 'E-postprogrammet åpnes. Kontroller meldingen før du sender.';
      window.location.href = mailtoUrl;
      return;
    }
    const encodedTo = encodeURIComponent(contactEmail);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const composeUrl = provider === 'outlook'
      ? `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`
      : `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    const serviceName = provider === 'outlook' ? 'Outlook / Hotmail' : 'Gmail';
    note.textContent = isEnglish ? `${serviceName} is opening in a new tab. Review the message before sending.` : `${serviceName} åpnes i en ny fane. Kontroller meldingen før du sender.`;
    window.open(composeUrl, '_blank', 'noopener');
  });
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#kontakt' && !dialog.open) dialog.showModal();
  });
})();
