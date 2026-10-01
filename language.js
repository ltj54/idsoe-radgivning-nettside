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

  // Keep old shared links to sections of the former one-page site working.
  const legacy = {"nb": {"laeringspotensial": "kunnskapsbank.html#laeringspotensial", "potential-title": "kunnskapsbank.html#potential-title", "laering": "kunnskapsbank.html#laering", "learning-title": "kunnskapsbank.html#learning-title", "sporsmal": "kunnskapsbank.html#sporsmal", "faq-title": "kunnskapsbank.html#faq-title", "ressurser": "kunnskapsbank.html#ressurser", "resources-title": "kunnskapsbank.html#resources-title", "potensial-og-prestasjon": "potensial-og-prestasjon.html#potensial-og-prestasjon", "potential-detail-title": "potensial-og-prestasjon.html#potential-detail-title", "kartlegging": "kartlegging.html#kartlegging", "assessment-title": "kartlegging.html#assessment-title", "motivasjon": "motivasjon.html#motivasjon", "motivation-title": "motivasjon.html#motivation-title", "inkludering": "inkludering.html#inkludering", "inclusion-title": "inkludering.html#inclusion-title", "trygghet": "trygghet.html#trygghet", "safety-title": "trygghet.html#safety-title", "differensiering": "tilpasset-undervisning.html#differensiering", "differentiation-title": "tilpasset-undervisning.html#differentiation-title", "akselerasjon": "tilpasset-undervisning.html#akselerasjon", "berikelse": "tilpasset-undervisning.html#berikelse", "vennskap": "vennskap.html#vennskap", "friendship-title": "vennskap.html#friendship-title", "elevens-stemme": "elevens-stemme.html#elevens-stemme", "voice-title": "elevens-stemme.html#voice-title", "kompetanse": "skolens-kompetanse.html#kompetanse", "competence-title": "skolens-kompetanse.html#competence-title", "for-foreldre": "foreldre.html#for-foreldre", "parents-title": "foreldre.html#parents-title", "for-laerere": "skoler.html#for-laerere", "teachers-title": "skoler.html#teachers-title", "ideer": "ellas-ideer.html#ideer", "ideas-title": "ellas-ideer.html#ideas-title", "faglig-fordypning": "kunnskapsbank.html#faglig-fordypning", "knowledge-title": "kunnskapsbank.html#knowledge-title"}, "en": {"laeringspotensial": "knowledge.html#laeringspotensial", "potential-title": "knowledge.html#potential-title", "laering": "knowledge.html#laering", "learning-title": "knowledge.html#learning-title", "sporsmal": "knowledge.html#sporsmal", "faq-title": "knowledge.html#faq-title", "ressurser": "knowledge.html#ressurser", "resources-title": "knowledge.html#resources-title", "potensial-og-prestasjon": "potential-and-achievement.html#potensial-og-prestasjon", "potential-detail-title": "potential-and-achievement.html#potential-detail-title", "kartlegging": "identifying-learning-needs.html#kartlegging", "assessment-title": "identifying-learning-needs.html#assessment-title", "motivasjon": "motivation.html#motivasjon", "motivation-title": "motivation.html#motivation-title", "inkludering": "inclusion.html#inkludering", "inclusion-title": "inclusion.html#inclusion-title", "trygghet": "safe-learning-environments.html#trygghet", "safety-title": "safe-learning-environments.html#safety-title", "differensiering": "differentiated-teaching.html#differensiering", "differentiation-title": "differentiated-teaching.html#differentiation-title", "akselerasjon": "differentiated-teaching.html#akselerasjon", "berikelse": "differentiated-teaching.html#berikelse", "vennskap": "friendship.html#vennskap", "friendship-title": "friendship.html#friendship-title", "elevens-stemme": "student-voice.html#elevens-stemme", "voice-title": "student-voice.html#voice-title", "kompetanse": "professional-learning.html#kompetanse", "competence-title": "professional-learning.html#competence-title", "for-foreldre": "parents.html#for-foreldre", "parents-title": "parents.html#parents-title", "for-laerere": "schools.html#for-laerere", "teachers-title": "schools.html#teachers-title", "ideer": "ellas-ideas.html#ideer", "ideas-title": "ellas-ideas.html#ideas-title", "faglig-fordypning": "knowledge.html#faglig-fordypning", "knowledge-title": "knowledge.html#knowledge-title"}};
  const routeLegacyHash = () => {
    if (!document.body.classList.contains('home-page')) return false;
    const route = legacy[current]?.[url.hash.slice(1)];
    if (!route) return false;
    const target = new URL(route, url);
    target.search = window.location.search;
    window.location.replace(target.href);
    return true;
  };
  if (routeLegacyHash()) return;
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
  const createDialog = (id, body) => {
    let dialog = document.getElementById(id);
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = id;
    dialog.className = id === 'about-dialog' ? 'about-dialog' : 'contact-form-dialog';
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.innerHTML = body;
    document.body.append(dialog);
    return dialog;
  };
  const aboutDialog = createDialog('about-dialog', isEnglish
    ? '<div class="about-dialog-card"><button class="dialog-close" type="button" data-about-close aria-label="Close About Ella">×</button><p class="eyebrow">ABOUT ELLA</p><h2 id="about-dialog-title">Ella Maria<br>Cosmovici Idsøe</h2><p class="large">Owner of Idsøe Rådgivning.</p><p>Ella works with professional learning and advice concerning children and students with high learning potential, appropriate challenges, inclusion and belonging.</p><a class="text-link" href="ellas-ideas.html">Ella’s ideas for developing practice</a></div>'
    : '<div class="about-dialog-card"><button class="dialog-close" type="button" data-about-close aria-label="Lukk Om Ella">×</button><p class="eyebrow">OM ELLA</p><h2 id="about-dialog-title">Ella Maria<br>Cosmovici Idsøe</h2><p class="large">Innehaver av Idsøe Rådgivning.</p><p>Ella arbeider med faglig formidling og rådgivning om barn og elever med stort læringspotensial, tilpassede utfordringer, inkludering og tilhørighet.</p><a class="text-link" href="ellas-ideer.html">Ellas ideer for faglig utvikling</a></div>');
  const contactDialog = createDialog('contact-form-dialog', isEnglish
    ? '<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Close contact form">×</button><p class="eyebrow">CONTACT</p><h2 id="contact-form-dialog-title">Write to Ella</h2><p>Complete the fields, then choose how to open the message.</p><form class="contact-form" data-contact-form><label for="contact-name">Name</label><input id="contact-name" name="name" type="text" autocomplete="name" maxlength="120" required><label for="contact-email">Your email address</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="200" required><label for="contact-subject">Subject</label><input id="contact-subject" name="subject" type="text" maxlength="160" required><label for="contact-message">Message</label><textarea id="contact-message" name="message" rows="6" maxlength="3000" required></textarea><div class="contact-actions"><button class="button" type="submit" name="provider" value="gmail">Gmail</button><button class="button button-secondary" type="submit" name="provider" value="outlook">Outlook / Hotmail</button><button class="button button-secondary" type="submit" name="provider" value="default">Email application</button></div><p class="form-note" data-contact-note tabindex="-1">The message is addressed to <a href="mailto:emidsoe@gmail.com">emidsoe@gmail.com</a>.</p></form></div>'
    : '<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Lukk kontaktskjema">×</button><p class="eyebrow">KONTAKT</p><h2 id="contact-form-dialog-title">Skriv til Ella</h2><p>Fyll ut feltene, og velg deretter hvordan meldingen skal åpnes.</p><form class="contact-form" data-contact-form><label for="contact-name">Navn</label><input id="contact-name" name="name" type="text" autocomplete="name" maxlength="120" required><label for="contact-email">Din e-postadresse</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="200" required><label for="contact-subject">Emne</label><input id="contact-subject" name="subject" type="text" maxlength="160" required><label for="contact-message">Melding</label><textarea id="contact-message" name="message" rows="6" maxlength="3000" required></textarea><div class="contact-actions"><button class="button" type="submit" name="provider" value="gmail">Gmail</button><button class="button button-secondary" type="submit" name="provider" value="outlook">Outlook / Hotmail</button><button class="button button-secondary" type="submit" name="provider" value="default">E-postprogram</button></div><p class="form-note" data-contact-note tabindex="-1">Meldingen adresseres til <a href="mailto:emidsoe@gmail.com">emidsoe@gmail.com</a>.</p></form></div>');
  document.querySelectorAll('[data-about-open], a[href$="#om-ella"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); aboutDialog.showModal(); }));
  document.querySelectorAll('a[href$="#kontakt"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); contactDialog.showModal(); }));
  document.querySelector('[data-about-close]').addEventListener('click', () => aboutDialog.close());
  document.querySelector('[data-contact-close]').addEventListener('click', () => contactDialog.close());
  aboutDialog.addEventListener('click', (event) => { if (event.target === aboutDialog) aboutDialog.close(); });
  contactDialog.addEventListener('click', (event) => { if (event.target === contactDialog) contactDialog.close(); });
  if (window.location.hash === '#om-ella') aboutDialog.showModal();
  if (window.location.hash === '#kontakt') contactDialog.showModal();
  contactDialog.querySelector('[data-contact-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const note = form.querySelector('[data-contact-note]');
    const data = new FormData(form);
    const subject = data.get('subject').toString().trim();
    const body = isEnglish
      ? `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
      : `Navn: ${data.get('name')}\nE-post: ${data.get('email')}\n\n${data.get('message')}`;
    const provider = event.submitter?.value || 'gmail';
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
    url.hash = window.location.hash;
    if (routeLegacyHash()) return;
    if (window.location.hash === '#kontakt' && !contactDialog.open) contactDialog.showModal();
  });
})();
