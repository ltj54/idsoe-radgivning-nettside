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
  const legacy = {"nb": {"laeringspotensial": "kunnskapsbank.html#laeringspotensial", "potential-title": "kunnskapsbank.html#potential-title", "laering": "kunnskapsbank.html#laering", "learning-title": "kunnskapsbank.html#learning-title", "sporsmal": "kunnskapsbank.html#sporsmal", "faq-title": "kunnskapsbank.html#faq-title", "ressurser": "kunnskapsbank.html#ressurser", "resources-title": "kunnskapsbank.html#resources-title", "potensial-og-prestasjon": "potensial-og-prestasjon.html#potensial-og-prestasjon", "potential-detail-title": "potensial-og-prestasjon.html#potential-detail-title", "kartlegging": "kartlegging.html#kartlegging", "assessment-title": "kartlegging.html#assessment-title", "motivasjon": "motivasjon.html#motivasjon", "motivation-title": "motivasjon.html#motivation-title", "inkludering": "inkludering.html#inkludering", "inclusion-title": "inkludering.html#inclusion-title", "trygghet": "trygghet.html#trygghet", "safety-title": "trygghet.html#safety-title", "differensiering": "tilpasset-undervisning.html#differensiering", "differentiation-title": "tilpasset-undervisning.html#differentiation-title", "akselerasjon": "tilpasset-undervisning.html#akselerasjon", "berikelse": "tilpasset-undervisning.html#berikelse", "vennskap": "vennskap.html#vennskap", "friendship-title": "vennskap.html#friendship-title", "elevens-stemme": "elevens-stemme.html#elevens-stemme", "voice-title": "elevens-stemme.html#voice-title", "kompetanse": "skolens-kompetanse.html#kompetanse", "competence-title": "skolens-kompetanse.html#competence-title", "for-foreldre": "foreldre.html#for-foreldre", "parents-title": "foreldre.html#parents-title", "for-laerere": "laerere.html#for-laerere", "teachers-title": "laerere.html#teachers-title", "for-helsepersonell": "helsepersonell.html#for-helsepersonell", "clinicians-title": "helsepersonell.html#clinicians-title", "ideer": "ellas-ideer.html#ideer", "ideas-title": "ellas-ideer.html#ideas-title", "faglig-fordypning": "kunnskapsbank.html#faglig-fordypning", "knowledge-title": "kunnskapsbank.html#knowledge-title"}, "en": {"laeringspotensial": "knowledge.html#laeringspotensial", "potential-title": "knowledge.html#potential-title", "laering": "knowledge.html#laering", "learning-title": "knowledge.html#learning-title", "sporsmal": "knowledge.html#sporsmal", "faq-title": "knowledge.html#faq-title", "ressurser": "knowledge.html#ressurser", "resources-title": "knowledge.html#resources-title", "potensial-og-prestasjon": "potential-and-achievement.html#potensial-og-prestasjon", "potential-detail-title": "potential-and-achievement.html#potential-detail-title", "kartlegging": "identifying-learning-needs.html#kartlegging", "assessment-title": "identifying-learning-needs.html#assessment-title", "motivasjon": "motivation.html#motivasjon", "motivation-title": "motivation.html#motivation-title", "inkludering": "inclusion.html#inkludering", "inclusion-title": "inclusion.html#inclusion-title", "trygghet": "safe-learning-environments.html#trygghet", "safety-title": "safe-learning-environments.html#safety-title", "differensiering": "differentiated-teaching.html#differensiering", "differentiation-title": "differentiated-teaching.html#differentiation-title", "akselerasjon": "differentiated-teaching.html#akselerasjon", "berikelse": "differentiated-teaching.html#berikelse", "vennskap": "friendship.html#vennskap", "friendship-title": "friendship.html#friendship-title", "elevens-stemme": "student-voice.html#elevens-stemme", "voice-title": "student-voice.html#voice-title", "kompetanse": "professional-learning.html#kompetanse", "competence-title": "professional-learning.html#competence-title", "for-foreldre": "parents.html#for-foreldre", "parents-title": "parents.html#parents-title", "for-laerere": "teachers.html#for-laerere", "teachers-title": "teachers.html#teachers-title", "for-helsepersonell": "health-professionals.html#for-helsepersonell", "clinicians-title": "health-professionals.html#clinicians-title", "ideer": "ellas-ideas.html#ideer", "ideas-title": "ellas-ideas.html#ideas-title", "faglig-fordypning": "knowledge.html#faglig-fordypning", "knowledge-title": "knowledge.html#knowledge-title"}};
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
  const createDialog = (id, title, body) => {
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
  const aboutDialog = createDialog('about-dialog', isEnglish ? 'About Ella' : 'Om Ella', isEnglish
    ? '<div class="about-dialog-card"><button class="dialog-close" type="button" data-about-close aria-label="Close About Ella">×</button><p class="eyebrow">ABOUT ELLA</p><h2 id="about-dialog-title">Ella Maria<br>Cosmovici Idsøe</h2><p class="large">Owner of Idsøe Rådgivning.</p><p>Ella delivers courses and seminars and provides advice relating to children and students with high learning potential.</p><p>Her work explores learning potential, differentiated teaching and how schools can support students’ development.</p><a class="text-link" href="ellas-ideas.html">Ella’s ideas for developing practice</a></div>'
    : '<div class="about-dialog-card"><button class="dialog-close" type="button" data-about-close aria-label="Lukk Om Ella">×</button><p class="eyebrow">OM ELLA</p><h2 id="about-dialog-title">Ella Maria<br>Cosmovici Idsøe</h2><p class="large">Innehaver av Idsøe Rådgivning.</p><p>Ella holder kurs og seminarer og arbeider med rådgivning knyttet til barn og elever med stort læringspotensial.</p><p>Hun arbeider med spørsmål om læringspotensial, tilpasset undervisning og hvordan skolen kan støtte elevenes utvikling.</p><a class="text-link" href="ellas-ideer.html">Ellas ideer for faglig utvikling</a></div>');
  const contactDialog = createDialog('contact-form-dialog', isEnglish ? 'Contact' : 'Kontakt', isEnglish
    ? '<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Close contact form">×</button><p class="eyebrow">CONTACT</p><h2 id="contact-form-dialog-title">Send an enquiry</h2><p>Enquiries about courses, seminars, advice and educational topics can be directed to Idsøe Rådgivning.</p><form class="contact-form" action="https://formspree.io/f/REPLACE_WITH_FORM_ID" method="POST" data-formspree-pending><label for="contact-name">Name</label><input id="contact-name" name="name" type="text" autocomplete="name" required><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" required><label for="contact-subject">What is your enquiry about?</label><input id="contact-subject" name="subject" type="text" required><label for="contact-message">Message</label><textarea id="contact-message" name="message" rows="6" required></textarea><input type="hidden" name="_subject" value="New enquiry to Idsøe Rådgivning"><button class="button" type="submit">Send enquiry</button><p class="form-note" data-form-note>The form will be activated when the Formspree endpoint is set.</p><p class="privacy-note">Information is used only to read and respond to your enquiry. See the <a href="privacy.html">privacy information</a>.</p></form></div>'
    : '<div class="contact-form-card"><button class="dialog-close" type="button" data-contact-close aria-label="Lukk kontaktskjema">×</button><p class="eyebrow">KONTAKT</p><h2 id="contact-form-dialog-title">Send en henvendelse</h2><p>Henvendelser om kurs, seminarer, rådgivning og faglige temaer kan rettes til Idsøe Rådgivning.</p><form class="contact-form" action="https://formspree.io/f/REPLACE_WITH_FORM_ID" method="POST" data-formspree-pending><label for="contact-name">Navn</label><input id="contact-name" name="name" type="text" autocomplete="name" required><label for="contact-email">E-post</label><input id="contact-email" name="email" type="email" autocomplete="email" required><label for="contact-subject">Hva gjelder henvendelsen?</label><input id="contact-subject" name="subject" type="text" required><label for="contact-message">Melding</label><textarea id="contact-message" name="message" rows="6" required></textarea><input type="hidden" name="_subject" value="Ny henvendelse til Idsøe Rådgivning"><button class="button" type="submit">Send henvendelse</button><p class="form-note" data-form-note>Skjemaet aktiveres når Formspree-endepunktet er satt.</p><p class="privacy-note">Opplysningene brukes kun til å lese og besvare henvendelsen. Se <a href="personvern.html">personverninformasjonen</a>.</p></form></div>');
  document.querySelectorAll('[data-about-open], a[href$="#om-ella"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); aboutDialog.showModal(); }));
  document.querySelectorAll('a[href$="#kontakt"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); contactDialog.showModal(); }));
  document.querySelector('[data-about-close]').addEventListener('click', () => aboutDialog.close());
  document.querySelector('[data-contact-close]').addEventListener('click', () => contactDialog.close());
  [aboutDialog, contactDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
  if (window.location.hash === '#om-ella') aboutDialog.showModal();
  if (window.location.hash === '#kontakt') contactDialog.showModal();
  document.querySelectorAll('[data-formspree-pending]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (form.action.includes('REPLACE_WITH_FORM_ID')) {
        event.preventDefault();
        const note = form.querySelector('[data-form-note]');
        if (note) note.focus();
      }
    });
  });
  window.addEventListener('hashchange', () => {
    url.hash = window.location.hash;
    routeLegacyHash();
  });
})();
