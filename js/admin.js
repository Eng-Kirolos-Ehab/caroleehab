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
let manifestDirty = false; // بيتغير لـ true لما مكتبة الصور نفسها تتعدل (رفع صورة جديدة)
let contentHeader = '';    // الجزء التعليقي في بداية content.js

let pickerTarget = null;        // 'artist' | 'work' | 'event' | 'mg-cover' | 'pr-image' | 'sh-main' | 'sh-sub' | ... | null
let pendingWorkImage = null;    // images/work-xxx.jpg
let pendingEventImage = null;
let pendingMagazineCover = null;
let pendingProcessImage = null;
let pendingShowcaseMainImage = null;
let pendingShowcaseSubImages = [];

let quickEditWorkId = null;   // work id currently open in the quick-edit modal
let pendingWorkModalImage = null;

let quickEditShowcaseId = null;
let pendingShowcaseModalMainImage = null;
let pendingShowcaseModalSubImages = [];

let positionEditingPath = null;
let pendingImagePosition = { x: 50, y: 50 };

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
  document.getElementById('btn-pick-artist-about-photo').addEventListener('click', () => startPicking('artist-about'));
  document.getElementById('f-artist-about-photo-upload').addEventListener('change', (e) => handleUpload(e, 'artist-about'));

  // works
  document.getElementById('btn-add-work').addEventListener('click', submitWork);
  document.getElementById('btn-pick-work-image').addEventListener('click', () => startPicking('work'));
  document.getElementById('w-image-upload').addEventListener('change', (e) => handleUpload(e, 'work'));

  // work quick-edit modal
  document.getElementById('btn-close-work-modal').addEventListener('click', closeWorkModal);
  document.getElementById('btn-cancel-work-modal').addEventListener('click', closeWorkModal);
  document.getElementById('btn-save-work-modal').addEventListener('click', saveWorkModal);
  document.getElementById('btn-delete-work-modal').addEventListener('click', deleteWorkFromModal);
  document.querySelector('#work-modal .work-modal-backdrop').addEventListener('click', closeWorkModal);
  document.getElementById('btn-pick-work-modal-image').addEventListener('click', () => {
    hideModal('work-modal');
    startPicking('work-modal', 'work-modal');
  });
  document.getElementById('wm-image-upload').addEventListener('change', (e) => handleUpload(e, 'work-modal'));

  // showcase sections
  document.getElementById('btn-add-showcase').addEventListener('click', submitShowcase);
  document.getElementById('btn-pick-sh-main-image').addEventListener('click', () => startPicking('sh-main'));
  document.getElementById('sh-main-image-upload').addEventListener('change', (e) => handleUpload(e, 'sh-main'));
  document.getElementById('btn-pick-sh-sub-image').addEventListener('click', () => startPicking('sh-sub'));
  document.getElementById('sh-sub-image-upload').addEventListener('change', (e) => handleUpload(e, 'sh-sub'));

  // showcase quick-edit modal
  document.getElementById('btn-close-showcase-modal').addEventListener('click', closeShowcaseModal);
  document.getElementById('btn-cancel-showcase-modal').addEventListener('click', closeShowcaseModal);
  document.getElementById('btn-save-showcase-modal').addEventListener('click', saveShowcaseModal);
  document.getElementById('btn-delete-showcase-modal').addEventListener('click', deleteShowcaseFromModal);
  document.querySelector('#showcase-modal .showcase-modal-backdrop').addEventListener('click', closeShowcaseModal);
  document.getElementById('btn-pick-shm-main-image').addEventListener('click', () => {
    hideModal('showcase-modal');
    startPicking('shm-main', 'showcase-modal');
  });
  document.getElementById('shm-main-image-upload').addEventListener('change', (e) => handleUpload(e, 'shm-main'));
  document.getElementById('btn-pick-shm-sub-image').addEventListener('click', () => {
    hideModal('showcase-modal');
    startPicking('shm-sub', 'showcase-modal');
  });
  document.getElementById('shm-sub-image-upload').addEventListener('change', (e) => handleUpload(e, 'shm-sub'));

  // image position editor
  document.getElementById('ip-click-area').addEventListener('click', setPositionFromEvent);
  document.getElementById('btn-close-position-modal').addEventListener('click', closePositionModal);
  document.getElementById('btn-cancel-position').addEventListener('click', closePositionModal);
  document.getElementById('btn-reset-position').addEventListener('click', resetImagePosition);
  document.getElementById('btn-save-position').addEventListener('click', saveImagePosition);
  document.querySelector('#image-position-modal .image-position-backdrop').addEventListener('click', closePositionModal);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('work-modal').classList.contains('hidden')) closeWorkModal();
    if (!document.getElementById('showcase-modal').classList.contains('hidden')) closeShowcaseModal();
    if (!document.getElementById('image-position-modal').classList.contains('hidden')) closePositionModal();
  });

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
  const bust = Date.now();
  const res = await ghRequest(`contents/${path}?ref=${GH_BRANCH}&_=${bust}`);
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
    const error = new Error(err.message || `فشل حفظ ${path} (${res.status})`);
    error.status = res.status;
    throw error;
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
  siteData.showcases = siteData.showcases || [];
  siteData.imagePosition = siteData.imagePosition || {};
  siteData.sectionOrder = siteData.sectionOrder || [];
  contentSha = sha;
  snapshotSiteData();
}

async function loadManifest() {
  const { text, sha } = await ghGetFile('manifest.json');
  manifest = text ? JSON.parse(text) : [];
  manifestSha = sha;
}

// تكتب الملف بالـ sha المحفوظ محليًا (بدون إعادة تحميل الملف أولًا لتوفير وقت الحفظ)
// ولو الـ sha بقى قديم (409) بتجيب النسخة الحالية وتعيد المحاولة مرة واحدة فقط
async function ghPutFileFast(path, text, message, getSha, setSha) {
  try {
    setSha(await ghPutFile(path, text, message, getSha()));
  } catch (err) {
    if (err.status !== 409) throw err;
    const current = await ghGetFile(path);
    setSha(await ghPutFile(path, text, message, current.sha));
  }
}

/* =========================================================
   دمج آمن للتعديلات — يمنع إن حفظة من حد يمسح تعديل حد تاني
   بيقارن نسخة السيرفر الحالية بالنسخة اللي كانت عندنا وقت التحميل
   (originalSiteDataSnapshot) عشان يعرف احنا فعلاً عدّلنا إيه بس،
   وياخد كل حاجة تانية من نسخة السيرفر الطازة
   ========================================================= */
let originalSiteDataSnapshot = null;

function snapshotSiteData() {
  originalSiteDataSnapshot = JSON.parse(JSON.stringify(siteData));
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function orderChanged(originalArr, localArr) {
  const localIds = new Set(localArr.map(x => x.id));
  const oIds = originalArr.filter(x => localIds.has(x.id)).map(x => x.id);
  const originalIds = new Set(originalArr.map(x => x.id));
  const lIds = localArr.filter(x => originalIds.has(x.id)).map(x => x.id);
  return !deepEqual(oIds, lIds);
}

// بيدمج مصفوفة عناصر ليها id — تعديل/إضافة/حذف محلي بيتحفظ، وأي حاجة
// حد تاني ضافها أو عدّلها على السيرفر ومكناش عارفينها بتتحفظ برضو
function mergeArrayById(remoteArr, originalArr, localArr) {
  remoteArr = remoteArr || []; originalArr = originalArr || []; localArr = localArr || [];
  const originalIds = new Set(originalArr.map(x => x.id));
  const localIds = new Set(localArr.map(x => x.id));
  const localById = new Map(localArr.map(x => [x.id, x]));
  const remoteById = new Map(remoteArr.map(x => [x.id, x]));
  const originalById = new Map(originalArr.map(x => [x.id, x]));

  const useLocalOrder = orderChanged(originalArr, localArr);
  const baseOrderArr = useLocalOrder ? localArr : remoteArr;

  const result = [];
  const placed = new Set();

  baseOrderArr.forEach(item => {
    const id = item.id;
    if (placed.has(id)) return;
    if (localIds.has(id)) {
      if (!remoteById.has(id)) {
        if (!originalIds.has(id)) { result.push(localById.get(id)); placed.add(id); }
        return; // كان موجود وحد تاني مسحه من السيرفر — نحترم مسحه
      }
      const localItem = localById.get(id);
      const changed = !deepEqual(localItem, originalById.get(id) || null);
      result.push(changed ? localItem : remoteById.get(id));
      placed.add(id);
    } else if (!originalIds.has(id) && remoteById.has(id)) {
      result.push(remoteById.get(id)); // حد تاني ضافه — نحتفظ بيه
      placed.add(id);
    }
    // موجود أصلًا وإحنا مسحناه محليًا — نتجاهله (نحترم الحذف بتاعنا)
  });

  // عناصر حد تاني ضافها على السيرفر ومكناش عارفينها (لو مش ملحقين وقت الترتيب اللي فوق)
  remoteArr.forEach(item => {
    if (!placed.has(item.id) && !originalIds.has(item.id)) {
      result.push(item);
      placed.add(item.id);
    }
  });

  // عناصر إحنا ضفناها محليًا ومش موجودة في السيرفر أصلًا (نفس الحالة)
  localArr.forEach(item => {
    if (!placed.has(item.id) && !originalIds.has(item.id)) {
      result.push(item);
      placed.add(item.id);
    }
  });

  return result;
}

function mergeStringArray(remoteArr, originalArr, localArr) {
  remoteArr = remoteArr || []; originalArr = originalArr || []; localArr = localArr || [];
  const originalSet = new Set(originalArr);
  const localSet = new Set(localArr);
  const reordered = !deepEqual(originalArr.filter(x => localSet.has(x)), localArr.filter(x => originalSet.has(x)));
  const base = reordered ? localArr : remoteArr;

  const result = [];
  const placed = new Set();
  base.forEach(id => {
    if (placed.has(id)) return;
    if (localSet.has(id)) { result.push(id); placed.add(id); }
  });
  remoteArr.forEach(id => {
    if (!placed.has(id) && !originalSet.has(id)) { result.push(id); placed.add(id); }
  });
  localArr.forEach(id => {
    if (!placed.has(id) && !originalSet.has(id)) { result.push(id); placed.add(id); }
  });
  return result;
}

function mergeKeyedObject(remoteObj, originalObj, localObj) {
  remoteObj = remoteObj || {}; originalObj = originalObj || {}; localObj = localObj || {};
  const result = { ...remoteObj };
  Object.keys(localObj).forEach(k => {
    if (!deepEqual(localObj[k], originalObj[k])) result[k] = localObj[k];
  });
  Object.keys(originalObj).forEach(k => {
    if (!(k in localObj) && (k in result)) delete result[k];
  });
  return result;
}

function mergeScalarObject(remoteObj, originalObj, localObj) {
  return deepEqual(localObj, originalObj) ? remoteObj : localObj;
}

function mergeSiteData(remoteData, originalData, localData) {
  const merged = { ...remoteData };
  merged.works = mergeArrayById(remoteData.works, originalData.works, localData.works);
  merged.events = mergeArrayById(remoteData.events, originalData.events, localData.events);
  merged.magazines = mergeArrayById(remoteData.magazines, originalData.magazines, localData.magazines);
  merged.process = mergeArrayById(remoteData.process, originalData.process, localData.process);
  merged.showcases = mergeArrayById(remoteData.showcases, originalData.showcases, localData.showcases);
  merged.categories = mergeArrayById(remoteData.categories, originalData.categories, localData.categories);
  merged.quotes = deepEqual(localData.quotes, originalData.quotes) ? remoteData.quotes : localData.quotes;
  merged.sectionOrder = mergeStringArray(remoteData.sectionOrder, originalData.sectionOrder, localData.sectionOrder);
  merged.imageMeta = mergeKeyedObject(remoteData.imageMeta, originalData.imageMeta, localData.imageMeta);
  merged.imagePosition = mergeKeyedObject(remoteData.imagePosition, originalData.imagePosition, localData.imagePosition);
  merged.artist = mergeScalarObject(remoteData.artist, originalData.artist, localData.artist);
  merged.texts = mergeScalarObject(remoteData.texts, originalData.texts, localData.texts);
  merged.texts_en = mergeScalarObject(remoteData.texts_en, originalData.texts_en, localData.texts_en);
  return merged;
}

async function saveContent() {
  const current = await ghGetFile('js/content.js');
  if (current.text !== null && originalSiteDataSnapshot) {
    const rStart = current.text.indexOf('const SITE_DATA');
    const rObjStart = current.text.indexOf('{', rStart);
    const rObjEnd = current.text.lastIndexOf('}');
    // eslint-disable-next-line no-new-func
    const remoteData = new Function('return (' + current.text.slice(rObjStart, rObjEnd + 1) + ');')();
    siteData = mergeSiteData(remoteData, originalSiteDataSnapshot, siteData);
  }
  const json = JSON.stringify(siteData, null, 2);
  const text = contentHeader + 'const SITE_DATA = ' + json + ';\n';
  contentSha = await ghPutFile('js/content.js', text, 'تحديث محتوى الموقع', current.sha);
  snapshotSiteData();
}

async function saveManifest() {
  const text = JSON.stringify(manifest, null, 2);
  await ghPutFileFast('manifest.json', text, 'تحديث مكتبة الصور', () => manifestSha, (sha) => { manifestSha = sha; });
  manifestDirty = false;
}

async function persist() {
  try {
    await saveContent();
    if (manifestDirty) await saveManifest();
    renderAll(); // نعيد الرسم لأن الدمج ممكن يكون جاب تعديلات حد تاني مكناش شايفينها
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
  renderShowcases();
  renderImageLibrary();
  renderTextsForm();
  renderTextsFormEn();
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
  setVal('f-artist-title-en', a.title_en);
  setVal('f-artist-location', a.location);
  setVal('f-artist-location-en', a.location_en);
  setVal('f-artist-tagline', a.tagline);
  setVal('f-artist-tagline-en', a.tagline_en);
  setVal('f-artist-bio', a.bio);
  setVal('f-artist-bio-en', a.bio_en);
  setVal('f-artist-email', a.email);
  setVal('f-artist-instagram', a.social && a.social.instagram);
  setVal('f-artist-facebook', a.social && a.social.facebook);
  setVal('f-artist-behance', a.social && a.social.behance);

  const preview = document.getElementById('artist-photo-preview');
  if (a.photo) {
    preview.src = a.photo;
    preview.classList.remove('hidden');
  }
  const aboutPreview = document.getElementById('artist-about-photo-preview');
  if (a.aboutPhoto) {
    aboutPreview.src = a.aboutPhoto;
    aboutPreview.classList.remove('hidden');
  }
}

async function saveArtist() {
  siteData.artist = siteData.artist || {};
  const a = siteData.artist;
  a.name = getVal('f-artist-name');
  a.nameAr = getVal('f-artist-nameAr');
  a.title = getVal('f-artist-title');
  a.title_en = getVal('f-artist-title-en');
  a.location = getVal('f-artist-location');
  a.location_en = getVal('f-artist-location-en');
  a.tagline = getVal('f-artist-tagline');
  a.tagline_en = getVal('f-artist-tagline-en');
  a.bio = getVal('f-artist-bio');
  a.bio_en = getVal('f-artist-bio-en');
  a.email = getVal('f-artist-email');
  a.social = a.social || {};
  a.social.instagram = getVal('f-artist-instagram');
  a.social.facebook = getVal('f-artist-facebook');
  a.social.behance = getVal('f-artist-behance');
  if (pendingArtistImage) {
    a.photo = pendingArtistImage;
    pendingArtistImage = null;
  }
  if (pendingArtistAboutImage) {
    a.aboutPhoto = pendingArtistAboutImage;
    pendingArtistAboutImage = null;
  }
  await persist();
  renderImageLibrary();
}
let pendingArtistImage = null;
let pendingArtistAboutImage = null;

/* =========================================================
   Categories
   ========================================================= */
function renderCategorySelect() {
  const options = siteData.categories
    .filter(c => c.id !== 'all')
    .map(c => `<option value="${escapeAttr(c.id)}">${escapeHtml(c.label)}</option>`)
    .join('');
  document.getElementById('w-category').innerHTML = options;
  const wmSel = document.getElementById('wm-category');
  if (wmSel) wmSel.innerHTML = options;
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
  const label_en = getVal('c-label-en').trim();
  if (!id || !label) {
    showToast('من فضلك أدخلي المعرّف والاسم', true);
    return;
  }
  if (siteData.categories.some(c => c.id === id)) {
    showToast('هذا المعرّف مستخدم بالفعل', true);
    return;
  }
  siteData.categories.push({ id, label, label_en });
  setVal('c-id', '');
  setVal('c-label', '');
  setVal('c-label-en', '');
  renderCategories();
  renderCategorySelect();
  await persist();
}

function editCategory(index) {
  const cat = siteData.categories[index];
  const newLabel = prompt('الاسم الجديد للتصنيف:', cat.label);
  if (newLabel === null || !newLabel.trim()) return;
  const newLabelEn = prompt('English category name:', cat.label_en || '');
  cat.label = newLabel.trim();
  if (newLabelEn !== null) cat.label_en = newLabelEn.trim();
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
    <div class="item-card" draggable="true" data-drag-id="${w.id}">
      <span class="item-drag-handle" aria-hidden="true">${iconDrag()}</span>
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
    btn.addEventListener('click', () => openWorkModal(Number(btn.dataset.id)));
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

  enableCardDrag(wrap, '.item-card', (draggedId, targetId) => reorderById(siteData.works, draggedId, targetId, renderWorks));
}

function categoryLabel(catId) {
  const c = siteData.categories.find(c => c.id === catId);
  return c ? c.label : catId;
}

function openWorkModal(id) {
  const w = siteData.works.find(w => w.id === id);
  if (!w) return;
  quickEditWorkId = id;
  setVal('wm-title', w.title);
  setVal('wm-title-en', w.title_en);
  setVal('wm-category', w.category);
  setVal('wm-year', w.year);
  setVal('wm-description', w.description);
  setVal('wm-description-en', w.description_en);
  document.getElementById('wm-featured').checked = !!w.featured;
  pendingWorkModalImage = w.image;
  showPreview('wm-image-preview', w.image, false);
  showModal('work-modal');
}

function closeWorkModal() {
  quickEditWorkId = null;
  pendingWorkModalImage = null;
  hideModal('work-modal');
}

async function saveWorkModal() {
  const w = siteData.works.find(w => w.id === quickEditWorkId);
  if (!w) return;
  const title = getVal('wm-title').trim();
  const title_en = getVal('wm-title-en').trim();
  const category = getVal('wm-category');
  const year = getVal('wm-year').trim();
  const description = getVal('wm-description').trim();
  const description_en = getVal('wm-description-en').trim();
  const featured = document.getElementById('wm-featured').checked;

  if (!title) { showToast('أدخلي عنوان العمل', true); return; }
  if (!pendingWorkModalImage) { showToast('اختاري صورة للعمل', true); return; }

  Object.assign(w, { title, title_en, category, year, description, description_en, featured, image: pendingWorkModalImage });
  closeWorkModal();
  renderWorks();
  renderImageLibrary();
  await persist();
  showToast('تم حفظ التعديلات ✓');
}

async function deleteWorkFromModal() {
  const id = quickEditWorkId;
  if (id === null) return;
  await deleteWork(id);
  if (!siteData.works.find(w => w.id === id)) closeWorkModal();
}

async function submitWork() {
  const title = getVal('w-title').trim();
  const title_en = getVal('w-title-en').trim();
  const category = getVal('w-category');
  const year = getVal('w-year').trim();
  const description = getVal('w-description').trim();
  const description_en = getVal('w-description-en').trim();
  const featured = document.getElementById('w-featured').checked;

  if (!title) { showToast('أدخلي عنوان العمل', true); return; }
  if (!pendingWorkImage) { showToast('اختاري صورة للعمل', true); return; }

  const nextId = siteData.works.reduce((m, w) => Math.max(m, w.id), 0) + 1;
  siteData.works.push({ id: nextId, image: pendingWorkImage, title, title_en, category, year, description, description_en, featured });

  resetWorkForm();
  renderWorks();
  renderImageLibrary();
  await persist();
}

function resetWorkForm() {
  pendingWorkImage = null;
  setVal('w-title', '');
  setVal('w-title-en', '');
  setVal('w-year', '');
  setVal('w-description', '');
  setVal('w-description-en', '');
  document.getElementById('w-featured').checked = false;
  hidePreview('w-image-preview');
  document.getElementById('w-image-upload').value = '';
}

async function deleteWork(id) {
  const w = siteData.works.find(w => w.id === id);
  if (!confirm(`حذف العمل "${w.title}"؟`)) return;
  siteData.works = siteData.works.filter(w => w.id !== id);
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
  setVal('e-title-en', ev.title_en);
  setVal('e-date', ev.date);
  setVal('e-location', ev.location);
  setVal('e-location-en', ev.location_en);
  setVal('e-description', ev.description);
  setVal('e-description-en', ev.description_en);
  pendingEventImage = ev.image;
  showPreview('e-image-preview', ev.image);

  document.getElementById('btn-add-event').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-event').classList.remove('hidden');
  switchTab('events');
}

async function submitEvent() {
  const title = getVal('e-title').trim();
  const title_en = getVal('e-title-en').trim();
  const date = getVal('e-date').trim();
  const location = getVal('e-location').trim();
  const location_en = getVal('e-location-en').trim();
  const description = getVal('e-description').trim();
  const description_en = getVal('e-description-en').trim();

  if (!title) { showToast('أدخلي عنوان الفعالية', true); return; }
  if (!pendingEventImage) { showToast('اختاري صورة للفعالية', true); return; }

  if (editingEventId !== null) {
    const ev = siteData.events.find(e => e.id === editingEventId);
    Object.assign(ev, { title, title_en, date, location, location_en, description, description_en, image: pendingEventImage });
  } else {
    const nextId = siteData.events.reduce((m, e) => Math.max(m, e.id), 0) + 1;
    siteData.events.push({ id: nextId, image: pendingEventImage, title, title_en, date, location, location_en, description, description_en });
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
  setVal('e-title-en', '');
  setVal('e-date', '');
  setVal('e-location', '');
  setVal('e-location-en', '');
  setVal('e-description', '');
  setVal('e-description-en', '');
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
  setVal('q-text-en', q.text_en);
  setVal('q-author', q.author);
  setVal('q-author-en', q.author_en);
  document.getElementById('btn-add-quote').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-quote').classList.remove('hidden');
  switchTab('quotes');
}

async function submitQuote() {
  const text = getVal('q-text').trim();
  const text_en = getVal('q-text-en').trim();
  const author = getVal('q-author').trim();
  const author_en = getVal('q-author-en').trim();
  if (!text) { showToast('أدخلي نص الاقتباس', true); return; }

  if (editingQuoteIndex !== null) {
    siteData.quotes[editingQuoteIndex] = { text, text_en, author, author_en };
  } else {
    siteData.quotes.push({ text, text_en, author, author_en });
  }

  resetQuoteForm();
  renderQuotes();
  await persist();
}

function resetQuoteForm() {
  editingQuoteIndex = null;
  setVal('q-text', '');
  setVal('q-text-en', '');
  setVal('q-author', 'كارول');
  setVal('q-author-en', 'Carole');
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
        <span class="item-meta">${m.featured ? 'المجلة الأبرز' : 'مجلة'}${m.tag ? ` · ${escapeHtml(m.tag)}` : ''}</span>
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
  setVal('mg-title-en', m.title_en);
  setVal('mg-description', m.description);
  setVal('mg-description-en', m.description_en);
  setVal('mg-embed', m.embedUrl);
  setVal('mg-tag', m.tag || '');
  setVal('mg-tag-en', m.tag_en || '');
  document.getElementById('mg-featured').checked = !!m.featured;
  pendingMagazineCover = m.cover;
  showPreview('mg-cover-preview', m.cover);

  document.getElementById('btn-add-magazine').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-magazine').classList.remove('hidden');
  switchTab('magazines');
}

async function submitMagazine() {
  const title = getVal('mg-title').trim();
  const title_en = getVal('mg-title-en').trim();
  const description = getVal('mg-description').trim();
  const description_en = getVal('mg-description-en').trim();
  const embedUrl = getVal('mg-embed').trim();
  const tag = getVal('mg-tag').trim();
  const tag_en = getVal('mg-tag-en').trim();
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
    Object.assign(m, { title, title_en, description, description_en, embedUrl, tag, tag_en, featured, cover: pendingMagazineCover });
  } else {
    const nextId = siteData.magazines.reduce((mx, m) => Math.max(mx, m.id), 0) + 1;
    siteData.magazines.push({ id: nextId, title, title_en, description, description_en, embedUrl, tag, tag_en, cover: pendingMagazineCover, featured });
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
  setVal('mg-title-en', '');
  setVal('mg-description', '');
  setVal('mg-description-en', '');
  setVal('mg-embed', '');
  setVal('mg-tag', '');
  setVal('mg-tag-en', '');
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
  setVal('pr-title-en', p.title_en);
  setVal('pr-description', p.description);
  setVal('pr-description-en', p.description_en);
  pendingProcessImage = p.image;
  showPreview('pr-image-preview', p.image);

  document.getElementById('btn-add-process').textContent = 'حفظ التعديلات';
  document.getElementById('btn-cancel-edit-process').classList.remove('hidden');
  switchTab('process');
}

async function submitProcess() {
  const title = getVal('pr-title').trim();
  const title_en = getVal('pr-title-en').trim();
  const description = getVal('pr-description').trim();
  const description_en = getVal('pr-description-en').trim();

  if (!title) { showToast('أدخلي عنوان المرحلة', true); return; }
  if (!pendingProcessImage) { showToast('اختاري صورة للمرحلة', true); return; }

  siteData.process = siteData.process || [];

  if (editingProcessId !== null) {
    const p = siteData.process.find(p => p.id === editingProcessId);
    Object.assign(p, { title, title_en, description, description_en, image: pendingProcessImage });
  } else {
    const nextId = siteData.process.reduce((mx, p) => Math.max(mx, p.id), 0) + 1;
    siteData.process.push({ id: nextId, image: pendingProcessImage, title, title_en, description, description_en });
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
  setVal('pr-title-en', '');
  setVal('pr-description', '');
  setVal('pr-description-en', '');
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

/* =========================================================
   Showcase sections (main image + auto-rotating sub-images + copy)
   ========================================================= */
function showcaseSectionId(id) {
  return 'showcase-' + id;
}

function addSectionToOrder(sectionId) {
  siteData.sectionOrder = siteData.sectionOrder || [];
  if (!siteData.sectionOrder.includes(sectionId)) siteData.sectionOrder.push(sectionId);
}

function removeSectionFromOrder(sectionId) {
  siteData.sectionOrder = (siteData.sectionOrder || []).filter(id => id !== sectionId);
}

function renderShowcases() {
  const showcases = siteData.showcases || [];
  document.getElementById('showcases-count').textContent = showcases.length;
  const wrap = document.getElementById('showcases-list');
  wrap.innerHTML = showcases.map((s, i) => `
    <div class="item-card" draggable="true" data-drag-id="${s.id}">
      <span class="item-drag-handle" aria-hidden="true">${iconDrag()}</span>
      <div class="item-img"><img src="${s.mainImage}" alt="${escapeAttr(s.title)}" loading="lazy"></div>
      <div class="item-body">
        <span class="item-meta">${(s.subImages || []).length} صور فرعية${s.autoplay === false ? ' · بدون تبديل تلقائي' : ' · تبديل تلقائي'}</span>
        <h3 class="item-title">${escapeHtml(s.title)}</h3>
        <p class="item-desc">${escapeHtml(s.description || '')}</p>
        <div class="item-actions">
          <button class="btn-icon" data-action="move-up-showcase" data-id="${s.id}" aria-label="تحريك لأعلى" ${i === 0 ? 'disabled' : ''}>${iconUp()}</button>
          <button class="btn-icon" data-action="move-down-showcase" data-id="${s.id}" aria-label="تحريك لأسفل" ${i === showcases.length - 1 ? 'disabled' : ''}>${iconDown()}</button>
          <button class="btn-icon" data-action="edit-showcase" data-id="${s.id}" aria-label="تعديل">${iconEdit()}</button>
          <button class="btn-icon danger" data-action="delete-showcase" data-id="${s.id}" aria-label="حذف">${iconTrash()}</button>
        </div>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="edit-showcase"]').forEach(btn => {
    btn.addEventListener('click', () => openShowcaseModal(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="delete-showcase"]').forEach(btn => {
    btn.addEventListener('click', () => deleteShowcase(Number(btn.dataset.id)));
  });
  wrap.querySelectorAll('[data-action="move-up-showcase"]').forEach(btn => {
    btn.addEventListener('click', () => moveShowcase(Number(btn.dataset.id), -1));
  });
  wrap.querySelectorAll('[data-action="move-down-showcase"]').forEach(btn => {
    btn.addEventListener('click', () => moveShowcase(Number(btn.dataset.id), 1));
  });

  enableCardDrag(wrap, '.item-card', (draggedId, targetId) => reorderById(siteData.showcases, draggedId, targetId, renderShowcases));
}

async function moveShowcase(id, direction) {
  if (!moveArrayItem(siteData.showcases, id, direction)) return;
  renderShowcases();
  await persist();
}

async function submitShowcase() {
  const title = getVal('sh-title').trim();
  const title_en = getVal('sh-title-en').trim();
  const description = getVal('sh-description').trim();
  const description_en = getVal('sh-description-en').trim();
  const autoplay = document.getElementById('sh-autoplay').checked;

  if (!title) { showToast('أدخلي عنوان القسم', true); return; }
  if (!pendingShowcaseMainImage) { showToast('اختاري صورة رئيسية للقسم', true); return; }
  if (pendingShowcaseSubImages.length === 0) { showToast('أضيفي صورة صغيرة واحدة على الأقل', true); return; }

  const nextId = siteData.showcases.reduce((m, s) => Math.max(m, s.id), 0) + 1;
  siteData.showcases.push({
    id: nextId,
    title, title_en,
    description, description_en,
    mainImage: pendingShowcaseMainImage,
    subImages: pendingShowcaseSubImages.slice(),
    autoplay
  });
  addSectionToOrder(showcaseSectionId(nextId));

  resetShowcaseForm();
  renderShowcases();
  renderImageLibrary();
  renderSectionOrder();
  await persist();
}

function resetShowcaseForm() {
  pendingShowcaseMainImage = null;
  pendingShowcaseSubImages = [];
  setVal('sh-title', '');
  setVal('sh-title-en', '');
  setVal('sh-description', '');
  setVal('sh-description-en', '');
  document.getElementById('sh-autoplay').checked = true;
  hidePreview('sh-main-image-preview');
  document.getElementById('sh-main-image-upload').value = '';
  document.getElementById('sh-sub-image-upload').value = '';
  renderSubImagesPreview('sh-sub-images', pendingShowcaseSubImages);
}

function openShowcaseModal(id) {
  const s = siteData.showcases.find(s => s.id === id);
  if (!s) return;
  quickEditShowcaseId = id;
  setVal('shm-title', s.title);
  setVal('shm-title-en', s.title_en);
  setVal('shm-description', s.description);
  setVal('shm-description-en', s.description_en);
  document.getElementById('shm-autoplay').checked = s.autoplay !== false;
  pendingShowcaseModalMainImage = s.mainImage;
  pendingShowcaseModalSubImages = (s.subImages || []).slice();
  showPreview('shm-main-image-preview', s.mainImage, false);
  renderSubImagesPreview('shm-sub-images', pendingShowcaseModalSubImages);
  showModal('showcase-modal');
}

function closeShowcaseModal() {
  quickEditShowcaseId = null;
  pendingShowcaseModalMainImage = null;
  pendingShowcaseModalSubImages = [];
  hideModal('showcase-modal');
}

async function saveShowcaseModal() {
  const s = siteData.showcases.find(s => s.id === quickEditShowcaseId);
  if (!s) return;
  const title = getVal('shm-title').trim();
  const title_en = getVal('shm-title-en').trim();
  const description = getVal('shm-description').trim();
  const description_en = getVal('shm-description-en').trim();
  const autoplay = document.getElementById('shm-autoplay').checked;

  if (!title) { showToast('أدخلي عنوان القسم', true); return; }
  if (!pendingShowcaseModalMainImage) { showToast('اختاري صورة رئيسية للقسم', true); return; }
  if (pendingShowcaseModalSubImages.length === 0) { showToast('أضيفي صورة صغيرة واحدة على الأقل', true); return; }

  Object.assign(s, {
    title, title_en, description, description_en, autoplay,
    mainImage: pendingShowcaseModalMainImage,
    subImages: pendingShowcaseModalSubImages.slice()
  });
  closeShowcaseModal();
  renderShowcases();
  renderImageLibrary();
  renderSectionOrder();
  await persist();
  showToast('تم حفظ التعديلات ✓');
}

async function deleteShowcaseFromModal() {
  const id = quickEditShowcaseId;
  if (id === null) return;
  await deleteShowcase(id);
  if (!siteData.showcases.find(s => s.id === id)) closeShowcaseModal();
}

async function deleteShowcase(id) {
  const s = siteData.showcases.find(s => s.id === id);
  if (!s) return;
  if (!confirm(`حذف القسم "${s.title}"؟`)) return;
  siteData.showcases = siteData.showcases.filter(s => s.id !== id);
  removeSectionFromOrder(showcaseSectionId(id));
  renderShowcases();
  renderImageLibrary();
  renderSectionOrder();
  await persist();
}

function moveArrayItem(array, id, direction) {
  const index = array.findIndex(item => item.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= array.length) return false;
  [array[index], array[target]] = [array[target], array[index]];
  return true;
}

/* =========================================================
   Drag-and-drop reordering (generic — works, showcases, section order)
   ========================================================= */
function showModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function hideModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// بيرتّب مصفوفة من العناصر (كل عنصر له .id) بنقل عنصر لمكان عنصر تاني
function reorderById(array, draggedId, targetId, afterRender) {
  const from = array.findIndex(item => String(item.id) === String(draggedId));
  const to = array.findIndex(item => String(item.id) === String(targetId));
  if (from === -1 || to === -1) return;
  const [item] = array.splice(from, 1);
  array.splice(to, 0, item);
  afterRender();
  persist();
}

// بيرتّب مصفوفة من قيم نصية (زي sectionOrder) بنقل قيمة لمكان قيمة تانية
function reorderArrayValue(array, draggedVal, targetVal, afterRender) {
  const from = array.indexOf(draggedVal);
  const to = array.indexOf(targetVal);
  if (from === -1 || to === -1) return;
  const [item] = array.splice(from, 1);
  array.splice(to, 0, item);
  afterRender();
  persist();
}

// بيفعّل السحب والإفلات لكروت جوه حاوية معينة؛ onDrop(draggedId, targetId) بتتنفذ عند الإفلات
function enableCardDrag(container, selector, onDrop) {
  let draggedId = null;
  container.querySelectorAll(selector + '[draggable="true"]').forEach(card => {
    card.addEventListener('dragstart', () => {
      draggedId = card.dataset.dragId;
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      container.querySelectorAll(selector).forEach(c => c.classList.remove('drag-over'));
      draggedId = null;
    });
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (card.dataset.dragId !== draggedId) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const targetId = card.dataset.dragId;
      if (draggedId === null || draggedId === targetId) return;
      onDrop(draggedId, targetId);
    });
  });
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

const TEXT_DEFAULTS_EN = {
  nav: { home: 'Home', about: 'About', gallery: 'Works', process: 'Journey', magazines: 'Magazines', events: 'Events', contact: 'Contact' },
  hero: { ctaPrimary: 'Browse Works', ctaSecondary: 'About Me' },
  about: { eyebrow: 'About the Artist', heading: 'Where Textiles Meet Art', quote: "I love that every small detail in my work carries a piece of my feeling." },
  featured: { eyebrow: 'Selected', heading: 'Featured Works' },
  process: { eyebrow: 'How a piece is born', heading: 'The Creative Journey', description: 'From the first idea in mind, to the finished piece — each stage has its own story.' },
  gallery: { eyebrow: 'Gallery', heading: 'All Works', description: 'Browse works by category and click any piece to view it larger.' },
  magazines: { eyebrow: 'Interactive Magazines', heading: '4 Magazines · 4 Worlds', description: 'Flip through the pages and explore.', badge: 'Featured', openLink: 'Open Magazine ↗' },
  events: { eyebrow: 'Events', heading: 'Exhibitions & Events' },
  footer: { eyebrow: 'Contact', heading: "Let's Talk About Your Idea", description: 'For any artistic collaboration, custom work, or exhibition invitation — reach out:', contactButton: 'Message Me', note: 'All rights reserved' }
};

function renderTextsFormEn() {
  const texts = siteData.texts_en || {};
  Object.keys(TEXT_DEFAULTS_EN).forEach(section => {
    Object.keys(TEXT_DEFAULTS_EN[section]).forEach(key => {
      const el = document.getElementById(`txen-${section}-${key}`);
      if (!el) return;
      const current = texts[section] && texts[section][key];
      el.value = current !== undefined ? current : TEXT_DEFAULTS_EN[section][key];
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

  siteData.texts_en = siteData.texts_en || {};
  Object.keys(TEXT_DEFAULTS_EN).forEach(section => {
    siteData.texts_en[section] = siteData.texts_en[section] || {};
    Object.keys(TEXT_DEFAULTS_EN[section]).forEach(key => {
      const el = document.getElementById(`txen-${section}-${key}`);
      if (!el) return;
      siteData.texts_en[section][key] = el.value;
    });
  });

  await persist();
}

/* =========================================================
   Section order
   ========================================================= */
const SECTION_LABELS = {
  about:        'عن الفنانة',
  'motion-film':'فيديو — تصاميم في حركة',
  featured:     'أعمال مميزة',
  process:      'رحلة العمل',
  gallery:      'المعرض / كل الأعمال',
  'mag-1':      'مجلة ١ — الأزياء السريالية',
  'mag-2':      'مجلة ٢ — جاكار كريسماس',
  'mag-3':      'مجلة ٣ — جاكار أطلانتس',
  'mag-4':      'مجلة ٤ — الطباعة المنزلية',
  magazines:    'المجلات التفاعلية (قديم)',
  events:       'الفعاليات',
  quotes:       'الاقتباسات'
};

// بيرجع اسم مفهوم للقسم — الأقسام المصورة اسمها ديناميكي حسب عنوانها
function sectionLabel(id) {
  if (id.startsWith('showcase-')) {
    const showcaseId = Number(id.slice('showcase-'.length));
    const s = (siteData.showcases || []).find(s => s.id === showcaseId);
    return s ? `قسم مصور — ${s.title}` : id;
  }
  return SECTION_LABELS[id] || id;
}

function renderSectionOrder() {
  const wrap = document.getElementById('section-order-list');
  const order = siteData.sectionOrder || [];
  wrap.innerHTML = order.map((id, i) => `
    <div class="row-card" draggable="true" data-drag-id="${escapeAttr(id)}">
      <div class="flex items-center gap-3">
        <span class="row-drag-handle" aria-hidden="true">${iconDrag()}</span>
        <span class="text-gold text-sm font-semibold">${i + 1}</span>
        <h3 class="font-semibold">${escapeHtml(sectionLabel(id))}</h3>
      </div>
      <div class="flex gap-2">
        <button class="btn-icon" data-action="move-up-section" data-id="${escapeAttr(id)}" aria-label="تحريك لأعلى" ${i === 0 ? 'disabled' : ''}>${iconUp()}</button>
        <button class="btn-icon" data-action="move-down-section" data-id="${escapeAttr(id)}" aria-label="تحريك لأسفل" ${i === order.length - 1 ? 'disabled' : ''}>${iconDown()}</button>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-action="move-up-section"]').forEach(btn => {
    btn.addEventListener('click', () => moveSection(btn.dataset.id, -1));
  });
  wrap.querySelectorAll('[data-action="move-down-section"]').forEach(btn => {
    btn.addEventListener('click', () => moveSection(btn.dataset.id, 1));
  });

  enableCardDrag(wrap, '.row-card', (draggedId, targetId) => reorderArrayValue(siteData.sectionOrder, draggedId, targetId, renderSectionOrder));
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
  (siteData.showcases || []).forEach(s => {
    if (s.mainImage) used.add(s.mainImage);
    (s.subImages || []).forEach(img => used.add(img));
  });
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
      <button type="button" class="lib-position-btn" data-path="${escapeAttr(path)}" aria-label="ضبط وضع الصورة" title="ضبط وضع الصورة">${iconTarget()}</button>
    </div>`;
  }).join('');

  wrap.querySelectorAll('.lib-item').forEach(el => {
    el.addEventListener('click', () => onLibraryPick(el.dataset.path));
  });
  wrap.querySelectorAll('.lib-position-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPositionModal(btn.dataset.path);
    });
  });
}

/* =========================================================
   Image position editor (focal point picker)
   ========================================================= */
function openPositionModal(path) {
  positionEditingPath = path;
  const current = (siteData.imagePosition && siteData.imagePosition[path]) || '50% 50%';
  const parts = current.split(' ');
  pendingImagePosition = { x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 };

  document.getElementById('ip-source-img').src = path;
  document.getElementById('ip-preview-1').src = path;
  document.getElementById('ip-preview-2').src = path;
  applyPositionPreview();
  showModal('image-position-modal');
}

function closePositionModal() {
  positionEditingPath = null;
  hideModal('image-position-modal');
}

function applyPositionPreview() {
  const pos = `${pendingImagePosition.x}% ${pendingImagePosition.y}%`;
  document.getElementById('ip-marker').style.left = pendingImagePosition.x + '%';
  document.getElementById('ip-marker').style.top = pendingImagePosition.y + '%';
  document.getElementById('ip-preview-1').style.objectPosition = pos;
  document.getElementById('ip-preview-2').style.objectPosition = pos;
}

function setPositionFromEvent(e) {
  const area = document.getElementById('ip-click-area');
  const rect = area.getBoundingClientRect();
  let x = ((e.clientX - rect.left) / rect.width) * 100;
  let y = ((e.clientY - rect.top) / rect.height) * 100;
  x = Math.max(0, Math.min(100, x));
  y = Math.max(0, Math.min(100, y));
  pendingImagePosition = { x: Math.round(x), y: Math.round(y) };
  applyPositionPreview();
}

function resetImagePosition() {
  pendingImagePosition = { x: 50, y: 50 };
  applyPositionPreview();
}

async function saveImagePosition() {
  if (!positionEditingPath) return;
  siteData.imagePosition = siteData.imagePosition || {};
  siteData.imagePosition[positionEditingPath] = `${pendingImagePosition.x}% ${pendingImagePosition.y}%`;
  closePositionModal();
  await persist();
  showToast('تم حفظ وضع الصورة ✓');
}

// المودال اللي بيتفتح منه الاختيار — لو اتفتح، لازم يترد يفتح تاني لما نقفل مكتبة الصور
let pickerReturnModal = null;

function startPicking(target, returnModal) {
  pickerTarget = target;
  pickerReturnModal = returnModal || null;
  const multi = target === 'sh-sub' || target === 'shm-sub';
  const labels = {
    artist: 'صورة الفنانة',
    'artist-about': 'صورة قسم عن الفنانة',
    work: 'صورة العمل الجديد',
    'work-modal': 'صورة العمل',
    event: 'صورة الفعالية',
    'mg-cover': 'صورة غلاف المجلة',
    'pr-image': 'صورة مرحلة رحلة العمل',
    'sh-main': 'الصورة الرئيسية للقسم',
    'shm-main': 'الصورة الرئيسية للقسم',
    'sh-sub': 'صورة صغيرة (اضغطي على أكتر من صورة)',
    'shm-sub': 'صورة صغيرة (اضغطي على أكتر من صورة)'
  };
  document.getElementById('library-picker-text').textContent = `اضغطي على صورة لاختيارها لـ: ${labels[target]}`;
  document.getElementById('btn-cancel-pick').textContent = multi ? 'تم ✓' : 'إلغاء ✕';
  document.getElementById('library-picker-banner').classList.remove('hidden');
  switchTab('works');
  document.getElementById('image-library').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function stopPicking() {
  pickerTarget = null;
  document.getElementById('library-picker-banner').classList.add('hidden');
  if (pickerReturnModal) {
    showModal(pickerReturnModal);
    pickerReturnModal = null;
  }
}

function onLibraryPick(path) {
  if (!pickerTarget) return;
  let closeAfter = true;
  if (pickerTarget === 'artist') {
    pendingArtistImage = path;
    showPreview('artist-photo-preview', path, false);
  } else if (pickerTarget === 'artist-about') {
    pendingArtistAboutImage = path;
    showPreview('artist-about-photo-preview', path, false);
  } else if (pickerTarget === 'work') {
    pendingWorkImage = path;
    showPreview('w-image-preview', path);
  } else if (pickerTarget === 'work-modal') {
    pendingWorkModalImage = path;
    showPreview('wm-image-preview', path, false);
  } else if (pickerTarget === 'event') {
    pendingEventImage = path;
    showPreview('e-image-preview', path);
  } else if (pickerTarget === 'mg-cover') {
    pendingMagazineCover = path;
    showPreview('mg-cover-preview', path);
  } else if (pickerTarget === 'pr-image') {
    pendingProcessImage = path;
    showPreview('pr-image-preview', path);
  } else if (pickerTarget === 'sh-main') {
    pendingShowcaseMainImage = path;
    showPreview('sh-main-image-preview', path, false);
  } else if (pickerTarget === 'shm-main') {
    pendingShowcaseModalMainImage = path;
    showPreview('shm-main-image-preview', path, false);
  } else if (pickerTarget === 'sh-sub') {
    pendingShowcaseSubImages.push(path);
    renderSubImagesPreview('sh-sub-images', pendingShowcaseSubImages);
    closeAfter = false;
  } else if (pickerTarget === 'shm-sub') {
    pendingShowcaseModalSubImages.push(path);
    renderSubImagesPreview('shm-sub-images', pendingShowcaseModalSubImages);
    closeAfter = false;
  }
  if (closeAfter) {
    stopPicking();
    showToast('تم اختيار الصورة');
  }
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
    } else if (target === 'artist-about') {
      pendingArtistAboutImage = path;
      showPreview('artist-about-photo-preview', path, false);
    } else if (target === 'work') {
      pendingWorkImage = path;
      showPreview('w-image-preview', path);
    } else if (target === 'work-modal') {
      pendingWorkModalImage = path;
      showPreview('wm-image-preview', path, false);
    } else if (target === 'event') {
      pendingEventImage = path;
      showPreview('e-image-preview', path);
    } else if (target === 'mg-cover') {
      pendingMagazineCover = path;
      showPreview('mg-cover-preview', path);
    } else if (target === 'pr-image') {
      pendingProcessImage = path;
      showPreview('pr-image-preview', path);
    } else if (target === 'sh-main') {
      pendingShowcaseMainImage = path;
      showPreview('sh-main-image-preview', path, false);
    } else if (target === 'shm-main') {
      pendingShowcaseModalMainImage = path;
      showPreview('shm-main-image-preview', path, false);
    } else if (target === 'sh-sub') {
      pendingShowcaseSubImages.push(path);
      renderSubImagesPreview('sh-sub-images', pendingShowcaseSubImages);
    } else if (target === 'shm-sub') {
      pendingShowcaseModalSubImages.push(path);
      renderSubImagesPreview('shm-sub-images', pendingShowcaseModalSubImages);
    }
    renderImageLibrary();
    showToast('تم رفع الصورة ✓');
  } catch (err) {
    console.error(err);
    showToast('فشل رفع الصورة: ' + err.message, true);
  }
}

// بيرسم صور صغيرة قابلة للحذف لقائمة الصور الفرعية بتاعة القسم المصور
function renderSubImagesPreview(containerId, list) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = list.map((path, i) => `
    <div class="sh-sub-thumb">
      <img src="${escapeAttr(path)}" alt="">
      <button type="button" class="sh-sub-remove" data-index="${i}" aria-label="حذف الصورة">✕</button>
    </div>
  `).join('');
  wrap.querySelectorAll('.sh-sub-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      list.splice(Number(btn.dataset.index), 1);
      renderSubImagesPreview(containerId, list);
    });
  });
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
  manifestDirty = true;

  siteData.imageMeta = siteData.imageMeta || {};
  siteData.imageMeta['images/' + name] = { width, height };

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
function iconDrag() {
  return `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><circle cx="6" cy="5" r="1.4"/><circle cx="14" cy="5" r="1.4"/><circle cx="6" cy="10" r="1.4"/><circle cx="14" cy="10" r="1.4"/><circle cx="6" cy="15" r="1.4"/><circle cx="14" cy="15" r="1.4"/></svg>`;
}
function iconTarget() {
  return `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/></svg>`;
}
