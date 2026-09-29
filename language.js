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
    ? '<div class="about-dialog-card"><button class="dialog-close" type="button" data-about-close aria-label="Close About Ella">×</button><p class="eyebrow">ABOUT ELLA</p><h2 id="about-dialog-title">Ella Maria<br>Cosmovici Idsøe</h2><p class="large">Owner of Idsøe Rådgivning.</p><p>Ella works with professional learning and advice concerning children and students with high learning potential, appropriate challenges, inclusion and belonging.</p><a class="text-link" href="ellas-ideas.html">Ella’s ideas for developing practice</a></div>'
    : '<div class="about-dialog-card"><button class="dialog-close" type="button" data-about-close aria-label="Lukk Om Ella">×</button><p class="eyebrow">OM ELLA</p><h2 id="about-dialog-title">Ella Maria<br>Cosmovici Idsøe</h2><p class="large">Innehaver av Idsøe Rådgivning.</p><p>Ella arbeider med faglig formidling og rådgivning om barn og elever med stort læringspotensial, tilpassede utfordringer, inkludering og tilhørighet.</p><a class="text-link" href="ellas-ideer.html">Ellas ideer for faglig utvikling</a></div>');
  document.querySelectorAll('[data-about-open], a[href$="#om-ella"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); aboutDialog.showModal(); }));
  document.querySelector('[data-about-close]').addEventListener('click', () => aboutDialog.close());
  aboutDialog.addEventListener('click', (event) => { if (event.target === aboutDialog) aboutDialog.close(); });
  if (window.location.hash === '#om-ella') aboutDialog.showModal();
  window.addEventListener('hashchange', () => {
    url.hash = window.location.hash;
    routeLegacyHash();
  });
})();
