// ════════════════════════════════════════════════════
// QURAN.JS — Quran Reading & Audio Module
// ════════════════════════════════════════════════════

const SURAH_LIST = [
    { n: 1, name: "الفاتحة", en: "Al-Fatiha", ayahs: 7, type: "Meccan" },
    { n: 2, name: "البقرة", en: "Al-Baqara", ayahs: 286, type: "Medinan" },
    { n: 3, name: "آل عمران", en: "Aal-i-Imran", ayahs: 200, type: "Medinan" },
    { n: 4, name: "النساء", en: "An-Nisa", ayahs: 176, type: "Medinan" },
    { n: 5, name: "المائدة", en: "Al-Maida", ayahs: 120, type: "Medinan" },
    { n: 6, name: "الأنعام", en: "Al-Anam", ayahs: 165, type: "Meccan" },
    { n: 7, name: "الأعراف", en: "Al-Araf", ayahs: 206, type: "Meccan" },
    { n: 8, name: "الأنفال", en: "Al-Anfal", ayahs: 75, type: "Medinan" },
    { n: 9, name: "التوبة", en: "At-Tawba", ayahs: 129, type: "Medinan" },
    { n: 10, name: "يونس", en: "Yunus", ayahs: 109, type: "Meccan" },
    { n: 11, name: "هود", en: "Hud", ayahs: 123, type: "Meccan" },
    { n: 12, name: "يوسف", en: "Yusuf", ayahs: 111, type: "Meccan" },
    { n: 13, name: "الرعد", en: "Ar-Rad", ayahs: 43, type: "Medinan" },
    { n: 14, name: "إبراهيم", en: "Ibrahim", ayahs: 52, type: "Meccan" },
    { n: 15, name: "الحجر", en: "Al-Hijr", ayahs: 99, type: "Meccan" },
    { n: 16, name: "النحل", en: "An-Nahl", ayahs: 128, type: "Meccan" },
    { n: 17, name: "الإسراء", en: "Al-Isra", ayahs: 111, type: "Meccan" },
    { n: 18, name: "الكهف", en: "Al-Kahf", ayahs: 110, type: "Meccan" },
    { n: 19, name: "مريم", en: "Maryam", ayahs: 98, type: "Meccan" },
    { n: 20, name: "طه", en: "Ta-Ha", ayahs: 135, type: "Meccan" },
    { n: 21, name: "الأنبياء", en: "Al-Anbiya", ayahs: 112, type: "Meccan" },
    { n: 22, name: "الحج", en: "Al-Hajj", ayahs: 78, type: "Medinan" },
    { n: 23, name: "المؤمنون", en: "Al-Muminun", ayahs: 118, type: "Meccan" },
    { n: 24, name: "النور", en: "An-Nur", ayahs: 64, type: "Medinan" },
    { n: 25, name: "الفرقان", en: "Al-Furqan", ayahs: 77, type: "Meccan" },
    { n: 26, name: "الشعراء", en: "Ash-Shuara", ayahs: 227, type: "Meccan" },
    { n: 27, name: "النمل", en: "An-Naml", ayahs: 93, type: "Meccan" },
    { n: 28, name: "القصص", en: "Al-Qasas", ayahs: 88, type: "Meccan" },
    { n: 29, name: "العنكبوت", en: "Al-Ankabut", ayahs: 69, type: "Meccan" },
    { n: 30, name: "الروم", en: "Ar-Rum", ayahs: 60, type: "Meccan" },
    { n: 31, name: "لقمان", en: "Luqman", ayahs: 34, type: "Meccan" },
    { n: 32, name: "السجدة", en: "As-Sajda", ayahs: 30, type: "Meccan" },
    { n: 33, name: "الأحزاب", en: "Al-Ahzab", ayahs: 73, type: "Medinan" },
    { n: 34, name: "سبأ", en: "Saba", ayahs: 54, type: "Meccan" },
    { n: 35, name: "فاطر", en: "Fatir", ayahs: 45, type: "Meccan" },
    { n: 36, name: "يس", en: "Ya-Sin", ayahs: 83, type: "Meccan" },
    { n: 37, name: "الصافات", en: "As-Saffat", ayahs: 182, type: "Meccan" },
    { n: 38, name: "ص", en: "Sad", ayahs: 88, type: "Meccan" },
    { n: 39, name: "الزمر", en: "Az-Zumar", ayahs: 75, type: "Meccan" },
    { n: 40, name: "غافر", en: "Ghafir", ayahs: 85, type: "Meccan" },
    { n: 41, name: "فصلت", en: "Fussilat", ayahs: 54, type: "Meccan" },
    { n: 42, name: "الشورى", en: "Ash-Shura", ayahs: 53, type: "Meccan" },
    { n: 43, name: "الزخرف", en: "Az-Zukhruf", ayahs: 89, type: "Meccan" },
    { n: 44, name: "الدخان", en: "Ad-Dukhan", ayahs: 59, type: "Meccan" },
    { n: 45, name: "الجاثية", en: "Al-Jathiya", ayahs: 37, type: "Meccan" },
    { n: 46, name: "الأحقاف", en: "Al-Ahqaf", ayahs: 35, type: "Meccan" },
    { n: 47, name: "محمد", en: "Muhammad", ayahs: 38, type: "Medinan" },
    { n: 48, name: "الفتح", en: "Al-Fath", ayahs: 29, type: "Medinan" },
    { n: 49, name: "الحجرات", en: "Al-Hujurat", ayahs: 18, type: "Medinan" },
    { n: 50, name: "ق", en: "Qaf", ayahs: 45, type: "Meccan" },
    { n: 51, name: "الذاريات", en: "Adh-Dhariyat", ayahs: 60, type: "Meccan" },
    { n: 52, name: "الطور", en: "At-Tur", ayahs: 49, type: "Meccan" },
    { n: 53, name: "النجم", en: "An-Najm", ayahs: 62, type: "Meccan" },
    { n: 54, name: "القمر", en: "Al-Qamar", ayahs: 55, type: "Meccan" },
    { n: 55, name: "الرحمن", en: "Ar-Rahman", ayahs: 78, type: "Medinan" },
    { n: 56, name: "الواقعة", en: "Al-Waqia", ayahs: 96, type: "Meccan" },
    { n: 57, name: "الحديد", en: "Al-Hadid", ayahs: 29, type: "Medinan" },
    { n: 58, name: "المجادلة", en: "Al-Mujadila", ayahs: 22, type: "Medinan" },
    { n: 59, name: "الحشر", en: "Al-Hashr", ayahs: 24, type: "Medinan" },
    { n: 60, name: "الممتحنة", en: "Al-Mumtahana", ayahs: 13, type: "Medinan" },
    { n: 61, name: "الصف", en: "As-Saff", ayahs: 14, type: "Medinan" },
    { n: 62, name: "الجمعة", en: "Al-Jumua", ayahs: 11, type: "Medinan" },
    { n: 63, name: "المنافقون", en: "Al-Munafiqun", ayahs: 11, type: "Medinan" },
    { n: 64, name: "التغابن", en: "At-Taghabun", ayahs: 18, type: "Medinan" },
    { n: 65, name: "الطلاق", en: "At-Talaq", ayahs: 12, type: "Medinan" },
    { n: 66, name: "التحريم", en: "At-Tahrim", ayahs: 12, type: "Medinan" },
    { n: 67, name: "الملك", en: "Al-Mulk", ayahs: 30, type: "Meccan" },
    { n: 68, name: "القلم", en: "Al-Qalam", ayahs: 52, type: "Meccan" },
    { n: 69, name: "الحاقة", en: "Al-Haqqa", ayahs: 52, type: "Meccan" },
    { n: 70, name: "المعارج", en: "Al-Maarij", ayahs: 44, type: "Meccan" },
    { n: 71, name: "نوح", en: "Nuh", ayahs: 28, type: "Meccan" },
    { n: 72, name: "الجن", en: "Al-Jinn", ayahs: 28, type: "Meccan" },
    { n: 73, name: "المزمل", en: "Al-Muzzammil", ayahs: 20, type: "Meccan" },
    { n: 74, name: "المدثر", en: "Al-Muddaththir", ayahs: 56, type: "Meccan" },
    { n: 75, name: "القيامة", en: "Al-Qiyama", ayahs: 40, type: "Meccan" },
    { n: 76, name: "الإنسان", en: "Al-Insan", ayahs: 31, type: "Medinan" },
    { n: 77, name: "المرسلات", en: "Al-Mursalat", ayahs: 50, type: "Meccan" },
    { n: 78, name: "النبأ", en: "An-Naba", ayahs: 40, type: "Meccan" },
    { n: 79, name: "النازعات", en: "An-Naziat", ayahs: 46, type: "Meccan" },
    { n: 80, name: "عبس", en: "Abasa", ayahs: 42, type: "Meccan" },
    { n: 81, name: "التكوير", en: "At-Takwir", ayahs: 29, type: "Meccan" },
    { n: 82, name: "الانفطار", en: "Al-Infitar", ayahs: 19, type: "Meccan" },
    { n: 83, name: "المطففين", en: "Al-Mutaffifin", ayahs: 36, type: "Meccan" },
    { n: 84, name: "الانشقاق", en: "Al-Inshiqaq", ayahs: 25, type: "Meccan" },
    { n: 85, name: "البروج", en: "Al-Buruj", ayahs: 22, type: "Meccan" },
    { n: 86, name: "الطارق", en: "At-Tariq", ayahs: 17, type: "Meccan" },
    { n: 87, name: "الأعلى", en: "Al-Ala", ayahs: 19, type: "Meccan" },
    { n: 88, name: "الغاشية", en: "Al-Ghashiya", ayahs: 26, type: "Meccan" },
    { n: 89, name: "الفجر", en: "Al-Fajr", ayahs: 30, type: "Meccan" },
    { n: 90, name: "البلد", en: "Al-Balad", ayahs: 20, type: "Meccan" },
    { n: 91, name: "الشمس", en: "Ash-Shams", ayahs: 15, type: "Meccan" },
    { n: 92, name: "الليل", en: "Al-Lail", ayahs: 21, type: "Meccan" },
    { n: 93, name: "الضحى", en: "Ad-Duha", ayahs: 11, type: "Meccan" },
    { n: 94, name: "الشرح", en: "Ash-Sharh", ayahs: 8, type: "Meccan" },
    { n: 95, name: "التين", en: "At-Tin", ayahs: 8, type: "Meccan" },
    { n: 96, name: "العلق", en: "Al-Alaq", ayahs: 19, type: "Meccan" },
    { n: 97, name: "القدر", en: "Al-Qadr", ayahs: 5, type: "Meccan" },
    { n: 98, name: "البينة", en: "Al-Bayyina", ayahs: 8, type: "Medinan" },
    { n: 99, name: "الزلزلة", en: "Az-Zalzala", ayahs: 8, type: "Medinan" },
    { n: 100, name: "العاديات", en: "Al-Adiyat", ayahs: 11, type: "Meccan" },
    { n: 101, name: "القارعة", en: "Al-Qaria", ayahs: 11, type: "Meccan" },
    { n: 102, name: "التكاثر", en: "At-Takathur", ayahs: 8, type: "Meccan" },
    { n: 103, name: "العصر", en: "Al-Asr", ayahs: 3, type: "Meccan" },
    { n: 104, name: "الهمزة", en: "Al-Humaza", ayahs: 9, type: "Meccan" },
    { n: 105, name: "الفيل", en: "Al-Fil", ayahs: 5, type: "Meccan" },
    { n: 106, name: "قريش", en: "Quraysh", ayahs: 4, type: "Meccan" },
    { n: 107, name: "الماعون", en: "Al-Maun", ayahs: 7, type: "Meccan" },
    { n: 108, name: "الكوثر", en: "Al-Kawthar", ayahs: 3, type: "Meccan" },
    { n: 109, name: "الكافرون", en: "Al-Kafirun", ayahs: 6, type: "Meccan" },
    { n: 110, name: "النصر", en: "An-Nasr", ayahs: 3, type: "Medinan" },
    { n: 111, name: "المسد", en: "Al-Masad", ayahs: 5, type: "Meccan" },
    { n: 112, name: "الإخلاص", en: "Al-Ikhlas", ayahs: 4, type: "Meccan" },
    { n: 113, name: "الفلق", en: "Al-Falaq", ayahs: 5, type: "Meccan" },
    { n: 114, name: "الناس", en: "An-Nas", ayahs: 6, type: "Meccan" }
];

const POPULAR_RECITERS = [
    { id: 6, name: "محمود خليل الحصري" },
    { id: 7, name: "مشاري العفاسي" },
    { id: 3, name: "عبدالرحمن السديس" },
    { id: 8, name: "محمد صديق المنشاوي" },
    { id: 1, name: "عبدالباسط عبدالصمد" },
    { id: 10, name: "سعود الشريم" },
    { id: 4, name: "أبو بكر الشاطري" },
    { id: 11, name: "محمد الطبلاوي" },
    { id: 5, name: "هاني الرفاعي" },
    { id: 2, name: "عبدالباسط (مجود)" }
];

const quranState = {
    textDownloaded: false,
    currentPage: 1,
    dailyGoal: 0,
    selectedReciter: POPULAR_RECITERS[0],
    audioPlayer: null,
    isPlaying: false,
    currentAudioSurah: 0,
    currentAyahIndex: 0,
    currentTimestamps: [],
    _lastBlobURL: null
};

// ── INDEXEDDB ──
const QURAN_DB = 'QuranAppDB';
const DB_VERSION = 1;
function openQuranDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(QURAN_DB, DB_VERSION);
        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('quranText')) db.createObjectStore('quranText', { keyPath: 'surahNum' });
            if (!db.objectStoreNames.contains('quranAudio')) db.createObjectStore('quranAudio', { keyPath: 'key' });
            if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
async function dbPut(store, data) {
    const db = await openQuranDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).put(data);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}
async function dbGet(store, key) {
    const db = await openQuranDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
async function dbGetAll(store) {
    const db = await openQuranDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
async function dbClearStore(store) {
    const db = await openQuranDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// ── TEXT DOWNLOAD ──
async function isQuranTextDownloaded() {
    try { const d = await dbGet('settings', 'textDownloaded'); return d && d.value === true; }
    catch { return false; }
}
async function downloadQuranText() {
    const progEl = document.getElementById('quran-download-progress');
    const progBar = document.getElementById('quran-download-bar');
    const progText = document.getElementById('quran-download-text');
    const btn = document.getElementById('quran-download-btn');
    if (progEl) progEl.classList.remove('hidden');
    if (btn) { btn.disabled = true; btn.textContent = 'جاري التحميل...'; }
    for (let i = 1; i <= 114; i++) {
        try {
            const res = await fetch(`https://api.alquran.cloud/v1/surah/${i}/ar.uthmani`);
            const json = await res.json();
            if (json.code === 200 && json.data) {
                await dbPut('quranText', {
                    surahNum: i, name: json.data.name, englishName: json.data.englishName,
                    ayahs: json.data.ayahs.map(a => ({ number: a.numberInSurah, text: a.text, juz: a.juz, page: a.page }))
                });
            }
        } catch (e) { console.warn(`Surah ${i} failed`, e); }
        const pct = Math.round((i / 114) * 100);
        if (progBar) progBar.style.width = pct + '%';
        if (progText) progText.textContent = `${i}/114 سورة (${pct}%)`;
    }
    await dbPut('settings', { id: 'textDownloaded', value: true });
    quranState.textDownloaded = true;
    if (progEl) progEl.classList.add('hidden');
    showToast('✅ تم تحميل القرآن الكريم');
    await renderQuranReader();
    await loadPage(quranState.currentPage);
}
async function _downloadQuranTextHidden() {
    try {
        const res = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
        const data = await res.json();
        for (const surah of data.data.surahs) {
            await dbPut('quranText', {
                surahNum: surah.number, name: surah.name,
                ayahs: surah.ayahs.map(a => ({ number: a.numberInSurah, text: a.text, juz: a.juz, page: a.page }))
            });
        }
        quranState.textDownloaded = true;
        await dbPut('settings', { id: 'textDownloaded', value: true });
    } catch (e) { }
}

// ── DAILY GOAL — ARRAY-BASED PAGE TRACKING ──
function getQuranDailyKey() { const d = new Date(); return `quranDaily_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function getQuranDailyLog() {
    const s = localStorage.getItem(getQuranDailyKey());
    if (!s) return { pagesRead: [], completed: false };
    const log = JSON.parse(s);
    // Migrate old number format → array
    if (typeof log.pagesRead === 'number') {
        const lastPage = parseInt(localStorage.getItem('quranLastPage') || '1');
        const arr = [];
        for (let i = 0; i < log.pagesRead; i++) arr.push(Math.max(1, lastPage - log.pagesRead + 1 + i));
        log.pagesRead = arr;
        localStorage.setItem(getQuranDailyKey(), JSON.stringify(log));
    }
    if (!Array.isArray(log.pagesRead)) log.pagesRead = [];
    return log;
}
function saveQuranDailyLog(log) { localStorage.setItem(getQuranDailyKey(), JSON.stringify(log)); updateQuranDailyTracker(); }
function getReadPageCount() { return getQuranDailyLog().pagesRead.length; }
function markPageRead(advancePage = true) {
    const log = getQuranDailyLog();
    const page = quranState.currentPage;
    if (!log.pagesRead.includes(page)) log.pagesRead.push(page);

    // Persist in the all-time set (used by getNextQuranPage to find first gap)
    saveFinishedPage(page);
    // Keep the legacy key for any external code that still reads it
    localStorage.setItem('quranLastFinishedPage', page.toString());

    const goal = parseInt(localStorage.getItem('quranDailyGoal') || '0');
    const count = log.pagesRead.length;
    if (goal > 0 && count >= goal && !log.completed) { log.completed = true; showToast('🎉 ما شاء الله! أتممت وِردك'); if (navigator.vibrate) navigator.vibrate([30, 20, 30, 20, 30]); }
    else showToast(`📖 صفحة ${count}${goal ? '/' + goal : ''}`);
    saveQuranDailyLog(log);

    if (advancePage && quranState.currentPage < 604) {
        loadPage(quranState.currentPage + 1);
    }
}
// ── ALL-TIME FINISHED PAGES (persisted set) ──────────────────────────────
// Stored as a sorted JSON array so we can find gaps (unread pages).
function getAllFinishedPages() {
    try { return JSON.parse(localStorage.getItem('quranAllFinishedPages') || '[]'); }
    catch { return []; }
}
function saveFinishedPage(pageNum) {
    const all = getAllFinishedPages();
    if (!all.includes(pageNum)) {
        all.push(pageNum);
        all.sort((a, b) => a - b);
        localStorage.setItem('quranAllFinishedPages', JSON.stringify(all));
    }
}

function getNextQuranPage() {
    // Find the first page (starting from 1) that has never been marked finished.
    // This correctly handles out-of-order completion:
    //   e.g. if pages 1-3 and 50 are done, suggest page 4 — not 51.
    const readSet = new Set(getAllFinishedPages());
    if (readSet.size === 0) return 1;
    for (let p = 1; p <= 604; p++) {
        if (!readSet.has(p)) return p;
    }
    return 1; // all 604 pages finished → start over
}
function setDailyGoal(pages) {
    localStorage.setItem('quranDailyGoal', pages); quranState.dailyGoal = pages;
    // Re-evaluate completion when goal changes
    const log = getQuranDailyLog();
    const count = log.pagesRead.length;
    if (pages > 0 && count >= pages) { log.completed = true; } else { log.completed = false; }
    saveQuranDailyLog(log);
    showToast(`✅ الوِرد اليومي: ${pages > 0 ? pages + ' صفحات' : 'بدون هدف'}`);
}
function setCustomGoal() { const v = parseInt(document.getElementById('custom-goal-input')?.value || '0'); if (v >= 1 && v <= 604) setDailyGoal(v); else showToast('⚠️ أدخل عددًا بين 1 و 604'); }
function getQuranStreak() {
    let s = 0; const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        const key = `quranDaily_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const raw = localStorage.getItem(key);
        if (raw) { const log = JSON.parse(raw); const count = Array.isArray(log.pagesRead) ? log.pagesRead.length : (log.pagesRead || 0); if (count > 0) s++; else if (i > 0) break; } else if (i > 0) break;
    }
    return s;
}
function updateQuranDailyTracker() {
    const goal = parseInt(localStorage.getItem('quranDailyGoal') || '0');
    const tracker = document.getElementById('quran-daily-tracker');
    if (!tracker || goal <= 0) { if (tracker) tracker.classList.add('hidden'); return; }
    tracker.classList.remove('hidden');
    const log = getQuranDailyLog();
    const count = log.pagesRead.length;
    const progEl = document.getElementById('quran-daily-progress');
    const barEl = document.getElementById('quran-daily-bar');
    const streakEl = document.getElementById('quran-streak-badge');
    if (progEl) progEl.textContent = `${count}/${goal}`;
    if (barEl) barEl.style.width = Math.min(100, (count / goal) * 100) + '%';
    const streak = getQuranStreak();
    if (streakEl) { if (streak >= 2) { streakEl.textContent = `🔥 ${streak}`; streakEl.classList.remove('hidden'); } else streakEl.classList.add('hidden'); }
}

// (Reminders removed — notifications handled via prayer modal)

// ── MODAL OPEN / CLOSE ──
function openQuranModal() { document.getElementById('quran-modal')?.classList.add('active'); initQuranModal(); }
function closeQuranModal() { document.getElementById('quran-modal')?.classList.remove('active'); }
async function initQuranModal() {
    quranState.textDownloaded = await isQuranTextDownloaded();
    loadQuranSettings();
    if (quranState.textDownloaded) { await renderQuranReader(); await loadPage(quranState.currentPage); }
    else renderQuranDownloadView();
}
function loadQuranSettings() {
    const goal = localStorage.getItem('quranDailyGoal');
    const reciter = localStorage.getItem('quranReciter');
    if (goal) quranState.dailyGoal = parseInt(goal);
    if (reciter) { try { quranState.selectedReciter = JSON.parse(reciter); } catch { quranState.selectedReciter = POPULAR_RECITERS[0]; } }
}

// ── DOWNLOAD VIEW ──
function renderQuranDownloadView() {
    const content = document.getElementById('quran-modal-content'); if (!content) return;
    const goal = parseInt(localStorage.getItem('quranDailyGoal') || '0');
    content.innerHTML = `
        <div class="flex flex-col items-center justify-center flex-grow px-6 py-10 text-center">
            <div class="mb-5" style="font-size:3.5rem;text-shadow:0 0 30px rgba(212,168,83,.5);">📖</div>
            <h3 class="text-2xl font-bold mb-2" style="color:#d4a853;font-family:'Amiri',serif;text-shadow:0 0 16px rgba(212,168,83,.25);">القرآن الكريم</h3>
            <p class="text-sm mb-1 opacity-60" style="color:#b8860b;">حمّل نص القرآن للقراءة بدون إنترنت</p>
            <p class="text-xs mb-7 opacity-30" style="color:#8b7355;">الحجم التقديري: ~3 ميجابايت</p>
            <button id="quran-download-btn" onclick="downloadQuranText()" class="w-full max-w-xs py-4 rounded-2xl font-bold text-base mb-5"
                style="background:linear-gradient(135deg,#d4a853,#b8860b);color:#1a1207;box-shadow:0 6px 24px rgba(212,168,83,.3);">
                ⬇️ تحميل القرآن الكريم
            </button>
            <div id="quran-download-progress" class="hidden w-full max-w-xs mb-5">
                <div class="w-full h-1.5 rounded-full overflow-hidden mb-1.5" style="background:rgba(212,168,83,.15);">
                    <div id="quran-download-bar" class="h-full rounded-full transition-all" style="width:0%;background:linear-gradient(90deg,#b8860b,#d4a853);"></div>
                </div>
                <p id="quran-download-text" class="text-xs opacity-40" style="color:#b8860b;">0/114 سورة</p>
            </div>
            <div class="w-full max-w-xs">
                <p class="text-[10px] font-bold mb-2.5 opacity-40" style="color:#d4a853;">⚙️ الوِرد اليومي (صفحات)</p>
                <div class="grid grid-cols-4 gap-2">
                    ${[2, 5, 10, 20].map(n => `<button onclick="setDailyGoal(${n})" class="py-2.5 rounded-xl text-sm font-bold"
                        style="background:${goal === n ? 'linear-gradient(135deg,#d4a853,#b8860b)' : 'rgba(212,168,83,.1)'};color:${goal === n ? '#1a1207' : '#d4a853'};border:1px solid rgba(212,168,83,.2);">${n}</button>`).join('')}
                </div>
            </div>
        </div>`;
}

// ── READER CHROME ──
async function renderQuranReader() {
    const content = document.getElementById('quran-modal-content'); if (!content) return;
    const pct = ((quranState.currentPage - 1) / 603 * 100).toFixed(2);
    const log = getQuranDailyLog();
    const readCount = log.pagesRead.length;
    const goal = parseInt(localStorage.getItem('quranDailyGoal') || '0');
    content.innerHTML = `
        <div style="flex-shrink:0;background:rgba(10,7,3,.9);backdrop-filter:blur(10px);border-bottom:1px solid rgba(212,168,83,.1);">
            <div class="flex items-center justify-between px-4 py-3 gap-2">
                <button onclick="showSurahList()" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;border:1px solid rgba(212,168,83,.12);">
                    <i class="fas fa-list-ul text-[10px]"></i><span>السور</span>
                </button>
                <div class="text-center flex-1">
                    <div id="quran-page-label" class="text-sm font-bold leading-tight" style="color:#d4a853;font-family:'Amiri',serif;">الصفحة ${quranState.currentPage}</div>
                    ${goal > 0 ? `<div class="text-[9px] opacity-40" style="color:#8b7355;">${readCount}/${goal} اليوم</div>` : ''}
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="showQuranSearch()" class="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;border:1px solid rgba(212,168,83,.12);"><i class="fas fa-search text-[10px]"></i></button>
                    <button onclick="showReciterPicker()" class="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;border:1px solid rgba(212,168,83,.12);" title="تغيير القارئ"><i class="fas fa-microphone text-[10px]"></i></button>
                    <button onclick="showQuranSettings()" class="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;border:1px solid rgba(212,168,83,.12);"><i class="fas fa-sliders text-[10px]"></i></button>
                    <button onclick="showQuranAchievements()" class="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;border:1px solid rgba(212,168,83,.12);"><i class="fas fa-trophy text-[10px]"></i></button>
                </div>
            </div>
            <div id="quran-search-row" class="hidden px-4 pb-3">
                <div class="relative">
                    <input id="quran-search-input" type="text" placeholder="ابحث عن سورة..." oninput="handleQuranSearch(this.value)"
                        class="w-full text-sm rounded-xl px-4 py-2.5 outline-none" dir="rtl"
                        style="background:rgba(212,168,83,.07);border:1px solid rgba(212,168,83,.18);color:#d4a853;font-family:'Tajawal',sans-serif;">
                    <div id="quran-search-results" class="hidden absolute top-full right-0 left-0 z-20 rounded-xl mt-1 overflow-hidden" style="background:#14100a;border:1px solid rgba(212,168,83,.2);box-shadow:0 12px 32px rgba(0,0,0,.8);max-height:220px;overflow-y:auto;"></div>
                </div>
            </div>
            <div style="height:2px;background:rgba(212,168,83,.06);">
                <div id="quran-progress-strip" style="height:2px;background:linear-gradient(90deg,#6b4c00,#d4a853,#f5d78e);width:${pct}%;transition:width .4s ease;"></div>
            </div>
        </div>
        <div id="quran-reader-area" class="flex-grow overflow-y-auto custom-scrollbar" style="padding:20px 18px 16px;direction:rtl;-webkit-overflow-scrolling:touch;"></div>
        <div id="quran-now-playing" style="display:none;flex-shrink:0;background:rgba(8,6,2,.95);backdrop-filter:blur(12px);border-top:1px solid rgba(212,168,83,.18);padding:10px 16px;">
            <div class="flex items-center gap-3">
                <div id="quran-playing-label" class="flex-1 text-xs font-bold truncate" style="color:#d4a853;font-family:'Amiri',serif;"></div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <button onclick="prevAyahInQueue()" class="w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;"><i class="fas fa-step-forward text-[10px]"></i></button>
                    <button id="reader-play-btn" onclick="toggleReaderPlayPause()" class="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform" style="background:linear-gradient(135deg,#d4a853,#b8860b);color:#1a1207;box-shadow:0 2px 12px rgba(212,168,83,.28);"><i class="fas fa-pause text-xs"></i></button>
                    <button onclick="skipNextSurah()" class="w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;"><i class="fas fa-step-backward text-[10px]"></i></button>
                </div>
            </div>
        </div>
        <div style="flex-shrink:0;background:rgba(10,7,3,.9);backdrop-filter:blur(10px);border-top:1px solid rgba(212,168,83,.1);padding:10px 16px calc(10px + env(safe-area-inset-bottom,0px));">
            <div class="flex items-center gap-2.5">
                <button onclick="prevPage()" class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:rgba(212,168,83,.08);color:#d4a853;border:1px solid rgba(212,168,83,.1);min-width:80px;justify-content:center;flex-shrink:0;">
                    <i class="fas fa-chevron-right text-[9px]"></i> السابقة
                </button>
                <button onclick="markPageRead()" class="flex-1 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:linear-gradient(135deg,#d4a853,#b8860b);color:#1a1207;box-shadow:0 3px 12px rgba(212,168,83,.22);">
                    ✓ أنهيت الصفحة
                </button>
                <button onclick="nextPage()" class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:rgba(212,168,83,.08);color:#d4a853;border:1px solid rgba(212,168,83,.1);min-width:80px;justify-content:center;flex-shrink:0;">
                    التالية <i class="fas fa-chevron-left text-[9px]"></i>
                </button>
            </div>
        </div>`;
}

// ── LOAD PAGE ──
function splitBasmala(text) {
    if (!text) return { basmala: '', text: text };

    // Normalize Arabic diacritics + script variants for comparison
    const normChar = c => c
        .replace(/[\u064B-\u065F\u0670\u0640\s]/g, '') // remove tashkeel + tatweel + superscript alef + space
        .replace(/[\u0671\u0622\u0623\u0625\u0627]/g, 'ا') // unify alef variants incl. wasla
        .replace(/ة/g, 'ه').replace(/ى/g, 'ي');

    const BASMALA_NORM = 'بسماللهالرحمنالرحيم'; // Continuous no space

    const textNormStr = text.split('').map(normChar).join('');
    if (!textNormStr.startsWith(BASMALA_NORM)) return { basmala: '', text: text };

    // Walk original text char-by-char to find end of basmala, matching normalized chars
    let ti = 0, bi = 0;
    while (ti < text.length && bi < BASMALA_NORM.length) {
        const nc = normChar(text[ti]);
        if (!nc) { ti++; continue; } // skip diacritics/spaces in source
        if (nc === BASMALA_NORM[bi]) { bi++; ti++; }
        else { ti++; }
    }
    // Skip any trailing whitespace/diacritics after basmala
    while (ti < text.length && /[\u064B-\u065F\u0670\u0640\s]/.test(text[ti])) ti++;

    const basmala = text.slice(0, ti).trim();
    const remainingText = text.slice(ti).trim();
    return {
        basmala: basmala,
        text: remainingText || text
    };
}

async function loadPage(pageNum) {
    quranState.currentPage = pageNum;
    localStorage.setItem('quranLastPage', pageNum);
    const lbl = document.getElementById('quran-page-label');
    if (lbl) lbl.textContent = `الصفحة ${pageNum}`;
    const strip = document.getElementById('quran-progress-strip');
    if (strip) strip.style.width = ((pageNum - 1) / 603 * 100).toFixed(2) + '%';
    const area = document.getElementById('quran-reader-area'); if (!area) return;

    area.innerHTML = `<div class="flex items-center justify-center py-16"><div style="width:26px;height:26px;border:2px solid rgba(212,168,83,.15);border-top-color:#d4a853;border-radius:50%;animation:spin .8s linear infinite;"></div></div>`;

    const allSurahs = await dbGetAll('quranText');
    if (!allSurahs?.length) { area.innerHTML = `<div class="text-center py-16 opacity-30" style="color:#d4a853;">لم يتم تحميل القرآن</div>`; return; }

    const pageGroups = [];
    allSurahs.sort((a, b) => a.surahNum - b.surahNum).forEach(surah => {
        const ayahsInPage = surah.ayahs.filter(a => a.page === pageNum);
        if (ayahsInPage.length) pageGroups.push({ surahNum: surah.surahNum, surahName: surah.name, ayahs: ayahsInPage });
    });
    if (!pageGroups.length) { area.innerHTML = `<div class="text-center py-16 opacity-30" style="color:#d4a853;">الصفحة غير موجودة</div>`; return; }

    const firstJuz = pageGroups[0]?.ayahs[0]?.juz;
    let html = `<div class="flex items-center justify-between mb-4 px-1 select-none">
        <span class="text-[10px] opacity-25" style="color:#d4a853;font-family:'Tajawal',sans-serif;">الجزء ${firstJuz || ''}</span>
        <span class="text-[10px] opacity-25" style="color:#d4a853;font-family:'Tajawal',sans-serif;">صفحة ${pageNum}</span>
    </div>`;

    pageGroups.forEach(group => {
        const hasFirstAyah = group.ayahs.some(a => a.number === 1);
        let extractedBasmala = null;

        // Try to extract basmala from the text for Surahs other than Al-Fatiha
        if (hasFirstAyah && group.surahNum !== 1) {
            const firstAyah = group.ayahs.find(a => a.number === 1);
            let result = splitBasmala(firstAyah.text);
            if (result.basmala) {
                extractedBasmala = result.basmala;
                firstAyah.display_text = result.text;
            }
        }

        if (hasFirstAyah) {
            html += `<div class="text-center my-6">
                <div class="flex items-center gap-3 justify-center mb-3">
                    <div style="height:1px;width:50px;background:linear-gradient(to right,transparent,rgba(212,168,83,.35));"></div>
                    <span style="color:rgba(212,168,83,.3);font-size:0.75rem;">✦ ✦ ✦</span>
                    <div style="height:1px;width:50px;background:linear-gradient(to left,transparent,rgba(212,168,83,.35));"></div>
                </div>
                <div class="inline-block px-6 py-2.5 rounded-2xl" style="background:rgba(212,168,83,.07);border:1px solid rgba(212,168,83,.14);">
                    <span class="text-lg font-bold" style="color:#d4a853;font-family:'Amiri',serif;text-shadow:0 0 10px rgba(212,168,83,.2);">سورة ${group.surahName}</span>
                </div>
                <div class="flex items-center gap-3 justify-center mt-3">
                    <div style="height:1px;width:50px;background:linear-gradient(to right,transparent,rgba(212,168,83,.35));"></div>
                    <span style="color:rgba(212,168,83,.3);font-size:0.75rem;">✦ ✦ ✦</span>
                    <div style="height:1px;width:50px;background:linear-gradient(to left,transparent,rgba(212,168,83,.35));"></div>
                </div>
            </div>`;

            // Basmala centered on top for surahs except Tawba (9)
            if (group.surahNum !== 1 && group.surahNum !== 9) {
                const bText = extractedBasmala || `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`;
                html += `<p class="text-center mb-5" style="font-family:'Amiri',serif;font-size:1.28rem;color:rgba(212,168,83,.65);letter-spacing:0.02em;line-height:2;">${bText}</p>`;
            }
        }
        html += `<div style="font-family:'Amiri',serif;font-size:1.28rem;line-height:2.8;color:#c8a24a;text-align:justify;text-shadow:0 0 3px rgba(212,168,83,.06);">`;
        group.ayahs.forEach(a => {
            let text = a.display_text !== undefined ? a.display_text : a.text;
            html += `<span id="ayah-${group.surahNum}-${a.number}" class="quran-word-group" data-surah="${group.surahNum}" data-ayah="${a.number}">${text}</span><span class="select-none" style="display:inline;font-family:'Tajawal',sans-serif;font-size:0.58rem;color:rgba(212,168,83,.38);vertical-align:super;margin:0 1px;"> ﴿${a.number}﴾ </span>`;
        });
        html += `</div>`;
    });

    area.innerHTML = html;
    area.scrollTop = 0;

    if (quranState.isPlaying && quranState.currentAudioSurah > 0) {
        const data = await dbGet('quranText', quranState.currentAudioSurah).catch(() => null);
        if (data?.ayahs[quranState.currentAyahIndex]) {
            const ayahNum = data.ayahs[quranState.currentAyahIndex].number;
            const span = document.getElementById(`ayah-${quranState.currentAudioSurah}-${ayahNum}`);
            if (span) { highlightAyahSpan(span); setTimeout(() => span.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120); }
        }
    }
}

function nextPage() { if (quranState.currentPage < 604) loadPage(quranState.currentPage + 1); }
function prevPage() { if (quranState.currentPage > 1) loadPage(quranState.currentPage - 1); }

// ── SURAH LIST VIEW ──
async function showSurahList() {
    const area = document.getElementById('quran-reader-area'); if (!area) return;
    area.innerHTML = `<div class="flex justify-center py-12"><div style="width:24px;height:24px;border:2px solid rgba(212,168,83,.2);border-top-color:#d4a853;border-radius:50%;animation:spin .8s linear infinite;"></div></div>`;

    let cachedAudio = new Set();
    try {
        const all = await dbGetAll('quranAudio');
        all.forEach(item => {
            const parts = item.key.split('_');
            if (parts[1] && parts[2] == quranState.selectedReciter.id) {
                cachedAudio.add(parseInt(parts[1]));
            }
        });
    } catch (e) { }

    const log = getQuranDailyLog(); const goal = parseInt(localStorage.getItem('quranDailyGoal') || '0'); const streak = getQuranStreak();
    let html = `
        <div class="flex gap-2 mb-4">
            <div class="flex-1 rounded-xl py-3 text-center" style="background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.1);"><div class="text-lg font-bold" style="color:#d4a853;">${streak}</div><div class="text-[9px] opacity-40" style="color:#8b7355;">🔥 يوم</div></div>
            <div class="flex-1 rounded-xl py-3 text-center" style="background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.1);"><div class="text-lg font-bold" style="color:#d4a853;">${log.pagesRead.length}${goal > 0 ? '/' + goal : ''}</div><div class="text-[9px] opacity-40" style="color:#8b7355;">📖 اليوم</div></div>
            <div class="flex-1 rounded-xl py-3 text-center" style="background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.1);"><div class="text-lg font-bold" style="color:#d4a853;">${cachedAudio.size}</div><div class="text-[9px] opacity-40" style="color:#8b7355;">🔊 أوفلاين</div></div>
        </div>
        <button onclick="returnToReader()" class="w-full flex items-center justify-center gap-2 py-2.5 mb-3 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:rgba(212,168,83,.08);border:1px solid rgba(212,168,83,.1);color:#d4a853;">
            <i class="fas fa-book-open text-[10px]"></i> العودة للقراءة — الصفحة ${quranState.currentPage}
        </button>
        <button id="download-all-btn" onclick="downloadAllSurahs()" class="w-full flex items-center justify-center gap-2 py-2.5 mb-4 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:linear-gradient(135deg,rgba(180,83,9,.18),rgba(212,168,83,.12));border:1px solid rgba(180,83,9,.2);color:#b45309;">
            <i class="fas fa-download text-[10px]"></i> <span id="download-all-label">تحميل جميع السور للاستماع أوفلاين (${114 - cachedAudio.size} متبقية)</span>
        </button>
        <div>`;
    SURAH_LIST.forEach(s => {
        const isOffline = cachedAudio.has(s.n);
        html += `<div class="flex items-center gap-3 py-2.5 px-2" style="border-bottom:1px solid rgba(212,168,83,.06);">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style="background:rgba(212,168,83,.08);color:rgba(212,168,83,.5);font-family:'Tajawal',sans-serif;">${s.n}</div>
            <div class="flex-1 min-w-0 cursor-pointer active:opacity-70 transition-opacity" onclick="jumpToSurah(${s.n})">
                <div class="text-sm font-bold" style="color:#d4a853;font-family:'Amiri',serif;">${s.name}</div>
                <div class="text-[10px] opacity-35" style="color:#8b7355;">${s.ayahs} آية · ${s.type === 'Meccan' ? 'مكية' : 'مدنية'}</div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
                ${isOffline ? `<span class="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style="background:rgba(212,168,83,.12);color:rgba(212,168,83,.6);">✓</span>` : `<button onclick="downloadAudioSurah(${s.n})" class="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform" style="background:rgba(212,168,83,.07);color:rgba(212,168,83,.45);" title="تحميل"><i class="fas fa-download text-[9px]"></i></button>`}
                <span id="audio-status-${s.n}" class="text-[8px] opacity-30 w-7 text-center" style="color:#8b7355;"></span>
                <button onclick="playAudio(${s.n})" id="play-btn-${s.n}" class="w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-transform" style="background:rgba(212,168,83,.14);color:#d4a853;">
                    <i class="fas fa-play text-[10px]"></i>
                </button>
            </div>
        </div>`;
    });
    html += `</div>`;
    area.innerHTML = html;
}

async function returnToReader() {
    const area = document.getElementById('quran-reader-area');
    if (area) area.innerHTML = '';
    await loadPage(quranState.currentPage);
}

// ── ACHIEVEMENTS ──
function showQuranAchievements() {
    const area = document.getElementById('quran-reader-area'); if (!area) return;
    const streak = getQuranStreak(), goal = parseInt(localStorage.getItem('quranDailyGoal') || '0'), log = getQuranDailyLog();
    let totalPages = 0, daysRead = 0, dayBars = ''; const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        const key = `quranDaily_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dl = localStorage.getItem(key); let parsed = dl ? JSON.parse(dl) : null; let pages = parsed ? (Array.isArray(parsed.pagesRead) ? parsed.pagesRead.length : (parsed.pagesRead || 0)) : 0;
        if (pages > 0) { totalPages += pages; daysRead++; }
        const h = goal > 0 ? Math.min(100, (pages / goal) * 100) : (pages > 0 ? 100 : 0);
        const color = (pages >= goal && goal > 0) ? '#d4a853' : pages > 0 ? '#8b6914' : 'rgba(212,168,83,.07)';
        dayBars += `<div class="flex-1 rounded-sm" style="height:${Math.max(3, h * 0.36)}px;background:${color};min-width:2px;"></div>`;
    }
    area.innerHTML = `<div class="py-4">
        <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold" style="color:#d4a853;">🏆 إنجازاتك</h3>
            <button onclick="returnToReader()" class="text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;">← قراءة</button>
        </div>
        <div class="grid grid-cols-3 gap-2.5 mb-5">
            <div class="py-4 rounded-2xl text-center" style="background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.1);"><div class="text-2xl font-bold mb-1" style="color:#d4a853;">${streak}</div><div class="text-[9px] opacity-40" style="color:#8b7355;">🔥 يوم متتالي</div></div>
            <div class="py-4 rounded-2xl text-center" style="background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.1);"><div class="text-2xl font-bold mb-1" style="color:#d4a853;">${totalPages}</div><div class="text-[9px] opacity-40" style="color:#8b7355;">📄 صفحة (٣٠ي)</div></div>
            <div class="py-4 rounded-2xl text-center" style="background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.1);"><div class="text-2xl font-bold mb-1" style="color:#d4a853;">${daysRead}</div><div class="text-[9px] opacity-40" style="color:#8b7355;">📅 يوم قراءة</div></div>
        </div>
        <p class="text-[10px] mb-2 opacity-35" style="color:#d4a853;">آخر 30 يوماً</p>
        <div class="flex items-end gap-px rounded-xl px-2 py-2.5" style="background:rgba(212,168,83,.04);border:1px solid rgba(212,168,83,.06);min-height:32px;">${dayBars}</div>
        <p class="text-[10px] mt-3 text-center opacity-25" style="color:#8b7355;">اليوم: ${log.pagesRead.length} صفحات${goal ? ' / ' + goal : ''}</p>
    </div>`;
}

// ── SETTINGS ──
function showQuranSettings() {
    const area = document.getElementById('quran-reader-area'); if (!area) return;
    const goal = parseInt(localStorage.getItem('quranDailyGoal') || '0');
    const log = getQuranDailyLog();
    const readCount = log.pagesRead.length;
    area.innerHTML = `<div class="py-4">
        <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold" style="color:#d4a853;">⚙️ الإعدادات</h3>
            <button onclick="returnToReader()" class="text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;">← قراءة</button>
        </div>
        <div class="mb-4 p-4 rounded-2xl" style="background:rgba(212,168,83,.05);border:1px solid rgba(212,168,83,.1);">
            <div class="flex items-center justify-between mb-2"><h4 class="text-xs font-bold" style="color:#d4a853;">📖 الوِرد اليومي</h4><span class="text-[10px] opacity-35" style="color:#8b7355;">${readCount}${goal > 0 ? '/' + goal : ''} اليوم</span></div>
            <div class="grid grid-cols-4 gap-2 mb-2.5">
                ${[1, 2, 5, 10, 15, 20, 30, 0].map(n => `<button onclick="setDailyGoal(${n})" class="py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:${goal === n ? 'linear-gradient(135deg,#d4a853,#b8860b)' : 'rgba(212,168,83,.07)'};color:${goal === n ? '#1a1207' : '#d4a853'};border:1px solid rgba(212,168,83,.1);">${n === 0 ? 'لا' : n}</button>`).join('')}
            </div>
            <div class="flex gap-2">
                <input id="custom-goal-input" type="number" min="1" max="604" placeholder="عدد مخصص..." class="flex-1 text-xs rounded-xl px-3 py-2 outline-none" style="background:rgba(212,168,83,.07);border:1px solid rgba(212,168,83,.14);color:#d4a853;" value="${goal > 0 && ![1, 2, 5, 10, 15, 20, 30].includes(goal) ? goal : ''}">
                <button onclick="setCustomGoal()" class="px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform" style="background:rgba(212,168,83,.15);color:#d4a853;">حفظ</button>
            </div>
        </div>
        <div class="mb-5">
            <h4 class="text-xs font-bold mb-2.5" style="color:#d4a853;">🎤 القارئ المفضّل</h4>
            <div class="space-y-1.5">
                ${POPULAR_RECITERS.map(r => `<button onclick="selectReciter(${r.id})" class="w-full flex items-center gap-3 p-3 rounded-xl active:scale-[.98] transition-transform text-right" style="background:${quranState.selectedReciter.id === r.id ? 'rgba(212,168,83,.12)' : 'rgba(212,168,83,.04)'};border:1px solid ${quranState.selectedReciter.id === r.id ? 'rgba(212,168,83,.22)' : 'rgba(212,168,83,.07)'};color:#d4a853;"><span class="text-[10px] w-4">${quranState.selectedReciter.id === r.id ? '✓' : ''}</span><span class="text-sm">${r.name}</span></button>`).join('')}
            </div>
        </div>
        <button onclick="deleteQuranData()" class="w-full py-3 rounded-2xl text-sm font-bold active:scale-[.98] transition-transform" style="background:rgba(239,68,68,.07);color:#f87171;border:1px solid rgba(239,68,68,.1);">🗑️ حذف جميع بيانات القرآن</button>
    </div>`;
}
function selectReciter(id) { const r = POPULAR_RECITERS.find(x => x.id === id); if (r) { quranState.selectedReciter = r; localStorage.setItem('quranReciter', JSON.stringify(r)); showToast(`✅ ${r.name}`); showQuranSettings(); } }
function selectReciterAndReturn(id) { const r = POPULAR_RECITERS.find(x => x.id === id); if (r) { quranState.selectedReciter = r; localStorage.setItem('quranReciter', JSON.stringify(r)); showToast(`✅ ${r.name}`); returnToReader(); } }
function showReciterPicker() {
    const area = document.getElementById('quran-reader-area'); if (!area) return;
    let html = `<div class="py-4"><div class="flex items-center justify-between mb-4"><h3 class="text-base font-bold" style="color:#d4a853;">🎤 اختر القارئ</h3><button onclick="returnToReader()" class="text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-transform" style="background:rgba(212,168,83,.1);color:#d4a853;">← قراءة</button></div><p class="text-xs mb-4 opacity-40" style="color:#8b7355;">القارئ الحالي: <strong style="color:#d4a853;">${quranState.selectedReciter.name}</strong></p><div class="space-y-1.5">`;
    POPULAR_RECITERS.forEach(r => {
        const isCur = quranState.selectedReciter.id === r.id;
        html += `<button onclick="selectReciterAndReturn(${r.id})" class="w-full flex items-center gap-3 p-3.5 rounded-xl active:scale-[.98] transition-transform text-right" style="background:${isCur ? 'rgba(212,168,83,.14)' : 'rgba(212,168,83,.04)'};border:1px solid ${isCur ? 'rgba(212,168,83,.25)' : 'rgba(212,168,83,.08)'};color:#d4a853;"><span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0" style="background:${isCur ? 'linear-gradient(135deg,#d4a853,#b8860b)' : 'rgba(212,168,83,.1)'};color:${isCur ? '#1a1207' : '#d4a853'};">${isCur ? '✓' : '♪'}</span><span class="text-sm font-medium">${r.name}</span></button>`;
    });
    html += `</div></div>`;
    area.innerHTML = html;
}
async function deleteQuranData() {
    if (!confirm('هل أنت متأكد من حذف جميع بيانات القرآن؟')) return;
    try { await dbClearStore('quranText'); await dbClearStore('quranAudio'); await dbPut('settings', { id: 'textDownloaded', value: false }); quranState.textDownloaded = false; showToast('✅ تم الحذف'); renderQuranDownloadView(); }
    catch (e) { showToast('⚠️ حدث خطأ'); }
}

// ── SEARCH ──
function showQuranSearch() {
    const row = document.getElementById('quran-search-row'); if (!row) return;
    row.classList.toggle('hidden');
    if (!row.classList.contains('hidden')) { const i = document.getElementById('quran-search-input'); if (i) { i.value = ''; setTimeout(() => i.focus(), 50); } }
}
function handleQuranSearch(query) {
    const res = document.getElementById('quran-search-results'); if (!res) return;
    const q = query.trim(); if (!q) { res.classList.add('hidden'); return; }
    const norm = q.replace(/[\u064B-\u065F\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').toLowerCase();
    const matches = SURAH_LIST.filter(s => { const n = s.name.replace(/[\u064B-\u065F\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'); return n.includes(norm) || s.en.toLowerCase().includes(norm) || String(s.n) === q.trim(); }).slice(0, 7);
    if (!matches.length) { res.innerHTML = `<div class="px-4 py-3 text-xs opacity-30" style="color:#d4a853;">لا نتائج</div>`; res.classList.remove('hidden'); return; }
    res.innerHTML = matches.map(s => `<div onclick="jumpToSurah(${s.n})" class="flex items-center justify-between px-4 py-3 cursor-pointer" style="border-bottom:1px solid rgba(212,168,83,.06);" onmouseenter="this.style.background='rgba(212,168,83,.07)'" onmouseleave="this.style.background=''"><div class="flex items-center gap-2.5"><span class="text-[10px] font-bold w-6 text-center" style="color:rgba(212,168,83,.45);">${s.n}</span><span class="text-sm font-bold" style="color:#d4a853;font-family:'Amiri',serif;">${s.name}</span></div><span class="text-[10px] opacity-25" style="color:#8b7355;">${s.ayahs} آية</span></div>`).join('');
    res.classList.remove('hidden');
}
async function jumpToSurah(surahNum) {
    const inp = document.getElementById('quran-search-input'), res = document.getElementById('quran-search-results'), row = document.getElementById('quran-search-row');
    if (inp) inp.value = ''; if (res) res.classList.add('hidden'); if (row) row.classList.add('hidden');
    const data = await dbGet('quranText', surahNum);
    if (!data?.ayahs?.length) { showToast('⚠️ السورة غير محملة'); return; }
    await loadPage(data.ayahs[0].page || 1);
    showToast(`📖 سورة ${SURAH_LIST[surahNum - 1].name}`);
}
document.addEventListener('click', e => {
    if (!e.target.closest('#quran-search-input') && !e.target.closest('#quran-search-results')) { const r = document.getElementById('quran-search-results'); if (r) r.classList.add('hidden'); }
});

// ── GOLD GLOW HIGHLIGHT (pure glow, no box) ──
function highlightAyahSpan(span) {
    document.querySelectorAll('.quran-word-group').forEach(el => { el.style.color = ''; el.style.textShadow = ''; el.style.fontWeight = ''; });
    if (!span) return;
    span.style.color = '#f5d48a';
    span.style.textShadow = '0 0 14px rgba(212,168,83,1), 0 0 28px rgba(212,168,83,0.7), 0 0 52px rgba(212,168,83,0.3)';
    span.style.fontWeight = 'bold';
}

// ── AUDIO BAR ──
function updateAudioBar() {
    const bar = document.getElementById('quran-now-playing'), btn = document.getElementById('reader-play-btn'), lbl = document.getElementById('quran-playing-label');
    if (!bar) return;
    if (!quranState.currentAudioSurah) { bar.style.display = 'none'; return; }
    bar.style.display = 'block';
    const sm = SURAH_LIST[quranState.currentAudioSurah - 1];
    if (lbl) lbl.textContent = `${sm.name} · آية ${quranState.currentAyahIndex + 1} من ${sm.ayahs}`;
    if (btn) btn.innerHTML = quranState.isPlaying ? '<i class="fas fa-pause text-xs"></i>' : '<i class="fas fa-play text-xs"></i>';
}

// ── PLAY AUDIO (QURAN.COM V4) ──
async function playAudio(surahNum, startAyahIndex = 0) {
    let data = await dbGet('quranText', surahNum);
    if (!data) { showToast('⏳ جاري تحميل النص...'); await _downloadQuranTextHidden(); data = await dbGet('quranText', surahNum); if (!data) { showToast('⚠️ تعذر تحميل النص'); return; } }

    if (quranState.audioPlayer) {
        quranState.audioPlayer.pause();
        quranState.audioPlayer.onended = null;
        quranState.audioPlayer.ontimeupdate = null;
        quranState.audioPlayer.onerror = null;
    }
    if (quranState.currentAudioSurah) { const ob = document.getElementById('play-btn-' + quranState.currentAudioSurah); if (ob) ob.innerHTML = '<i class="fas fa-play text-[10px]"></i>'; }

    // Init Player
    if (!quranState.audioPlayer) quranState.audioPlayer = new Audio();

    // Check Cache for current reciter
    let audioSrc = null;
    let timestamps = null;
    try {
        const cached = await dbGet('quranAudio', 'audio_' + surahNum + '_' + quranState.selectedReciter.id);
        if (cached && cached.blob) {
            if (quranState._lastBlobURL) { URL.revokeObjectURL(quranState._lastBlobURL); }
            audioSrc = URL.createObjectURL(cached.blob);
            quranState._lastBlobURL = audioSrc;
            timestamps = cached.timestamps;
        }
    } catch (e) { }

    // Fetch from API if not cached
    if (!audioSrc || !timestamps) {
        showToast('⏳ جاري جلب التلاوة...');
        try {
            const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${quranState.selectedReciter.id}/${surahNum}?segments=true`);
            const apiData = await res.json();
            if (!apiData.audio_file) throw new Error();
            audioSrc = apiData.audio_file.audio_url;
            timestamps = apiData.audio_file.timestamps;
        } catch (e) {
            showToast('⚠️ تعذر جلب التلاوة (تأكد من اتصالك بالإنترنت)');
            return;
        }
    }

    quranState.currentAudioSurah = surahNum;
    quranState.currentAyahIndex = startAyahIndex;
    quranState.currentTimestamps = timestamps;
    quranState.isPlaying = true;

    const btn = document.getElementById('play-btn-' + surahNum); if (btn) btn.innerHTML = '<i class="fas fa-pause text-[10px]"></i>';
    const mm = document.getElementById('quran-modal'); if (mm) mm.classList.add('active');
    if (!document.getElementById('quran-reader-area')) { await renderQuranReader(); }

    // Go to text page
    const ta = data.ayahs[startAyahIndex];
    if (ta) await loadPage(ta.page || quranState.currentPage);

    quranState.audioPlayer.src = audioSrc;
    quranState.audioPlayer.load();

    // Start from specific ayah
    if (startAyahIndex > 0 && timestamps[startAyahIndex]) {
        quranState.audioPlayer.currentTime = timestamps[startAyahIndex].timestamp_from / 1000;
    }

    quranState.audioPlayer.onended = () => {
        const next = surahNum + 1;
        if (next <= 114) { showToast(`▶ سورة ${SURAH_LIST[next - 1].name}`); playAudio(next, 0); }
        else { quranState.isPlaying = false; quranState.currentAudioSurah = 0; updateAudioBar(); showToast('🎉 ختمة مباركة!'); }
    };

    quranState.audioPlayer.onerror = () => { quranState.isPlaying = false; updateAudioBar(); showToast('⚠️ خطأ في التشغيل'); };

    let lastHighlightIdx = -1;
    quranState.audioPlayer.ontimeupdate = () => {
        if (!quranState.currentTimestamps || !quranState.isPlaying) return;
        const ms = quranState.audioPlayer.currentTime * 1000;

        let activeIdx = timestamps.findIndex(t => ms >= t.timestamp_from && ms <= t.timestamp_to);
        if (activeIdx === -1) {
            // Find closest if in tiny gaps
            const backupIdx = timestamps.findIndex(t => t.timestamp_from > ms);
            activeIdx = backupIdx > 0 ? backupIdx - 1 : (timestamps.length - 1);
        }

        if (activeIdx !== -1 && activeIdx !== lastHighlightIdx) {
            lastHighlightIdx = activeIdx;
            quranState.currentAyahIndex = activeIdx;

            const ayahNumber = data.ayahs[activeIdx]?.number;
            const ayahPage = data.ayahs[activeIdx]?.page;

            const doHighlight = () => {
                const span = document.getElementById(`ayah-${surahNum}-${ayahNumber}`);
                if (span) { highlightAyahSpan(span); span.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                updateAudioBar();
            };

            if (ayahPage && ayahPage !== quranState.currentPage) loadPage(ayahPage).then(doHighlight);
            else doHighlight();
        }
    };

    quranState.audioPlayer.play().catch(() => { quranState.isPlaying = false; updateAudioBar(); });
}

async function toggleReaderPlayPause() {
    if (quranState.isPlaying) {
        if (quranState.audioPlayer) quranState.audioPlayer.pause();
        quranState.isPlaying = false;
        const btn = document.getElementById('play-btn-' + quranState.currentAudioSurah); if (btn) btn.innerHTML = '<i class="fas fa-play text-[10px]"></i>';
    } else {
        if (quranState.audioPlayer && quranState.audioPlayer.paused && quranState.currentAudioSurah > 0) {
            quranState.audioPlayer.play(); quranState.isPlaying = true;
            const btn = document.getElementById('play-btn-' + quranState.currentAudioSurah); if (btn) btn.innerHTML = '<i class="fas fa-pause text-[10px]"></i>';
        } else {
            const all = await dbGetAll('quranText');
            const pg = all.filter(s => s.ayahs.some(a => a.page === quranState.currentPage));
            if (pg.length) await playAudio(pg[0].surahNum, 0);
        }
    }
    updateAudioBar();
}

function skipNextSurah() { if (quranState.currentAudioSurah < 114) playAudio(quranState.currentAudioSurah + 1, 0); }

function prevAyahInQueue() {
    if (quranState.currentAyahIndex > 0 && quranState.currentTimestamps[quranState.currentAyahIndex - 1]) {
        if (quranState.audioPlayer) {
            const prevMs = quranState.currentTimestamps[quranState.currentAyahIndex - 1].timestamp_from;
            quranState.audioPlayer.currentTime = prevMs / 1000;
        }
    }
}

function toggleAudioPlayback(surahNum) {
    if (quranState.currentAudioSurah !== surahNum) return playAudio(surahNum);
    const btn = document.getElementById('play-btn-' + surahNum);
    if (quranState.isPlaying) { if (quranState.audioPlayer) quranState.audioPlayer.pause(); quranState.isPlaying = false; if (btn) btn.innerHTML = '<i class="fas fa-play text-[10px]"></i>'; }
    else { quranState.isPlaying = true; if (quranState.audioPlayer) quranState.audioPlayer.play(); if (btn) btn.innerHTML = '<i class="fas fa-pause text-[10px]"></i>'; }
    updateAudioBar();
}

// ── DOWNLOAD AUDIO ──
async function downloadAudioSurah(surahNum) {
    const el = document.getElementById('audio-status-' + surahNum);
    if (el) el.textContent = 'جاري...';
    try {
        const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${quranState.selectedReciter.id}/${surahNum}?segments=true`);
        const apiData = await res.json();
        if (!apiData.audio_file) throw new Error();

        const audioUrl = apiData.audio_file.audio_url;
        const timestamps = apiData.audio_file.timestamps;

        const blobRes = await fetch(audioUrl);
        if (!blobRes.ok) throw new Error();

        const contentLength = blobRes.headers.get('content-length');
        const reader = blobRes.body.getReader();
        const chunks = [];
        let receivedLength = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            if (el && contentLength) {
                el.textContent = `${Math.round((receivedLength / contentLength) * 100)}%`;
            }
        }

        const blob = new Blob(chunks, { type: 'audio/mpeg' });

        await dbPut('quranAudio', {
            key: 'audio_' + surahNum + '_' + quranState.selectedReciter.id,
            blob,
            timestamps,
            size: receivedLength
        });

        if (el) el.textContent = `✓ ${(receivedLength / 1024 / 1024).toFixed(1)}MB`;
        showToast(`✅ تم تحميل سورة ${SURAH_LIST[surahNum - 1].name}`);
    } catch (e) {
        if (el) el.textContent = '⚠️ فشل';
    }
}

// ── DOWNLOAD ALL SURAHS ──
let _downloadAllRunning = false;

async function downloadAllSurahs() {
    if (_downloadAllRunning) {
        showToast('⏳ التحميل جارٍ بالفعل...');
        return;
    }
    _downloadAllRunning = true;

    const btn = document.getElementById('download-all-btn');
    const label = document.getElementById('download-all-label');

    // Build list of surahs not yet cached
    let cachedAudio = new Set();
    try {
        const all = await dbGetAll('quranAudio');
        all.forEach(item => {
            const parts = item.key.split('_');
            if (parts[2] == quranState.selectedReciter.id) cachedAudio.add(parseInt(parts[1]));
        });
    } catch (e) { }

    const toDownload = SURAH_LIST.filter(s => !cachedAudio.has(s.n));
    if (toDownload.length === 0) {
        if (label) label.textContent = '✅ جميع السور محملة بالفعل';
        if (btn) { btn.style.background = 'rgba(16,185,129,.1)'; btn.style.color = '#065f46'; }
        _downloadAllRunning = false;
        return;
    }

    if (btn) { btn.disabled = true; btn.style.opacity = '0.75'; }

    let done = 0, failed = 0;
    for (const surah of toDownload) {
        if (label) label.textContent = `⬇ تحميل سورة ${surah.name} … (${done + 1}/${toDownload.length})`;
        const el = document.getElementById('audio-status-' + surah.n);
        try {
            const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${quranState.selectedReciter.id}/${surah.n}?segments=true`);
            const apiData = await res.json();
            if (!apiData.audio_file) throw new Error();

            const audioUrl = apiData.audio_file.audio_url;
            const timestamps = apiData.audio_file.timestamps;
            const blobRes = await fetch(audioUrl);
            if (!blobRes.ok) throw new Error();

            const contentLength = blobRes.headers.get('content-length');
            const reader = blobRes.body.getReader();
            const chunks = [];
            let receivedLength = 0;
            while (true) {
                const { done: d, value } = await reader.read();
                if (d) break;
                chunks.push(value);
                receivedLength += value.length;
                if (el && contentLength) el.textContent = `${Math.round((receivedLength / contentLength) * 100)}%`;
            }
            const blob = new Blob(chunks, { type: 'audio/mpeg' });
            await dbPut('quranAudio', {
                key: 'audio_' + surah.n + '_' + quranState.selectedReciter.id,
                blob, timestamps, size: receivedLength
            });
            done++;
            if (el) {
                // Update the row to show cached checkmark instead of download button
                const row = el.closest('div.flex');
                if (row) {
                    const downloadBtn = row.querySelector('button[onclick^="downloadAudioSurah"]');
                    if (downloadBtn) {
                        const check = document.createElement('span');
                        check.className = 'text-[8px] px-1.5 py-0.5 rounded-full font-bold';
                        check.style.cssText = 'background:rgba(212,168,83,.12);color:rgba(212,168,83,.6);';
                        check.textContent = '✓';
                        downloadBtn.replaceWith(check);
                    }
                }
                el.textContent = `✓ ${(receivedLength / 1024 / 1024).toFixed(1)}MB`;
            }
        } catch (e) {
            failed++;
            if (el) el.textContent = '⚠️';
        }

        // Small delay between requests to be polite to the API
        await new Promise(r => setTimeout(r, 400));
    }

    _downloadAllRunning = false;
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }

    const total = done + failed;
    if (failed === 0) {
        if (label) label.textContent = `✅ تم تحميل جميع السور (${done} سورة)`;
        if (btn) { btn.style.background = 'rgba(16,185,129,.1)'; btn.style.color = '#065f46'; btn.style.borderColor = 'rgba(16,185,129,.2)'; }
        showToast(`✅ اكتمل تحميل ${done} سورة للاستماع أوفلاين`);
    } else {
        if (label) label.textContent = `✅ ${done} سورة تم تحميلها — ⚠️ ${failed} فشل`;
        showToast(`تم: ${done} ✓ · فشل: ${failed} ⚠️`);
    }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    const lp = localStorage.getItem('quranLastPage'); if (lp) quranState.currentPage = parseInt(lp);
    loadQuranSettings(); updateQuranDailyTracker();
});