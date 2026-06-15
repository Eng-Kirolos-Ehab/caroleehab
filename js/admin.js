/* =========================================================
   لوحة التحكم — منطق التطبيق
   تتصل مباشرة بمستودع الموقع على GitHub عبر Contents API
   ========================================================= */

const GH_OWNER = 'Eng-Kirolos-Ehab';
const GH_REPO = 'caroleehab';
const GH_BRANCH = 'main';
const GH_API = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}`;
const GH_TOKEN_KEY = 'caroleehab_admin_gh_token';

let ghToken = null;
let contentSha = null;
let manifestSha = null;

let siteData = null;       // SITE_DATA object
let manifest = [];         // [{id, original, width, height, orientation}]
let contentHeader = '';    // الجزء التعليقي في بداية content.js

let pickerTarget = null;        // 'artist' | 'work' | 'event' | 'mg-cover' | 'pr-image' | null
let pendingWorkImage = null;    // images/work-xxx.jpg
let pendingEventImage = null;
let pendingMagazineCover = null;
let pendingProcessImage = null;

let editingWorkId = null;
let editingEventId = null;
let editingQuoteIndex = null;
let editingMagazineId = null;
let editingProcessId = null;

/* =========================================================
   Init
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-connect').addEventListener('click', connectGitHub);
  document.getElementById('btn-disconnect').addEventListener('click', disconnectGitHub);

  // tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // artist
  document.getElementById('btn-save-artist').addEventListener('click', saveArtist);
  document.getElementById('btn-pick-artist-photo').addEventListener('click', () => startPicking('artist'));
  document.getElementById('f-artist-photo-upload').addEventListener('change', (e) => handleUpload(e, 'artist'));

  // works
  document.getElementById('btn-add-work').addEventListener('click', submitWork);
  document.getElementById('btn-cancel-edit-work').addEventListener('click', () => cancelEdit('work'));
  document.getElementById('btn-pick-work-image').addEventListener('click', () => startPicking('work'));
  document.getElementById('w-image-upload').addEventListener('change', (e) => handleUpload(e, 'work'));

  // events
  document.getElementById('btn-add-event').addEventListener('click', submitEvent);
  document.getElementById('btn-cancel-edit-event').addEventListener('click', () => cancelEdit('event'));
  document.getElementById('btn-pick-event-image').addEventListener('click', () => startPicking('event'));
  document.getElementById('e-image-upload').addEventListener('change', (e) => handleUpload(e, 'event'));

  // quotes
  document.getElementById('btn-add-quote').addEventListener('click', submitQuote);
  document.getElementById('btn-cancel-edit-quote').addEventListener('click', () => cancelEdit('quote'));

  // categories
  document.getElementById('btn-add-category').addEventListener('click', submitCategory);

  // magazines
  document.getElementById('btn-add-magazine').addEventListener('click', submitMagazine);
  document.getElementById('btn-cancel-edit-magazine').addEventListener('click', () => cancelEdit('magazine'));
  document.getElementById('btn-pick-mg-cover').addEventListener('click', () => startPicking('mg-cover'));
  document.getElementById('mg-cover-upload').addEventListener('change', (e) => handleUpload(e, 'mg-cover'));

  // process
  document.getElementById('btn-add-process').addEventListener('click', submitProcess);
  document.getElementById('btn-cancel-edit-process').addEventListener('click', () => cancelEdit('process'));
  document.getElementById('btn-pick-pr-image').addEventListener('click', () => startPicking('pr-image'));
  document.getElementById('pr-image-upload').addEventListener('change', (e) => handleUpload(e, 'pr-image'));

  // picker banner cancel
  document.getElementById('btn-cancel-pick').addEventListener('click', stopPicking);

  // site texts
  document.getElementById('btn-save-texts').addEventListener('click', saveTexts);

  // auto-connect if a token was saved previously
  const savedToken = getToken();
  if (savedToken) {
    document.getElementById('gh-token-input').value = savedToken;
    connectGitHub();
  }
});

/* =========================================================
   GitHub API helpers
   ========================================================= */
function getToken() {
  return localStorage.getItem(GH_TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(GH_TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(GH_TOKEN_KEY);
}

// ترميز/فك ترميز base64 يدعم النصوص العربية (UTF-8) بشكل صحيح
function b64EncodeUtf8(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function b64DecodeUtf8(b64) {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))));
}

async function ghRequest(path, options = {}) {
  const res = await fetch(`${GH_API}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${ghToken}`,
      Accept: 'application/vnd.github+json',
      ...(options.headers || {})
    }
  });
  return res;
}

// يرجع { text, sha } أو { text: null, sha: null } لو الملف غير موجود
async function ghGetFile(path) {
  const res = await ghRequest(`contents/${path}?ref=${GH_BRANCH}`);
  if (res.status === 404) return { text: null, sha: null };
  if (!res.ok) throw new Error(`فشل تحميل ${path} (${res.status})`);
  const json = await res.json();
  return { text: b64DecodeUtf8(json.content), sha: json.sha };
}

// يحفظ ملف نصي (UTF-8) ويرجع الـ sha الجديد
async function ghPutFile(path, text, message, sha) {
  const body = { message, content: b64EncodeUtf8(text), branch: GH_BRANCH };
  if (sha) body.sha = sha;
  const res = await ghRequest(`contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `فشل حفظ ${path} (${res.status})`);
  }
  const json = await res.json();
  return json.content.sha;
}

// يحفظ ملف ثنائي (صورة) من base64 جاهز ويرجع الـ sha الجديد
async function ghPutBinary(path, base64Content, message, sha) {
  const body = { message, content: base64Content, branch: GH_BRANCH };
  if (sha) body.sha = sha;
  const res = await ghRequest(`contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `فشل رفع الصورة (${res.status})`);
  }
  const json = await res.json();
  return json.content.sha;
}

/* =========================================================
   Connection (GitHub token)
   ========================================================= */
async function connectGitHub() {
  const input = document.getElementById('gh-token-input');
  const token = input.value.trim();
  if (!token) {
    showToast('من فضلك أدخلي التوكن', true);
    return;
  }

  ghToken = token;
  try {
    await loadContentJs();
    await loadManifest();

    setToken(token);

    document.getElementById('app').classList.remove('hidden');
    document.getElementById('gh-connect-panel').classList.add('hidden');
    document.getElementById('btn-connect').classList.add('hidden');
    document.getElementById('btn-disconnect').classList.remove('hidden');

    const status = document.getElementById('conn-status');
    status.textContent = 'متصلة بـ GitHub ✓';
    status.classList.remove('bg-cream/10', 'text-cream/70');
    status.classList.add('bg-gold/20', 'text-gold2');

    renderAll();
    showToast('تم الاتصال بنجاح');
  } catch (err) {
    ghToken = null;
    console.error(err);
    showToast('فشل الاتصال: ' + err.message, true);
  }
}

function disconnectGitHub() {
  clearToken();
  ghToken = null;
  siteData = null;
  contentSha = null;
  manifestSha = null;

  document.getElementById('app').classList.add('hidden');
  document.getElementById('gh-connect-panel').classList.remove('hidden');
  document.getElementById('btn-connect').classList.remove('hidden');
  document.getElementById('btn-disconnect').classList.add('hidden');

  const status = document.getElementById('conn-status');
  status.textContent = 'غير متصلة';
  status.classList.add('bg-cream/10', 'text-cream/70');
  status.classList.remove('bg-gold/20', 'text-gold2');
}

/* =========================================================
   Content / manifest IO
   ========================================================= */
async function loadContentJs() {
  const { text, sha } = await ghGetFile('js/content.js');
  if (text === null) throw new Error('تعذر العثور على js/content.js في المستودع');

  const start = text.indexOf('const SITE_DATA');
  const objStart = text.indexOf('{', start);
  const objEnd = text.lastIndexOf('}');

  contentHeader = text.slice(0, start);
  const objStr = text.slice(objStart, objEnd + 1);

  // eslint-disable-next-line no-new-func
  siteData = new Function('return (' + objStr + ');')();
  contentSha = sha;
}

async function loadManifest() {
  const { text, sha } = await ghGetFile('manifest.json');
  manifest = text ? JSON.parse(text) : [];
  manifestSha = sha;
}

async function saveContent() {
  const json = JSON.stringify(siteData, null, 2);
  const text = contentHeader + 'const SITE_DATA = ' + json + ';\n';
  // إعادة جلب الـ sha الحالي لتجنب تعارض الإصدارات
  const current = await ghGetFile('js/content.js');
  contentSha = await ghPutFile('js/content.js', text, 'تحديث محتوى الموقع', current.sha);
}

async function saveManifest() {
  const text = JSON.stringify(manifest, null, 2);
  const current = await ghGetFile('manifest.json');
  manifestSha = await ghPutFile('manifest.json', text, 'تحديث مكتبة الصور', current.sha);
}

async function persist() {
  try {
    await saveContent();
    await saveManifest();
    showToast('تم الحفظ ✓ — التحديث سيظهر على الموقع خلال دقيقة');
  } catch (err) {
    console.error(err);
    showToast('فشل الحفظ: ' + err.message, true);
  }
}

/* =========================================================
   Tabs
   ========================================================= */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden', p.dataset.tabPanel !== tab));
}

/* =========================================================
   Render everything
   ========================================================= */
function renderAll() {
  renderArtist();
  renderCategorySelect();
  renderCategories();
  renderWorks();
  renderEvents();
  renderQuotes();
  renderMagazines();
  renderProcessAdmin();
  renderImageLibrary();
  renderTextsForm();
  renderSectionOrder();
}

/* =========================================================
   Artist tab
   ========================================================= */
function renderArtist() {
  const a = siteData.artist || {};
  setVal('f-artist-name', a.name);
  setVal('f-artist-nameAr', a.nameAr);
  setVal('f-artist-title', a.title);
  setVal('f-artist-location', a.location);
  setVal('f-artist-tagline', a.tagline);
  setVal('f-artist-bio', a.bio);
  setVal('f-artist-email', a.email);
  setVal('f-artist-instagram', a.social && a.social.instagram);
  setVal('f-artist-facebook', a.social && a.social.facebook);
  setVal('f-artist-behance', a.social && a.social.behance);

  const preview = document.getElementById('artist-photo-preview');
  if (a.photo) {
    preview.src = a.photo;
    preview.classList.remove('hidden');
  }
}

async function saveArtist() {
  siteData.artist = siteData.artist || {};
  const a = siteData.artist;
  a.name = getVal('f-artist-name');
  a.nameAr = getVal('f-artist-nameAr');
  a.title = getVal('f-artist-title');
  a.location = getVal('f-artist-location');
  a.tagline = getVal('f-artist-tagline');
  a.bio = getVal('f-artist-bio');
  a.email = getVal('f-artist-email');
  a.social = a.social || {};
  a.social.instagram = getVal('f-artist-instagram');
  a.social.facebook = getVal('f-artist-facebook');
  a.social.behance = getVal('f-artist-behance');
  if (pendingArtistImage) {
    a.photo = pendingArtistImage;
    pendingArtistImage = null;
  }
  await persist();
  renderImageLibrary();
}
let pendingArtistImage = null;

/* =========================================================
   Categories
   ========================================================= */
function renderCategorySelect() {
  const sel = document.getElementById('w-category');
  sel.innerHTML = siteData.categories
    .filter(c => c.id !== 'all')
    .map(c => `<option value="${escapeAttr(c.id)}">${escapeHtml(c.label)}</option>`)
    .join('');
}

function renderCategories() {
  const wrap = document.getElementById('categories-list-admin');
  wrap.innerHTML = siteData.categories.map((c, i) => `
    <div class="row-card">
      <div>
        <span class="font-semibold">${escapeHtml(c.label)}</span>
        <span class="text-ink2 text-sm"> — ${escapeHtml(c.id)}</span>
        ${c.id === 'all' ? '<span class="text-xs text-ink2"> (ثابت)</span>' : ''}
      </div>
      ${c.id !== 'all' ? `
      <div class="flex gap-2">
        <button class="btn-icon" data-action="edit-cat" data-index="${i}" aria-label="تعديل">
          ${iconEdit()}
        </button>
        <button class="btn-icon danger" data-action="delete-cat" data-index="${i}" aria-label="حذف">
          ${iconTrash()}
        </button>
      </div>` : ''}
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="delete-cat"]').forEach(btn => {
    btn.addEventListener('click', () => deleteCategory(Number(btn.dataset.index)));
  });
  wrap.querySelectorAll('[data-action="edit-cat"]').forEach(btn => {
    btn.addEventListener('click', () => editCategory(Number(btn.dataset.index)));
  });
}

async function submitCategory() {
  const id = getVal('c-id').trim();
  const label = getVal('c-label').trim();
  if (!id || !label) {
    showToast('من فضلك أدخلي المعرّف والاسم', true);
    return;
  }
  if (siteData.categories.some(c => c.id === id)) {
    showToast('هذا المعرّف مستخدم بالفعل', true);
    return;
  }
  siteData.categories.push({ id, label });
  setVal('c-id', '');
  setVal('c-label', '');
  renderCategories();
  renderCategorySelect();
  await persist();
}

function editCategory(index) {
  const cat = siteData.categories[index];
  const newLabel = prompt('الاسم الجديد للتصنيف:', cat.label);
  if (newLabel === null || !newLabel.trim()) return;
  cat.label = newLabel.trim();
  renderCategories();
  renderCategorySelect();
  renderWorks();
  persist();
}

async function deleteCategory(index) {
  const cat = siteData.categories[index];
  const inUse = siteData.works.some(w => w.category === cat.id);
  if (inUse) {
    showToast('لا يمكن حذف تصنيف مستخدم في أعمال موجودة', true);
    return;
  }
  if (!confirm(`حذف تصنيف "${cat.label}"؟`)) return;
  siteData.categories.splice(index, 1);
  renderCategories();
  renderCategorySelect();
  await persist();
}

/* =========================================================
   Works
   ========================================================= */
function renderWorks() {
  document.getElementById('works-count').textContent = siteData.works.length;
  const wrap = document.getElementById('works-list');
  const works = siteData.works;
  wrap.innerHTML = works.map((w, i) => `
    <div class="item-card">
      <div class="item-img"><img src="${w.image}" alt="${escapeAttr(w.title)}" loading="lazy"></div>
      <div class="item-body">
        <span class="item-meta">${escapeHtml(categoryLabel(w.category))}${w.year ? ' · ' + escapeHtml(w.year) : ''}${w.featured ? ' · مميز' : ''}</span>
        <h3 class="item-title">${escapeHtml(w.title)}</h3>
        <p class="item-desc">${escapeHtml(w.description || '')}</p>
        <div class="item-actions">
          <button class="btn-icon" data-action="move-up-work" data-id="${w.id}" aria-label="تحريك لأعلى" ${i === 0 ? 'disabled' : ''}>${iconUp()}</button>
          <button class="btn-icon" data-action="move-down-work" data-id="${w.id}" aria-label="تحريك لأسفل" ${i === works.length - 1 ? 'disabled' : ''}>${iconDown()}</button>
          <button class="btn-icon" data-action="edit-work" data-id="${w.id}" aria-label="تعديل">${iconEdit()}</button>
          <button class="btn-icon danger" data-action="delete-work" data-id="${w.id}" aria-label="حذف">${iconTrash()}</button>
        </div>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="edit-work"]').forEach(btn => {
    btn.addEventListener('click', () => startEditWork(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="delete-work"]').forEach(btn => {
    btn.addEventListener('click', () => deleteWork(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="move-up-work"]').forEach(btn => {
    btn.addEventListener('click', () => moveWork(Number(btn.dataset.id), -1));
  });
  wrap.querySelectorAll('[data-action="move-down-work"]').forEach(btn => {
    btn.addEventListener('click', () => moveWork(Number(btn.dataset.id), 1));
  });
}

function categoryLabel(catId) {
  const c = siteData.categories.find(c => c.id === catId);
  return c ? c.label : catId;
}

function startEditWork(id) {
  const w = siteData.works.find(w => w.id === id);
  if (!w) return;
  editingWorkId = id;
  setVal('w-title', w.title);
  setVal('w-category', w.category);
  setVal('w-year', w.year);
  setVal('w-description', w.description);
  document.getElementById('w-featured').checked = !!w.featured;
  pendingWorkImage = w.image;
  showPreview('w-image-preview', w.image);

  document.getElementById('btn-add-work').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-work').classList.remove('hidden');
  switchTab('works');
  document.querySelector('[data-tab-panel="works"]').scrollIntoView({ behavior: 'smooth' });
}

async function submitWork() {
  const title = getVal('w-title').trim();
  const category = getVal('w-category');
  const year = getVal('w-year').trim();
  const description = getVal('w-description').trim();
  const featured = document.getElementById('w-featured').checked;

  if (!title) { showToast('أدخلي عنوان العمل', true); return; }
  if (!pendingWorkImage) { showToast('اختاري صورة للعمل', true); return; }

  if (editingWorkId !== null) {
    const w = siteData.works.find(w => w.id === editingWorkId);
    Object.assign(w, { title, category, year, description, featured, image: pendingWorkImage });
  } else {
    const nextId = siteData.works.reduce((m, w) => Math.max(m, w.id), 0) + 1;
    siteData.works.push({ id: nextId, image: pendingWorkImage, title, category, year, description, featured });
  }

  resetWorkForm();
  renderWorks();
  renderImageLibrary();
  await persist();
}

function resetWorkForm() {
  editingWorkId = null;
  pendingWorkImage = null;
  setVal('w-title', '');
  setVal('w-year', '');
  setVal('w-description', '');
  document.getElementById('w-featured').checked = false;
  hidePreview('w-image-preview');
  document.getElementById('w-image-upload').value = '';
  document.getElementById('btn-add-work').textContent = 'إضافة العمل';
  document.getElementById('btn-cancel-edit-work').classList.add('hidden');
}

async function deleteWork(id) {
  const w = siteData.works.find(w => w.id === id);
  if (!confirm(`حذف العمل "${w.title}"؟`)) return;
  siteData.works = siteData.works.filter(w => w.id !== id);
  if (editingWorkId === id) resetWorkForm();
  renderWorks();
  renderImageLibrary();
  await persist();
}

/* =========================================================
   Events
   ========================================================= */
function renderEvents() {
  const wrap = document.getElementById('events-list-admin');
  const events = siteData.events;
  wrap.innerHTML = events.map((ev, i) => `
    <div class="item-card">
      <div class="item-img"><img src="${ev.image}" alt="${escapeAttr(ev.title)}" loading="lazy"></div>
      <div class="item-body">
        <span class="item-meta">${escapeHtml(ev.date)}${ev.location ? ' · ' + escapeHtml(ev.location) : ''}</span>
        <h3 class="item-title">${escapeHtml(ev.title)}</h3>
        <p class="item-desc">${escapeHtml(ev.description || '')}</p>
        <div class="item-actions">
          <button class="btn-icon" data-action="move-up-event" data-id="${ev.id}" aria-label="تحريك لأعلى" ${i === 0 ? 'disabled' : ''}>${iconUp()}</button>
          <button class="btn-icon" data-action="move-down-event" data-id="${ev.id}" aria-label="تحريك لأسفل" ${i === events.length - 1 ? 'disabled' : ''}>${iconDown()}</button>
          <button class="btn-icon" data-action="edit-event" data-id="${ev.id}" aria-label="تعديل">${iconEdit()}</button>
          <button class="btn-icon danger" data-action="delete-event" data-id="${ev.id}" aria-label="حذف">${iconTrash()}</button>
        </div>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="edit-event"]').forEach(btn => {
    btn.addEventListener('click', () => startEditEvent(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="delete-event"]').forEach(btn => {
    btn.addEventListener('click', () => deleteEvent(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="move-up-event"]').forEach(btn => {
    btn.addEventListener('click', () => moveEvent(Number(btn.dataset.id), -1));
  });
  wrap.querySelectorAll('[data-action="move-down-event"]').forEach(btn => {
    btn.addEventListener('click', () => moveEvent(Number(btn.dataset.id), 1));
  });
}

function startEditEvent(id) {
  const ev = siteData.events.find(e => e.id === id);
  if (!ev) return;
  editingEventId = id;
  setVal('e-title', ev.title);
  setVal('e-date', ev.date);
  setVal('e-location', ev.location);
  setVal('e-description', ev.description);
  pendingEventImage = ev.image;
  showPreview('e-image-preview', ev.image);

  document.getElementById('btn-add-event').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-event').classList.remove('hidden');
  switchTab('events');
}

async function submitEvent() {
  const title = getVal('e-title').trim();
  const date = getVal('e-date').trim();
  const location = getVal('e-location').trim();
  const description = getVal('e-description').trim();

  if (!title) { showToast('أدخلي عنوان الفعالية', true); return; }
  if (!pendingEventImage) { showToast('اختاري صورة للفعالية', true); return; }

  if (editingEventId !== null) {
    const ev = siteData.events.find(e => e.id === editingEventId);
    Object.assign(ev, { title, date, location, description, image: pendingEventImage });
  } else {
    const nextId = siteData.events.reduce((m, e) => Math.max(m, e.id), 0) + 1;
    siteData.events.push({ id: nextId, image: pendingEventImage, title, date, location, description });
  }

  resetEventForm();
  renderEvents();
  renderImageLibrary();
  await persist();
}

function resetEventForm() {
  editingEventId = null;
  pendingEventImage = null;
  setVal('e-title', '');
  setVal('e-date', '');
  setVal('e-location', '');
  setVal('e-description', '');
  hidePreview('e-image-preview');
  document.getElementById('e-image-upload').value = '';
  document.getElementById('btn-add-event').textContent = 'إضافة الفعالية';
  document.getElementById('btn-cancel-edit-event').classList.add('hidden');
}

async function deleteEvent(id) {
  const ev = siteData.events.find(e => e.id === id);
  if (!confirm(`حذف الفعالية "${ev.title}"؟`)) return;
  siteData.events = siteData.events.filter(e => e.id !== id);
  if (editingEventId === id) resetEventForm();
  renderEvents();
  renderImageLibrary();
  await persist();
}

/* =========================================================
   Quotes
   ========================================================= */
function renderQuotes() {
  const wrap = document.getElementById('quotes-list-admin');
  wrap.innerHTML = siteData.quotes.map((q, i) => `
    <div class="row-card">
      <div>
        <p class="font-serif text-lg italic">"${escapeHtml(q.text)}"</p>
        <span class="text-gold text-sm font-semibold">${escapeHtml(q.author || '')}</span>
      </div>
      <div class="flex gap-2">
        <button class="btn-icon" data-action="edit-quote" data-index="${i}" aria-label="تعديل">${iconEdit()}</button>
        <button class="btn-icon danger" data-action="delete-quote" data-index="${i}" aria-label="حذف">${iconTrash()}</button>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="edit-quote"]').forEach(btn => {
    btn.addEventListener('click', () => startEditQuote(Number(btn.dataset.index)));
  });
  wrap.querySelectorAll('[data-action="delete-quote"]').forEach(btn => {
    btn.addEventListener('click', () => deleteQuote(Number(btn.dataset.index)));
  });
}

function startEditQuote(index) {
  const q = siteData.quotes[index];
  editingQuoteIndex = index;
  setVal('q-text', q.text);
  setVal('q-author', q.author);
  document.getElementById('btn-add-quote').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-quote').classList.remove('hidden');
  switchTab('quotes');
}

async function submitQuote() {
  const text = getVal('q-text').trim();
  const author = getVal('q-author').trim();
  if (!text) { showToast('أدخلي نص الاقتباس', true); return; }

  if (editingQuoteIndex !== null) {
    siteData.quotes[editingQuoteIndex] = { text, author };
  } else {
    siteData.quotes.push({ text, author });
  }

  resetQuoteForm();
  renderQuotes();
  await persist();
}

function resetQuoteForm() {
  editingQuoteIndex = null;
  setVal('q-text', '');
  setVal('q-author', 'كارول');
  document.getElementById('btn-add-quote').textContent = 'إضافة الاقتباس';
  document.getElementById('btn-cancel-edit-quote').classList.add('hidden');
}

async function deleteQuote(index) {
  if (!confirm('حذف هذا الاقتباس؟')) return;
  siteData.quotes.splice(index, 1);
  if (editingQuoteIndex === index) resetQuoteForm();
  renderQuotes();
  await persist();
}

/* =========================================================
   Magazines (Flipbooks)
   ========================================================= */
function renderMagazines() {
  const wrap = document.getElementById('magazines-list-admin');
  const mags = siteData.magazines || [];
  wrap.innerHTML = mags.map((m, i) => `
    <div class="item-card">
      <div class="item-img"><img src="${m.cover}" alt="${escapeAttr(m.title)}" loading="lazy"></div>
      <div class="item-body">
        <span class="item-meta">${m.featured ? 'المجلة الأبرز' : 'مجلة'}</span>
        <h3 class="item-title">${escapeHtml(m.title)}</h3>
        <p class="item-desc">${escapeHtml(m.description || '')}</p>
        <p class="item-desc text-xs break-all">${escapeHtml(m.embedUrl)}</p>
        <div class="item-actions">
          <button class="btn-icon" data-action="move-up-magazine" data-id="${m.id}" aria-label="تحريك لأعلى" ${i === 0 ? 'disabled' : ''}>${iconUp()}</button>
          <button class="btn-icon" data-action="move-down-magazine" data-id="${m.id}" aria-label="تحريك لأسفل" ${i === mags.length - 1 ? 'disabled' : ''}>${iconDown()}</button>
          <button class="btn-icon" data-action="edit-magazine" data-id="${m.id}" aria-label="تعديل">${iconEdit()}</button>
          <button class="btn-icon danger" data-action="delete-magazine" data-id="${m.id}" aria-label="حذف">${iconTrash()}</button>
        </div>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="edit-magazine"]').forEach(btn => {
    btn.addEventListener('click', () => startEditMagazine(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="delete-magazine"]').forEach(btn => {
    btn.addEventListener('click', () => deleteMagazine(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="move-up-magazine"]').forEach(btn => {
    btn.addEventListener('click', () => moveMagazine(Number(btn.dataset.id), -1));
  });
  wrap.querySelectorAll('[data-action="move-down-magazine"]').forEach(btn => {
    btn.addEventListener('click', () => moveMagazine(Number(btn.dataset.id), 1));
  });
}

function startEditMagazine(id) {
  const m = (siteData.magazines || []).find(m => m.id === id);
  if (!m) return;
  editingMagazineId = id;
  setVal('mg-title', m.title);
  setVal('mg-description', m.description);
  setVal('mg-embed', m.embedUrl);
  document.getElementById('mg-featured').checked = !!m.featured;
  pendingMagazineCover = m.cover;
  showPreview('mg-cover-preview', m.cover);

  document.getElementById('btn-add-magazine').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-magazine').classList.remove('hidden');
  switchTab('magazines');
}

async function submitMagazine() {
  const title = getVal('mg-title').trim();
  const description = getVal('mg-description').trim();
  const embedUrl = getVal('mg-embed').trim();
  const featured = document.getElementById('mg-featured').checked;

  if (!title) { showToast('أدخلي عنوان المجلة', true); return; }
  if (!embedUrl) { showToast('أدخلي رابط الـ embed', true); return; }
  if (!pendingMagazineCover) { showToast('اختاري صورة غلاف للمجلة', true); return; }

  siteData.magazines = siteData.magazines || [];

  if (featured) {
    siteData.magazines.forEach(m => { m.featured = false; });
  }

  if (editingMagazineId !== null) {
    const m = siteData.magazines.find(m => m.id === editingMagazineId);
    Object.assign(m, { title, description, embedUrl, featured, cover: pendingMagazineCover });
  } else {
    const nextId = siteData.magazines.reduce((mx, m) => Math.max(mx, m.id), 0) + 1;
    siteData.magazines.push({ id: nextId, title, description, embedUrl, cover: pendingMagazineCover, featured });
  }

  resetMagazineForm();
  renderMagazines();
  renderImageLibrary();
  await persist();
}

function resetMagazineForm() {
  editingMagazineId = null;
  pendingMagazineCover = null;
  setVal('mg-title', '');
  setVal('mg-description', '');
  setVal('mg-embed', '');
  document.getElementById('mg-featured').checked = false;
  hidePreview('mg-cover-preview');
  document.getElementById('mg-cover-upload').value = '';
  document.getElementById('btn-add-magazine').textContent = 'إضافة المجلة';
  document.getElementById('btn-cancel-edit-magazine').classList.add('hidden');
}

async function deleteMagazine(id) {
  const m = (siteData.magazines || []).find(m => m.id === id);
  if (!confirm(`حذف المجلة "${m.title}"؟`)) return;
  siteData.magazines = siteData.magazines.filter(m => m.id !== id);
  if (editingMagazineId === id) resetMagazineForm();
  renderMagazines();
  renderImageLibrary();
  await persist();
}

/* =========================================================
   Creative Process (رحلة العمل)
   ========================================================= */
function renderProcessAdmin() {
  const wrap = document.getElementById('process-list-admin');
  const steps = siteData.process || [];
  wrap.innerHTML = steps.map((p, i) => `
    <div class="row-card">
      <div class="flex items-center gap-3">
        <img src="${p.image}" alt="${escapeAttr(p.title)}" class="w-16 h-16 object-cover rounded-lg border border-ink/10" loading="lazy">
        <div>
          <span class="text-gold text-sm font-semibold">المرحلة ${i + 1}</span>
          <h3 class="font-semibold">${escapeHtml(p.title)}</h3>
          <p class="item-desc">${escapeHtml(p.description || '')}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn-icon" data-action="move-up-process" data-id="${p.id}" aria-label="تحريك لأعلى" ${i === 0 ? 'disabled' : ''}>${iconUp()}</button>
        <button class="btn-icon" data-action="move-down-process" data-id="${p.id}" aria-label="تحريك لأسفل" ${i === steps.length - 1 ? 'disabled' : ''}>${iconDown()}</button>
        <button class="btn-icon" data-action="edit-process" data-id="${p.id}" aria-label="تعديل">${iconEdit()}</button>
        <button class="btn-icon danger" data-action="delete-process" data-id="${p.id}" aria-label="حذف">${iconTrash()}</button>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="edit-process"]').forEach(btn => {
    btn.addEventListener('click', () => startEditProcess(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="delete-process"]').forEach(btn => {
    btn.addEventListener('click', () => deleteProcess(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="move-up-process"]').forEach(btn => {
    btn.addEventListener('click', () => moveProcess(Number(btn.dataset.id), -1));
  });
  wrap.querySelectorAll('[data-action="move-down-process"]').forEach(btn => {
    btn.addEventListener('click', () => moveProcess(Number(btn.dataset.id), 1));
  });
}

function startEditProcess(id) {
  const p = (siteData.process || []).find(p => p.id === id);
  if (!p) return;
  editingProcessId = id;
  setVal('pr-title', p.title);
  setVal('pr-description', p.description);
  pendingProcessImage = p.image;
  showPreview('pr-image-preview', p.image);

  document.getElementById('btn-add-process').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-process').classList.remove('hidden');
  switchTab('process');
}

async function submitProcess() {
  const title = getVal('pr-title').trim();
  const description = getVal('pr-description').trim();

  if (!title) { showToast('أدخلي عنوان المرحلة', true); return; }
  if (!pendingProcessImage) { showToast('اختاري صورة للمرحلة', true); return; }

  siteData.process = siteData.process || [];

  if (editingProcessId !== null) {
    const p = siteData.process.find(p => p.id === editingProcessId);
    Object.assign(p, { title, description, image: pendingProcessImage });
  } else {
    const nextId = siteData.process.reduce((mx, p) => Math.max(mx, p.id), 0) + 1;
    siteData.process.push({ id: nextId, image: pendingProcessImage, title, description });
  }

  resetProcessForm();
  renderProcessAdmin();
  renderImageLibrary();
  await persist();
}

function resetProcessForm() {
  editingProcessId = null;
  pendingProcessImage = null;
  setVal('pr-title', '');
  setVal('pr-description', '');
  hidePreview('pr-image-preview');
  document.getElementById('pr-image-upload').value = '';
  document.getElementById('btn-add-process').textContent = 'إضافة المرحلة';
  document.getElementById('btn-cancel-edit-process').classList.add('hidden');
}

async function deleteProcess(id) {
  const p = (siteData.process || []).find(p => p.id === id);
  if (!confirm(`حذف المرحلة "${p.title}"؟`)) return;
  siteData.process = siteData.process.filter(p => p.id !== id);
  if (editingProcessId === id) resetProcessForm();
  renderProcessAdmin();
  renderImageLibrary();
  await persist();
}

function moveArrayItem(array, id, direction) {
  const index = array.findIndex(item => item.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= array.length) return false;
  [array[index], array[target]] = [array[target], array[index]];
  return true;
}

async function moveProcess(id, direction) {
  if (!moveArrayItem(siteData.process, id, direction)) return;
  renderProcessAdmin();
  await persist();
}

async function moveWork(id, direction) {
  if (!moveArrayItem(siteData.works, id, direction)) return;
  renderWorks();
  await persist();
}

async function moveEvent(id, direction) {
  if (!moveArrayItem(siteData.events, id, direction)) return;
  renderEvents();
  await persist();
}

async function moveMagazine(id, direction) {
  if (!moveArrayItem(siteData.magazines, id, direction)) return;
  renderMagazines();
  await persist();
}

/* =========================================================
   Site texts
   ========================================================= */
const TEXT_DEFAULTS = {
  nav: { home: 'الرئيسية', about: 'عن الفنانة', gallery: 'الأعمال', process: 'رحلة العمل', magazines: 'المجلات', events: 'الفعاليات', contact: 'تواصل' },
  hero: { ctaPrimary: 'استعرضي الأعمال', ctaSecondary: 'تعرفي عليها' },
  about: { eyebrow: 'عن الفنانة', heading: 'رحلة بين الخط واللون والخامة', quote: 'بحب إن كل تفصيلة صغيرة في شغلي تحمل جزء من إحساسي.' },
  featured: { eyebrow: 'مختارات', heading: 'أعمال مميزة' },
  process: { eyebrow: 'كيف تولد اللوحة', heading: 'رحلة العمل', description: 'من أول فكرة في الدماغ، لحد ما توصل اللوحة لشكلها النهائي — كل مرحلة ليها حكايتها.' },
  gallery: { eyebrow: 'المعرض', heading: 'كل الأعمال', description: 'تصفّحي مختلف الأعمال حسب التصنيف، واضغطي على أي عمل لمشاهدته بحجم أكبر.' },
  magazineBanner: { title: 'مجلتي الفنية التفاعلية', description: 'اقلبي الصفحات بنفسك واستكشفي أعمالي في شكل مجلة كاملة' },
  magazines: { eyebrow: 'مجلات تفاعلية', heading: 'تصفّحي مجلاتي الفنية', description: 'اقلبي الصفحات بنفسك واستكشفي مجموعة من أعمالي وتصاميمي في شكل مجلة تفاعلية كاملة.', badge: 'المجلة الأبرز', openLink: 'فتح في صفحة كاملة ↗' },
  events: { eyebrow: 'الفعاليات', heading: 'المعارض والفعاليات' },
  footer: { eyebrow: 'تواصل', heading: 'يلا نتكلم عن فكرتك', description: 'لأي تعاون فني، طلب عمل خاص، أو دعوة لمعرض — تقدري تتواصلي معايا من خلال:', contactButton: 'راسليني', note: 'جميع الحقوق محفوظة' }
};

function renderTextsForm() {
  const texts = siteData.texts || {};
  Object.keys(TEXT_DEFAULTS).forEach(section => {
    Object.keys(TEXT_DEFAULTS[section]).forEach(key => {
      const el = document.getElementById(`tx-${section}-${key}`);
      if (!el) return;
      const current = texts[section] && texts[section][key];
      el.value = current !== undefined ? current : TEXT_DEFAULTS[section][key];
    });
  });
}

async function saveTexts() {
  siteData.texts = siteData.texts || {};
  Object.keys(TEXT_DEFAULTS).forEach(section => {
    siteData.texts[section] = siteData.texts[section] || {};
    Object.keys(TEXT_DEFAULTS[section]).forEach(key => {
      const el = document.getElementById(`tx-${section}-${key}`);
      if (!el) return;
      siteData.texts[section][key] = el.value;
    });
  });
  await persist();
}

/* =========================================================
   Section order
   ========================================================= */
const SECTION_LABELS = {
  about: 'عن الفنانة',
  featured: 'أعمال مميزة',
  process: 'رحلة العمل',
  gallery: 'المعرض / كل الأعمال',
  magazines: 'المجلات التفاعلية',
  events: 'الفعاليات',
  quotes: 'الاقتباسات'
};

function renderSectionOrder() {
  const wrap = document.getElementById('section-order-list');
  const order = siteData.sectionOrder || [];
  wrap.innerHTML = order.map((id, i) => `
    <div class="row-card">
      <div class="flex items-center gap-3">
        <span class="text-gold text-sm font-semibold">${i + 1}</span>
        <h3 class="font-semibold">${escapeHtml(SECTION_LABELS[id] || id)}</h3>
      </div>
      <div class="flex gap-2">
        <button class="btn-icon" data-action="move-up-section" data-id="${id}" aria-label="تحريك لأعلى" ${i === 0 ? 'disabled' : ''}>${iconUp()}</button>
        <button class="btn-icon" data-action="move-down-section" data-id="${id}" aria-label="تحريك لأسفل" ${i === order.length - 1 ? 'disabled' : ''}>${iconDown()}</button>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="move-up-section"]').forEach(btn => {
    btn.addEventListener('click', () => moveSection(btn.dataset.id, -1));
  });
  wrap.querySelectorAll('[data-action="move-down-section"]').forEach(btn => {
    btn.addEventListener('click', () => moveSection(btn.dataset.id, 1));
  });
}

async function moveSection(id, direction) {
  const order = siteData.sectionOrder || [];
  const index = order.indexOf(id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= order.length) return;
  [order[index], order[target]] = [order[target], order[index]];
  renderSectionOrder();
  await persist();
}

/* =========================================================
   Generic cancel-edit
   ========================================================= */
function cancelEdit(kind) {
  if (kind === 'work') resetWorkForm();
  if (kind === 'event') resetEventForm();
  if (kind === 'quote') resetQuoteForm();
  if (kind === 'magazine') resetMagazineForm();
  if (kind === 'process') resetProcessForm();
}

/* =========================================================
   Image library + picking
   ========================================================= */
function usedImagePaths() {
  const used = new Set();
  siteData.works.forEach(w => used.add(w.image));
  siteData.events.forEach(e => used.add(e.image));
  (siteData.magazines || []).forEach(m => used.add(m.cover));
  (siteData.process || []).forEach(p => used.add(p.image));
  if (siteData.artist && siteData.artist.photo) used.add(siteData.artist.photo);
  return used;
}

function renderImageLibrary() {
  const wrap = document.getElementById('image-library');
  document.getElementById('library-count').textContent = manifest.length;
  const used = usedImagePaths();

  wrap.innerHTML = manifest.map(m => {
    const path = 'images/' + m.id;
    const isUsed = used.has(path);
    return `<div class="lib-item ${isUsed ? 'used' : ''}" data-path="${escapeAttr(path)}">
      <img src="${path}" alt="${escapeAttr(m.original)}" loading="lazy">
    </div>`;
  }).join('');

  wrap.querySelectorAll('.lib-item').forEach(el => {
    el.addEventListener('click', () => onLibraryPick(el.dataset.path));
  });
}

function startPicking(target) {
  pickerTarget = target;
  const labels = {
    artist: 'صورة الفنانة',
    work: 'صورة العمل الجديد',
    event: 'صورة الفعالية',
    'mg-cover': 'صورة غلاف المجلة',
    'pr-image': 'صورة مرحلة رحلة العمل'
  };
  document.getElementById('library-picker-text').textContent = `اضغطي على صورة لاختيارها لـ: ${labels[target]}`;
  document.getElementById('library-picker-banner').classList.remove('hidden');
  switchTab('works');
  document.getElementById('image-library').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function stopPicking() {
  pickerTarget = null;
  document.getElementById('library-picker-banner').classList.add('hidden');
}

function onLibraryPick(path) {
  if (!pickerTarget) return;
  if (pickerTarget === 'artist') {
    pendingArtistImage = path;
    showPreview('artist-photo-preview', path, false);
  } else if (pickerTarget === 'work') {
    pendingWorkImage = path;
    showPreview('w-image-preview', path);
  } else if (pickerTarget === 'event') {
    pendingEventImage = path;
    showPreview('e-image-preview', path);
  } else if (pickerTarget === 'mg-cover') {
    pendingMagazineCover = path;
    showPreview('mg-cover-preview', path);
  } else if (pickerTarget === 'pr-image') {
    pendingProcessImage = path;
    showPreview('pr-image-preview', path);
  }
  stopPicking();
  showToast('تم اختيار الصورة');
}

/* =========================================================
   Image upload (resize + write to images/ + manifest)
   ========================================================= */
async function handleUpload(e, target) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    showToast('جاري رفع الصورة…');
    const path = await addImageToLibrary(file);
    if (target === 'artist') {
      pendingArtistImage = path;
      showPreview('artist-photo-preview', path, false);
    } else if (target === 'work') {
      pendingWorkImage = path;
      showPreview('w-image-preview', path);
    } else if (target === 'event') {
      pendingEventImage = path;
      showPreview('e-image-preview', path);
    } else if (target === 'mg-cover') {
      pendingMagazineCover = path;
      showPreview('mg-cover-preview', path);
    } else if (target === 'pr-image') {
      pendingProcessImage = path;
      showPreview('pr-image-preview', path);
    }
    renderImageLibrary();
    showToast('تم رفع الصورة ✓');
  } catch (err) {
    console.error(err);
    showToast('فشل رفع الصورة: ' + err.message, true);
  }
}

function resizeImageFile(file, maxDim = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (Math.max(width, height) > maxDim) {
        const ratio = maxDim / Math.max(width, height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) { reject(new Error('تعذر تحويل الصورة')); return; }
        resolve({ blob, width, height });
      }, 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('تعذر تحميل الصورة')); };
    img.src = url;
  });
}

function nextWorkImageName() {
  let max = 0;
  manifest.forEach(m => {
    const match = m.id.match(/^work-(\d+)\.jpg$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  const next = max + 1;
  return 'work-' + String(next).padStart(3, '0') + '.jpg';
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('تعذرت قراءة الصورة'));
    reader.readAsDataURL(blob);
  });
}

async function addImageToLibrary(file) {
  const { blob, width, height } = await resizeImageFile(file);
  const name = nextWorkImageName();
  const base64 = await blobToBase64(blob);
  await ghPutBinary('images/' + name, base64, 'إضافة صورة جديدة: ' + name);

  manifest.push({
    id: name,
    original: file.name,
    width, height,
    orientation: width > height ? 'landscape' : (height > width ? 'portrait' : 'square')
  });

  return 'images/' + name;
}

/* =========================================================
   Small helpers
   ========================================================= */
function getVal(id) { return document.getElementById(id).value; }
function setVal(id, value) { document.getElementById(id).value = value || ''; }

function showPreview(id, src, withClass = true) {
  const el = document.getElementById(id);
  el.src = src;
  if (withClass) el.classList.remove('hidden');
}
function hidePreview(id) {
  const el = document.getElementById(id);
  el.src = '';
  el.classList.add('hidden');
}

let toastTimer = null;
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function iconEdit() {
  return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>`;
}
function iconTrash() {
  return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>`;
}
function iconUp() {
  return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>`;
}
function iconDown() {
  return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>`;
}
