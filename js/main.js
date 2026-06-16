/* =========================================================
   كارول | Carole Portfolio — Main script
   يقرأ كل المحتوى من content.js (SITE_DATA) ويبني الصفحة
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const data = SITE_DATA;
  if (!data) return;

  /* ── Magazines FIRST: fill slots before reorder so they have height ── */
  renderMagazines(data);

  /* ── Section order (slots now have content + height) ── */
  applySectionOrder(data);

  /* ── Site-wide texts ── */
  applyTexts(data);

  /* ── Basic text injection ── */
  setText('nav-artist-name', data.artist.name);
  setText('hero-role', data.artist.title);
  setText('hero-name', data.artist.name);
  setText('hero-name-ar', data.artist.nameAr);
  setText('hero-tagline', data.artist.tagline);
  setText('about-bio', data.artist.bio);
  setText('about-location', data.artist.location);
  setText('footer-name', data.artist.name);
  setText('footer-year', new Date().getFullYear());

  const aboutPhoto = document.getElementById('about-photo');
  if (aboutPhoto && data.artist.photo) aboutPhoto.src = data.artist.photo;

  const emailLink = document.getElementById('contact-email');
  if (emailLink && data.artist.email) emailLink.href = 'mailto:' + data.artist.email;
  setHref('contact-instagram', data.artist.social && data.artist.social.instagram);
  setHref('contact-facebook', data.artist.social && data.artist.social.facebook);
  setHref('contact-behance', data.artist.social && data.artist.social.behance);

  /* ── Render sections ── */
  renderFeatured(data);
  renderProcess(data);
  renderFilters(data);
  renderGallery(data);
  renderEvents(data);
  renderQuotes(data);
  renderStats(data);

  /* ── UI behaviours ── */
  initRevealAnimations();
  initNav();
  initLightbox(data);
  initHeroParallax();
  initHeroPortrait(data);
  initLangToggle(data);
});

/* =========================================================
   Helpers
   ========================================================= */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
}
function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.href = value;
}
function categoryLabel(data, catId) {
  const cat = data.categories.find(c => c.id === catId);
  return cat ? cat.label : catId;
}
function getPath(obj, path) {
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
}

/* =========================================================
   Site-wide editable texts ([data-text="section.key"])
   ========================================================= */
function applyTexts(data) {
  if (!data.texts) return;
  document.querySelectorAll('[data-text]').forEach(el => {
    const value = getPath(data.texts, el.dataset.text);
    if (value !== undefined && value !== '') el.textContent = value;
  });
}

/* =========================================================
   Section order — reorders middle sections in the DOM
   (hero #home and footer #contact stay fixed first/last)
   ========================================================= */
function applySectionOrder(data) {
  const order = data.sectionOrder;
  if (!order || !order.length) return;
  const footer = document.getElementById('contact');
  if (!footer) return;
  order.forEach(id => {
    const el = document.getElementById(id);
    if (el) footer.parentNode.insertBefore(el, footer);
  });
}

/* =========================================================
   Featured works (horizontal scroll)
   ========================================================= */
function renderFeatured(data) {
  const wrap = document.getElementById('featured-scroll');
  if (!wrap) return;
  const featured = data.works.filter(w => w.featured);
  wrap.innerHTML = featured.map(w => `
    <div class="featured-card" data-work-id="${w.id}">
      <img src="${w.image}" alt="${escapeHtml(w.title)}" loading="lazy">
      <div class="fc-overlay">
        <span class="fc-cat">${escapeHtml(categoryLabel(data, w.category))}</span>
        <h3 class="fc-title">${escapeHtml(w.title)}</h3>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('.featured-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = Number(card.dataset.workId);
      window.dispatchEvent(new CustomEvent('open-lightbox', { detail: { id } }));
    });
  });
}

/* =========================================================
   Creative process (رحلة العمل)
   ========================================================= */
function renderProcess(data) {
  const wrap = document.getElementById('process-list');
  if (!wrap || !data.process || !data.process.length) return;

  wrap.innerHTML = data.process.map((step, i) => `
    <div class="process-step ${i % 2 === 1 ? 'reverse' : ''}" data-reveal>
      <div class="process-img">
        <img src="${step.image}" alt="${escapeHtml(step.title)}" loading="lazy">
      </div>
      <div class="process-text">
        <span class="process-num">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="font-serif text-2xl sm:text-3xl mb-3">${escapeHtml(step.title)}</h3>
        <p class="text-ink2 leading-relaxed">${escapeHtml(step.description || '')}</p>
      </div>
    </div>
  `).join('');

  initRevealAnimations();
}

/* =========================================================
   Magazines — embedded iframes distributed across the page
   Slots: #mag-1 .. #mag-4  (filled before applySectionOrder)
   ========================================================= */
function renderMagazines(data) {
  const mags = data.magazines || [];
  if (!mags.length) return;

  const mgTexts = (data.texts && data.texts.magazines) || {};
  const badge   = mgTexts.badge || 'المجلة الأبرز';

  // alternating bg: dark / light / dark / light
  const bgs = ['mag-dark', 'mag-light', 'mag-dark', 'mag-light'];

  mags.forEach((mag, i) => {
    const slot = document.getElementById('mag-' + (i + 1));
    if (!slot) return;

    const bg = bgs[i] || 'mag-light';
    const isFeatured = mag.featured || i === 0;
    const badgeEn = (data.texts_en && data.texts_en.magazines && data.texts_en.magazines.badge) || 'Featured';

    slot.innerHTML = `
      <div class="mag-embed-section ${bg}">
        <div class="mag-embed-header">
          <div class="mag-embed-meta">
            <div class="mag-interlude-eyebrow">
              <span class="ei-line"></span>
              <span data-ar="مجلة تفاعلية" data-en="Interactive Magazine">مجلة تفاعلية</span>
            </div>
            ${isFeatured ? `<span class="magazine-badge" data-ar="${escapeHtml(badge)}" data-en="${escapeHtml(badgeEn)}">${escapeHtml(badge)}</span>` : ''}
          </div>
          ${mag.tag ? `<span class="magazine-tag${bg === 'mag-dark' ? ' tag-light' : ''}">${escapeHtml(mag.tag)}</span>` : ''}
          <h3 class="mag-embed-title">${escapeHtml(mag.title)}</h3>
          <p class="mag-embed-desc">${escapeHtml(mag.description || '')}</p>
        </div>

        <div class="mag-embed-frame-wrap">
          <iframe
            src="${escapeHtml(mag.embedUrl)}"
            loading="lazy"
            scrolling="no"
            allow="fullscreen"
            allowfullscreen
            title="${escapeHtml(mag.title)}"
          ></iframe>
        </div>

        <div class="mag-embed-footer">
          <a href="${escapeHtml(mag.embedUrl)}" target="_blank" rel="noopener" class="mag-fullscreen-btn">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
            </svg>
            <span data-ar="فتح بشاشة كاملة" data-en="Open Fullscreen">فتح بشاشة كاملة</span>
          </a>
        </div>
      </div>
    `;
  });
}

/* =========================================================
   Filters
   ========================================================= */
function renderFilters(data) {
  const wrap = document.getElementById('filters');
  if (!wrap) return;
  wrap.innerHTML = data.categories.map((c, i) => `
    <button class="filter-btn ${i === 0 ? 'active' : ''}" data-cat="${c.id}">${escapeHtml(c.label)}</button>
  `).join('');

  wrap.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.cat);
    });
  });
}

function applyFilter(catId) {
  const items = document.querySelectorAll('#gallery-grid .gallery-item');
  items.forEach(item => {
    const matches = catId === 'all' || item.dataset.category === catId;
    if (matches) {
      item.classList.remove('gallery-hidden');
      item.classList.remove('item-anim');
      // restart animation
      requestAnimationFrame(() => item.classList.add('item-anim'));
    } else {
      item.classList.add('gallery-hidden');
    }
  });
}

/* =========================================================
   Gallery grid
   ========================================================= */
function renderGallery(data) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = data.works.map(w => `
    <div class="gallery-item item-anim" data-work-id="${w.id}" data-category="${w.category}">
      <img src="${w.image}" alt="${escapeHtml(w.title)}" loading="lazy">
      <span class="gi-zoom">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
        </svg>
      </span>
      <div class="gi-overlay">
        <span class="gi-cat">${escapeHtml(categoryLabel(data, w.category))}</span>
        <h3 class="gi-title">${escapeHtml(w.title)}</h3>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = Number(item.dataset.workId);
      window.dispatchEvent(new CustomEvent('open-lightbox', { detail: { id } }));
    });
  });
}

/* =========================================================
   Events
   ========================================================= */
function renderEvents(data) {
  const wrap = document.getElementById('events-list');
  if (!wrap) return;
  if (!data.events || !data.events.length) {
    wrap.innerHTML = `<p class="text-center text-cream/60">قريبًا: تفاصيل الفعاليات والمعارض القادمة.</p>`;
    return;
  }
  wrap.innerHTML = data.events.map((ev, i) => `
    <div class="event-card" data-reveal data-reveal-delay="${i * 100}">
      <div class="ev-img">
        <img src="${ev.image}" alt="${escapeHtml(ev.title)}" loading="lazy">
      </div>
      <div class="ev-body">
        <span class="ev-date">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          ${escapeHtml(ev.date)} — ${escapeHtml(ev.location || '')}
        </span>
        <h3 class="font-serif text-2xl sm:text-3xl mb-2">${escapeHtml(ev.title)}</h3>
        <p class="text-cream/70 leading-relaxed">${escapeHtml(ev.description || '')}</p>
      </div>
    </div>
  `).join('');

  // newly injected reveal elements need observing
  initRevealAnimations();
}

/* =========================================================
   Quotes (auto-rotating)
   ========================================================= */
function renderQuotes(data) {
  const box = document.getElementById('quote-box');
  const dotsWrap = document.getElementById('quote-dots');
  if (!box || !data.quotes || !data.quotes.length) return;

  box.innerHTML = data.quotes.map((q, i) => `
    <div class="quote-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
      <p class="font-serif text-2xl sm:text-3xl italic leading-relaxed mb-4">"${escapeHtml(q.text)}"</p>
      <span class="text-gold font-medium tracking-widest text-sm">${escapeHtml(q.author || '')}</span>
    </div>
  `).join('');

  dotsWrap.innerHTML = data.quotes.map((_, i) => `
    <span class="quote-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
  `).join('');

  let current = 0;
  const slides = box.querySelectorAll('.quote-slide');
  const dots = dotsWrap.querySelectorAll('.quote-dot');

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => show(Number(dot.dataset.index)));
  });

  if (data.quotes.length > 1) {
    setInterval(() => {
      show((current + 1) % slides.length);
    }, 5500);
  }
}

/* =========================================================
   Scroll reveal animations
   ========================================================= */
let revealObserver;
function initRevealAnimations() {
  const elements = document.querySelectorAll('[data-reveal]:not(.is-observed)');
  if (!elements.length) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  }

  elements.forEach(el => {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
    el.classList.add('is-observed');
    revealObserver.observe(el);
  });
}

/* =========================================================
   Navigation behaviour
   ========================================================= */
function initNav() {
  const nav = document.getElementById('site-nav');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 20);
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      iconMenu.classList.toggle('hidden', isHidden);
      iconClose.classList.toggle('hidden', !isHidden);
    });
  }

  // close mobile menu on link click
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      iconMenu.classList.remove('hidden');
      iconClose.classList.add('hidden');
    });
  });

  // active link highlight
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(sec => sectionObserver.observe(sec));
}

/* =========================================================
   Lightbox
   ========================================================= */
function initLightbox(data) {
  const lightbox = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const catEl = document.getElementById('lightbox-category');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentIndex = 0;
  const works = data.works;

  function open(id) {
    const idx = works.findIndex(w => w.id === id);
    if (idx === -1) return;
    currentIndex = idx;
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const w = works[currentIndex];
    imgEl.src = w.image;
    imgEl.alt = w.title;
    titleEl.textContent = w.title;
    descEl.textContent = w.description || '';
    catEl.textContent = categoryLabel(data, w.category) + (w.year ? ' · ' + w.year : '');
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function next() {
    currentIndex = (currentIndex + 1) % works.length;
    render();
  }
  function prev() {
    currentIndex = (currentIndex - 1 + works.length) % works.length;
    render();
  }

  window.addEventListener('open-lightbox', (e) => open(e.detail.id));
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    // RTL layout: visually "next" arrow is on the left, "prev" on the right.
    if (e.key === 'ArrowLeft') next();
    if (e.key === 'ArrowRight') prev();
  });
}

/* =========================================================
   About — animated stats bar
   ========================================================= */
function renderStats(data) {
  const el = document.getElementById('about-stats');
  if (!el) return;
  const stats = [
    { num: '59+', ar: 'عمل فني',        en: 'Artworks' },
    { num: '12',  ar: 'تصنيف',           en: 'Categories' },
    { num: '4',   ar: 'معارض ومسابقات', en: 'Exhibitions' },
    { num: '4',   ar: 'مجلات تفاعلية',  en: 'Magazines' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="stat-item">
      <span class="stat-num">${s.num}</span>
      <span class="stat-label" data-ar="${s.ar}" data-en="${s.en}">${s.ar}</span>
    </div>
  `).join('');
}

/* =========================================================
   Language toggle — AR ↔ EN  (RTL ↔ LTR)
   ========================================================= */
function initLangToggle(data) {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  let lang = 'ar';

  function apply(l) {
    const html = document.documentElement;
    const isEn = l === 'en';
    html.setAttribute('dir',  isEn ? 'ltr' : 'rtl');
    html.setAttribute('lang', l);
    btn.textContent = isEn ? 'AR' : 'EN';
    btn.classList.toggle('lang-active', isEn);

    /* texts via data-text attributes */
    const texts = isEn ? (data.texts_en || data.texts) : data.texts;
    if (texts) {
      document.querySelectorAll('[data-text]').forEach(el => {
        const val = getPath(texts, el.dataset.text);
        if (val) el.textContent = val;
      });
    }

    /* artist-specific dynamic fields */
    const a = data.artist;
    setText('hero-role',     isEn ? (a.title_en    || a.title)    : a.title);
    setText('hero-tagline',  isEn ? (a.tagline_en  || a.tagline)  : a.tagline);
    setText('about-bio',     isEn ? (a.bio_en      || a.bio)      : a.bio);
    setText('about-location',isEn ? (a.location_en || a.location) : a.location);
    setText('hero-name-ar',  isEn ? '' : a.nameAr);
    if (texts && texts.about) setText('about-quote', texts.about.quote);

    /* all data-ar / data-en bilateral elements — skip elements with child elements to avoid destroying SVGs */
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      if (el.children.length > 0) return;
      const val = el.getAttribute('data-' + l);
      if (val !== null) el.textContent = val;
    });
  }

  btn.addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    apply(lang);
  });
}

/* =========================================================
   Hero — JS parallax on scroll
   ========================================================= */
function initHeroParallax() {
  const layer = document.getElementById('hero-parallax-layer');
  const hero  = document.getElementById('home');
  if (!layer || !hero) return;

  function update() {
    const y = window.scrollY;
    if (y > hero.offsetHeight * 1.2) return;
    layer.style.transform = `translateY(${y * 0.38}px)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* =========================================================
   Hero — sync portrait img with data.artist.photo
   ========================================================= */
function initHeroPortrait(data) {
  const el = document.getElementById('hero-portrait-img');
  if (el && data.artist && data.artist.photo) el.src = data.artist.photo;
}

/* =========================================================
   Misc
   ========================================================= */
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
