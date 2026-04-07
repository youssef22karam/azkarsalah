// ════════════════════════════════════════════════════
// APP.JS — Core Application Logic (Adhan.js local prayer calculation)
// ════════════════════════════════════════════════════

// ── STATE ──
let state = {
    city: null, prayerTimes: null, nextPrayer: null, nextPrayerName: "",
    timerInterval: null, manualOverride: false, searchTimeout: null,
    currentModalPrayer: null, qada: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    snoozeUntil: {}, bannerCollapsed: false, calcMethod: 'Egyptian',
    reminders: {
        prayerNotificationsEnabled: true,
        prayerReminderOffsetMinutes: 0,
        morningAzkarEnabled: true,
        eveningAzkarEnabled: true,
        sleepAzkarEnabled: true,
        fridayKahfEnabled: true
    },
    nativeConfig: {
        isAndroidApp: false,
        notificationPermissionGranted: false,
        exactAlarmPermissionGranted: false,
        hasSavedCity: false
    }
};
const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
let deferredInstallPrompt = null;

// ── CALC METHOD MAP (Adhan.js) ──
const CALC_METHODS = {
    Egyptian: 'Egyptian',
    UmmAlQura: 'UmmAlQura',
    Kuwait: 'Kuwait',
    Qatar: 'Qatar',
    Dubai: 'Dubai',
    MuslimWorldLeague: 'MuslimWorldLeague',
    NorthAmerica: 'NorthAmerica',
    Singapore: 'Singapore',
    Turkey: 'Turkey',
    Tehran: 'Tehran',
    Karachi: 'Karachi'
};

const DEFAULT_REMINDER_SETTINGS = {
    prayerNotificationsEnabled: true,
    prayerReminderOffsetMinutes: 0,
    morningAzkarEnabled: true,
    eveningAzkarEnabled: true,
    sleepAzkarEnabled: true,
    fridayKahfEnabled: true
};

const DEFAULT_NATIVE_CONFIG = {
    isAndroidApp: false,
    notificationPermissionGranted: false,
    exactAlarmPermissionGranted: false,
    hasSavedCity: false
};

// ── PWA MANIFEST ──
(function injectManifest() {
    const iconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23052e16'/><stop offset='100%25' stop-color='%23065f46'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='url(%23g)'/><ellipse cx='50' cy='34' rx='18' ry='18' fill='rgba(255,255,255,0.9)'/><rect x='14' y='48' width='14' height='34' rx='4' fill='rgba(255,255,255,0.7)'/><ellipse cx='21' cy='46' rx='8' ry='8' fill='rgba(255,255,255,0.8)'/><rect x='72' y='48' width='14' height='34' rx='4' fill='rgba(255,255,255,0.7)'/><ellipse cx='79' cy='46' rx='8' ry='8' fill='rgba(255,255,255,0.8)'/><rect x='24' y='55' width='52' height='27' rx='5' fill='rgba(255,255,255,0.88)'/><path d='M43 82V70c0-3.9 3.1-7 7-7s7 3.1 7 7v12z' fill='rgba(6,95,70,0.45)'/><rect x='30' y='60' width='9' height='9' rx='2.5' fill='rgba(6,95,70,0.3)'/><rect x='61' y='60' width='9' height='9' rx='2.5' fill='rgba(6,95,70,0.3)'/><path d='M50 18c-4 0-6.5 3.5-6.5 7 3-1.5 6.5-1.2 9 1.5C51.5 22 50 18 50 18z' fill='%23f59e0b'/><polygon points='54,15 55,18 58,18 55.5,20 56.5,23 54,21 51.5,23 52.5,20 50,18 53,18' fill='%23f59e0b'/></svg>`;
    const manifest = {
        name: "أذكاري وصلاتي", short_name: "أذكاري وصلاتي", description: "أذكار المسلم مع مواقيت الصلاة محليًا", start_url: "./", display: "standalone", orientation: "portrait-primary", background_color: "#052e16", theme_color: "#052e16", lang: "ar", dir: "rtl",
        icons: [{ src: `data:image/svg+xml,${iconSvg}`, sizes: "192x192", type: "image/svg+xml" }, { src: `data:image/svg+xml,${iconSvg}`, sizes: "512x512", type: "image/svg+xml" }]
    };
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
    const link = document.createElement('link'); link.rel = 'manifest'; link.href = URL.createObjectURL(blob);
    document.head.appendChild(link);
})();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstallPrompt = e; document.getElementById('install-btn').classList.remove('hidden'); });
window.addEventListener('appinstalled', () => { document.getElementById('install-btn').classList.add('hidden'); showToast('✅ تم تثبيت التطبيق!'); deferredInstallPrompt = null; });
function triggerInstall() { if (!deferredInstallPrompt) { showToast('افتح الموقع في Chrome أو Safari للتثبيت'); return; } deferredInstallPrompt.prompt(); deferredInstallPrompt.userChoice.then(c => { if (c.outcome === 'accepted') showToast('🎉 جاري التثبيت...'); deferredInstallPrompt = null; document.getElementById('install-btn').classList.add('hidden'); }); }
window.addEventListener('offline', () => document.body.classList.add('offline'));
window.addEventListener('online', () => document.body.classList.remove('offline'));

// ════════════════════════════════════════════════════
// ADHAN.JS PRAYER TIMES — LOCAL CALCULATION
// ════════════════════════════════════════════════════
function getAdhanMethod(methodName) {
    const methods = {
        Egyptian: adhan.CalculationMethod.Egyptian(),
        UmmAlQura: adhan.CalculationMethod.UmmAlQura(),
        Kuwait: adhan.CalculationMethod.Kuwait(),
        Qatar: adhan.CalculationMethod.Qatar(),
        Dubai: adhan.CalculationMethod.Dubai(),
        MuslimWorldLeague: adhan.CalculationMethod.MuslimWorldLeague(),
        NorthAmerica: adhan.CalculationMethod.NorthAmerica(),
        Singapore: adhan.CalculationMethod.Singapore(),
        Turkey: adhan.CalculationMethod.Turkey(),
        Tehran: adhan.CalculationMethod.Tehran(),
        Karachi: adhan.CalculationMethod.Karachi()
    };
    return methods[methodName] || methods.Egyptian;
}

function calculatePrayerTimes(lat, lon) {
    const coords = new adhan.Coordinates(lat, lon);
    const params = getAdhanMethod(state.calcMethod);
    const date = new Date();
    const pt = new adhan.PrayerTimes(coords, date, params);
    return { Fajr: pt.fajr, Sunrise: pt.sunrise, Dhuhr: pt.dhuhr, Asr: pt.asr, Maghrib: pt.maghrib, Isha: pt.isha };
}

function fetchPrayerTimes(lat, lon) {
    const loader = document.getElementById('loader-spinner');
    const banner = document.getElementById('prayer-banner');
    const empty = document.getElementById('empty-state');
    loader.classList.remove('hidden'); banner.classList.add('hidden'); empty.classList.add('hidden');
    try {
        const times = calculatePrayerTimes(lat, lon);
        processPrayerTimes(times);
    } catch (err) {
        console.error('Prayer calc error:', err);
        loader.classList.add('hidden'); empty.classList.remove('hidden');
        showToast('⚠️ تعذر حساب المواقيت');
    }
}

function processPrayerTimes(times) {
    state.prayerTimes = times;
    const fmt = d => d.toLocaleTimeString('ar-SA', { hour: 'numeric', minute: '2-digit' });
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(k => {
        const K = k.charAt(0).toUpperCase() + k.slice(1);
        document.getElementById('t-' + k).innerText = fmt(state.prayerTimes[K]);
        document.getElementById('cs-' + k).innerText = fmt(state.prayerTimes[K]);
    });
    document.getElementById('loader-spinner').classList.add('hidden');
    document.getElementById('prayer-banner').classList.remove('hidden');
    applyBannerState(false);
    updatePrayerDots(); updateTodayCount(); updateStreak();
    startCountdown(); checkAutoTabSwitch();
    setTimeout(checkPrayerConfirmation, 2500);
}

// ── SETTINGS MODAL ──
function openSettingsModal() {
    document.getElementById('settings-modal').classList.add('active');
    document.getElementById('settings-city-name').textContent = state.city ? state.city.name : 'غير محدد';
    document.getElementById('calc-method-select').value = state.calcMethod;
    refreshReminderSettingsUI();
}
function closeSettingsModal() { document.getElementById('settings-modal').classList.remove('active'); }
function changeCalcMethod(method) {
    state.calcMethod = method;
    localStorage.setItem('calcMethod', method);
    if (state.city) fetchPrayerTimes(state.city.lat, state.city.lon);
    syncNativeSettings();
    showToast('✅ تم تحديث طريقة الحساب');
}

// ════════════════════════════════════════════════════
// BANNER — ONE-WAY SCROLL COLLAPSE
// ════════════════════════════════════════════════════
function hasAndroidBridge() {
    return typeof window !== 'undefined' && typeof window.AndroidBridge !== 'undefined';
}

function safeJsonParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch (_) { return fallback; }
}

function loadReminderSettings() {
    const stored = safeJsonParse(localStorage.getItem('nativeReminderSettings'), {});
    state.reminders = { ...DEFAULT_REMINDER_SETTINGS, ...(stored || {}) };
    state.nativeConfig = { ...DEFAULT_NATIVE_CONFIG };

    if (hasAndroidBridge() && typeof window.AndroidBridge.getNativeConfig === 'function') {
        const nativeConfig = safeJsonParse(window.AndroidBridge.getNativeConfig(), null);
        if (nativeConfig) state.nativeConfig = { ...state.nativeConfig, ...nativeConfig };
    }

    refreshReminderSettingsUI();
}

function saveReminderSettings() {
    localStorage.setItem('nativeReminderSettings', JSON.stringify(state.reminders));
    refreshReminderSettingsUI();
    syncNativeSettings();
}

function syncNativeSettings() {
    if (!hasAndroidBridge() || typeof window.AndroidBridge.syncSettings !== 'function') return;
    const payload = {
        city: state.city ? {
            name: state.city.name,
            country: state.city.country || '',
            lat: Number(state.city.lat),
            lon: Number(state.city.lon)
        } : null,
        calcMethod: state.calcMethod,
        reminders: state.reminders
    };
    try { window.AndroidBridge.syncSettings(JSON.stringify(payload)); } catch (_) { }
}

function toggleReminderSetting(key, checked) {
    state.reminders[key] = !!checked;
    saveReminderSettings();
}

function setPrayerReminderOffset(value) {
    const parsed = parseInt(value || '0', 10);
    state.reminders.prayerReminderOffsetMinutes = Number.isFinite(parsed) ? Math.max(0, Math.min(30, parsed)) : 0;
    saveReminderSettings();
}

function refreshReminderSettingsUI() {
    const nativeCard = document.getElementById('native-reminder-card');
    const browserNote = document.getElementById('browser-reminder-note');
    if (nativeCard) nativeCard.classList.toggle('hidden', !state.nativeConfig.isAndroidApp);
    if (browserNote) browserNote.classList.toggle('hidden', !!state.nativeConfig.isAndroidApp);

    const installBtn = document.getElementById('install-btn');
    if (installBtn && state.nativeConfig.isAndroidApp) installBtn.classList.add('hidden');

    const toggleMap = {
        'setting-prayer-notifications': 'prayerNotificationsEnabled',
        'setting-morning-azkar': 'morningAzkarEnabled',
        'setting-evening-azkar': 'eveningAzkarEnabled',
        'setting-sleep-azkar': 'sleepAzkarEnabled',
        'setting-friday-kahf': 'fridayKahfEnabled'
    };

    Object.entries(toggleMap).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.checked = !!state.reminders[key];
    });

    const offset = document.getElementById('prayer-reminder-offset');
    if (offset) offset.value = String(state.reminders.prayerReminderOffsetMinutes ?? 0);

    const notifStatus = document.getElementById('notif-permission-status');
    if (notifStatus) {
        notifStatus.textContent = state.nativeConfig.notificationPermissionGranted ? 'مفعّل' : 'غير مفعّل';
        notifStatus.className = `native-status-pill ${state.nativeConfig.notificationPermissionGranted ? 'ok' : 'warn'}`;
    }

    const exactStatus = document.getElementById('exact-alarm-status');
    if (exactStatus) {
        exactStatus.textContent = state.nativeConfig.exactAlarmPermissionGranted ? 'دقيق' : 'تقريبي';
        exactStatus.className = `native-status-pill ${state.nativeConfig.exactAlarmPermissionGranted ? 'ok' : 'warn'}`;
    }

    const summary = document.getElementById('native-sync-summary');
    if (summary) {
        if (!state.nativeConfig.isAndroidApp) summary.textContent = 'هذا القسم يظهر داخل تطبيق Android فقط.';
        else if (!state.city) summary.textContent = 'اختر مدينة أولًا ثم فعّل الأذونات للحصول على تنبيهات تعمل في الخلفية.';
        else summary.textContent = `ستُزامن التنبيهات لمدينة ${state.city.name} باستخدام طريقة ${state.calcMethod}.`;
    }
}

function requestNotificationPermission() {
    if (hasAndroidBridge() && typeof window.AndroidBridge.requestNotificationPermission === 'function') {
        window.AndroidBridge.requestNotificationPermission();
    } else {
        showToast('هذا الخيار يعمل داخل تطبيق Android');
    }
}

function requestExactAlarmPermission() {
    if (hasAndroidBridge() && typeof window.AndroidBridge.requestExactAlarmPermission === 'function') {
        window.AndroidBridge.requestExactAlarmPermission();
    } else {
        showToast('هذا الخيار يعمل داخل تطبيق Android');
    }
}

function requestNativeSync() {
    syncNativeSettings();
    if (hasAndroidBridge() && typeof window.AndroidBridge.syncNow === 'function') {
        window.AndroidBridge.syncNow();
        showToast('تمت مزامنة التنبيهات مع Android');
    } else {
        showToast('المزامنة الكاملة تعمل داخل تطبيق Android');
    }
}

window.onNativePermissionStatusChanged = function (payload) {
    const parsed = typeof payload === 'string' ? safeJsonParse(payload, {}) : (payload || {});
    state.nativeConfig = { ...state.nativeConfig, ...parsed };
    refreshReminderSettingsUI();
};

window.handleNativeOpenTab = function (tab) {
    if (!tab) return;
    state.manualOverride = true;
    renderCategory(tab);
};

let _bannerLocked = false;

function _lockBanner(ms = 500) { _bannerLocked = true; setTimeout(() => { _bannerLocked = false; }, ms); }

function loadBannerPreference() {
    const s = localStorage.getItem('bannerCollapsed');
    if (s === 'true') { state.bannerCollapsed = true; applyBannerState(false); }
    _syncAria();
}

function toggleBanner() {
    if (_bannerLocked) return;
    state.bannerCollapsed = !state.bannerCollapsed;
    localStorage.setItem('bannerCollapsed', state.bannerCollapsed);
    if (!state.bannerCollapsed && window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    applyBannerState(true);
    _syncAria();
    _lockBanner();
}

function collapseBanner() {
    if (state.bannerCollapsed || _bannerLocked) return;
    state.bannerCollapsed = true;
    // Don't persist scroll-triggered collapse
    applyBannerState(true);
    _syncAria();
    _lockBanner();
}

function expandBanner() {
    if (!state.bannerCollapsed || _bannerLocked) return;
    state.bannerCollapsed = false;
    localStorage.setItem('bannerCollapsed', false);
    applyBannerState(true);
    _syncAria();
    _lockBanner();
}

function applyBannerState(animate) {
    const b = document.getElementById('prayer-banner'); if (!b) return;
    const bd = document.getElementById('banner-body');
    const fab = document.getElementById('banner-expand-fab');
    if (!animate) {
        b.style.transition = 'none';
        if (bd) bd.style.transition = 'none';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            b.style.transition = '';
            if (bd) bd.style.transition = '';
        }));
    }
    if (state.bannerCollapsed) {
        b.classList.add('is-collapsed');
        b.classList.remove('is-expanded');
        if (fab) fab.classList.remove('hidden');
    } else {
        b.classList.remove('is-collapsed');
        if (fab) fab.classList.add('hidden');
        requestAnimationFrame(() => b.classList.add('is-expanded'));
    }
}

function _syncAria() {
    const bar = document.getElementById('banner-compact-bar');
    if (bar) bar.setAttribute('aria-expanded', (!state.bannerCollapsed).toString());
}

function initBannerScrollCollapse() {
    // ── How the loop-free expand-on-scroll-up works ──────────────────────────
    //
    // PROBLEM: When the banner collapses the sticky header shrinks, which
    //   shifts all page content upward. The browser fires scroll events as
    //   scrollY drops toward 0. A naïve "expand when scrollY ≈ 0" rule fires
    //   on those ghost events, instantly re-expanding → feedback loop.
    //
    // SOLUTION — two-part guard:
    //   1. _suppressScroll: set true on any state change, cleared after
    //      SUPPRESS_MS. This eats every ghost scroll event that the layout
    //      shift generates. During suppress, NEITHER collapse NOR expand fires.
    //   2. Direction gate: expand only fires when dir === -1 (user is actively
    //      scrolling UP). The layout-shift ghost events arrive as a single
    //      "jump" while suppressed, so they never reach the direction check.
    //      A genuine upward scroll by the user only happens after suppress
    //      clears, and it arrives as a sequence of small -1 direction ticks.
    //
    // Result: collapse on scroll-down (>COLLAPSE_AT), expand on scroll-up
    //   (reach ≤EXPAND_AT with direction = up) — no loops, no glitches.

    const COLLAPSE_AT = 70;   // px — scroll-down past this to collapse
    const EXPAND_AT = 6;    // px — must be this close to top AND scrolling up
    const SUPPRESS_MS = 700;  // ms — swallow ghost events after any state change

    let _ticking = false;
    let _suppress = false;
    let _lastY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (_ticking) return;
        _ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const dir = y < _lastY ? -1 : (y > _lastY ? 1 : 0);
            _lastY = y;

            if (!_suppress) {
                if (!state.bannerCollapsed && dir === 1 && y > COLLAPSE_AT) {
                    // User scrolled down far enough — collapse
                    _suppress = true;
                    collapseBanner();
                    setTimeout(() => { _suppress = false; }, SUPPRESS_MS);

                } else if (state.bannerCollapsed && dir === -1 && y <= EXPAND_AT) {
                    // User scrolled back up to the very top — expand
                    _suppress = true;
                    expandBanner();
                    setTimeout(() => { _suppress = false; }, SUPPRESS_MS);
                }
            }

            _ticking = false;
        });
    }, { passive: true });

    // ── Tap the compact bar to toggle ───────────────────────────────────────
    const bar = document.getElementById('banner-compact-bar');
    if (bar) {
        let _touchStartY = 0;
        let _touchMoved = false;

        bar.addEventListener('touchstart', e => {
            _touchStartY = e.touches[0].clientY;
            _touchMoved = false;
        }, { passive: true });

        bar.addEventListener('touchmove', e => {
            if (Math.abs(e.touches[0].clientY - _touchStartY) > 8) _touchMoved = true;
        }, { passive: true });

        bar.addEventListener('click', () => {
            if (_touchMoved) { _touchMoved = false; return; }
            // When expanding, scroll back to the top so the full banner is visible.
            if (state.bannerCollapsed && window.scrollY > 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            toggleBanner();
        });
    }
}

// ════════════════════════════════════════════════════
// PRAYER TRACKING
// ════════════════════════════════════════════════════
function todayKey() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function getTodayLog() { const r = localStorage.getItem('prayerLog_' + todayKey()); return r ? JSON.parse(r) : { fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null }; }
function saveTodayLog(log) { localStorage.setItem('prayerLog_' + todayKey(), JSON.stringify(log)); updatePrayerDots(); updateTodayCount(); updateStreak(); }
function getDayLog(ds) { const r = localStorage.getItem('prayerLog_' + ds); return r ? JSON.parse(r) : { fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null }; }
function markPrayer(key, status) { const log = getTodayLog(); log[key] = status; saveTodayLog(log); }
function updatePrayerDots() {
    const log = getTodayLog(); const now = new Date();
    PRAYER_KEYS.forEach(key => {
        const cd = document.getElementById('dot-' + key); const gd = document.getElementById('gd-' + key); let cls = 'pending';
        if (log[key] === 'done') cls = 'done'; else if (log[key] === 'missed') cls = 'missed'; else if (state.prayerTimes) { const pt = getPrayerTimeByKey(key); if (pt && now < pt) cls = 'upcoming'; }
        [cd, gd].forEach(el => { if (el) el.className = 'prayer-dot ' + cls; });
    });
}
function getPrayerTimeByKey(key) { if (!state.prayerTimes) return null; const m = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }; return state.prayerTimes[m[key]]; }
function updateTodayCount() { const log = getTodayLog(); const done = PRAYER_KEYS.filter(k => log[k] === 'done').length; const el = document.getElementById('today-prayer-count'); if (el) el.textContent = `${done}/5 اليوم`; }
function updateStreak() { const s = calcStreak(); const el = document.getElementById('streak-display'); if (el) { el.textContent = `🔥 ${s}`; el.classList.toggle('hidden', s < 2); } const te = document.getElementById('tracker-streak'); if (te) te.textContent = s; }
function calcStreak() { let s = 0; const today = new Date(); for (let i = 0; i < 365; i++) { const d = new Date(today); d.setDate(today.getDate() - i); const log = getDayLog(dateKey(d)); const done = PRAYER_KEYS.filter(k => log[k] === 'done').length; if (i === 0) { if (done > 0) s++; else break; } else if (done === 5) s++; else break; } return s; }
function openPrayerTracker() { renderTrackerModal(); document.getElementById('prayer-tracker-modal').classList.add('active'); }
function closePrayerTracker() { document.getElementById('prayer-tracker-modal').classList.remove('active'); }
function renderTrackerModal() {
    const streak = calcStreak(); document.getElementById('tracker-streak').textContent = streak;
    const weeklyEl = document.getElementById('weekly-overview'); weeklyEl.innerHTML = ''; const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i); const log = getDayLog(dateKey(d)); const done = PRAYER_KEYS.filter(k => log[k] === 'done').length;
        let bg = 'rgba(255,255,255,.1)'; if (done === 5) bg = '#10b981'; else if (done >= 3) bg = '#6ee7b7'; else if (done >= 1) bg = '#fcd34d'; else if (i > 0) bg = '#f43f5e44';
        const cell = document.createElement('div'); cell.className = 'flex-1 flex flex-col items-center gap-0.5';
        cell.innerHTML = `<div class="w-full h-2 rounded-full" style="background:${bg}"></div><span class="text-[8px] text-emerald-200">${done}/5</span>`; weeklyEl.appendChild(cell);
    }
    const listEl = document.getElementById('tracker-prayers-list'); listEl.innerHTML = ''; const log = getTodayLog();
    [{ key: 'fajr', nameAr: 'الفجر', icon: '🌄' }, { key: 'dhuhr', nameAr: 'الظهر', icon: '☀️' }, { key: 'asr', nameAr: 'العصر', icon: '🌤️' }, { key: 'maghrib', nameAr: 'المغرب', icon: '🌅' }, { key: 'isha', nameAr: 'العشاء', icon: '🌙' }].forEach(p => {
        const status = log[p.key]; const pTime = getPrayerTimeByKey(p.key); const isPast = pTime && new Date() > pTime;
        const timeStr = pTime ? pTime.toLocaleTimeString('ar-SA', { hour: 'numeric', minute: '2-digit' }) : '--:--';
        let pillClass = 'pill-pending', pillText = 'لم يحن وقتها';
        if (status === 'done') { pillClass = 'pill-done'; pillText = 'مؤداة ✓'; } else if (status === 'missed') { pillClass = 'pill-missed'; pillText = 'فائتة'; } else if (isPast) { pillText = 'في الانتظار'; }
        const row = document.createElement('div'); row.className = 'prayer-row flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50';
        row.innerHTML = `<div class="flex items-center gap-2.5"><span class="text-lg">${p.icon}</span><div><div class="font-bold text-gray-800 text-sm">${p.nameAr}</div><div class="text-xs text-gray-400">${timeStr}</div></div></div>
        <div class="flex items-center gap-1.5"><span class="prayer-status-pill ${pillClass}">${pillText}</span>
        ${isPast && status !== 'done' ? `<button onclick="quickMarkPrayer('${p.key}','done')" class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 text-xs font-bold">✓</button><button onclick="quickMarkPrayer('${p.key}','missed')" class="w-6 h-6 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-100 text-xs font-bold">✗</button>` : ''}
        ${status === 'done' ? `<button onclick="quickMarkPrayer('${p.key}',null)" class="text-[10px] text-gray-300 hover:text-gray-500">تراجع</button>` : ''}
        </div>`; listEl.appendChild(row);
    });
    const statsEl = document.getElementById('tracker-weekly-stats'); statsEl.innerHTML = '';
    const dayNamesAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    for (let i = 0; i < 7; i++) {
        const d = new Date(today); d.setDate(today.getDate() - i); const dLog = getDayLog(dateKey(d)); const done = PRAYER_KEYS.filter(k => dLog[k] === 'done').length; const missed = PRAYER_KEYS.filter(k => dLog[k] === 'missed').length;
        const label = i === 0 ? 'اليوم' : i === 1 ? 'أمس' : dayNamesAr[d.getDay()];
        let barColor = '#e5e7eb'; if (done === 5) barColor = '#10b981'; else if (done >= 3) barColor = '#6ee7b7'; else if (done >= 1) barColor = '#fcd34d'; else if (missed > 0) barColor = '#fda4af';
        const row = document.createElement('div'); row.className = 'flex items-center gap-2 text-xs';
        row.innerHTML = `<span class="w-14 text-gray-500 text-right flex-shrink-0">${label}</span><div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full rounded-full" style="width:${(done / 5) * 100}%;background:${barColor}"></div></div><span class="text-gray-400 w-6 text-center">${done}/5</span>`;
        statsEl.appendChild(row);
    }
}
function quickMarkPrayer(key, status) { if (status === null) { const log = getTodayLog(); log[key] = null; saveTodayLog(log); } else { markPrayer(key, status); if (status === 'missed') { state.qada[key] = (state.qada[key] || 0) + 1; saveQada(); } } renderTrackerModal(); }

// ════════════════════════════════════════════════════
// QADA
// ════════════════════════════════════════════════════
function loadQada() { const s = localStorage.getItem('qadaTracker'); if (s) state.qada = JSON.parse(s); updateQadaBadge(); }
function saveQada() { localStorage.setItem('qadaTracker', JSON.stringify(state.qada)); updateQadaBadge(); }
function updateQadaBadge() { const total = Object.values(state.qada).reduce((a, b) => a + b, 0); const badge = document.getElementById('qada-badge'); badge.textContent = total; badge.classList.toggle('hidden', total === 0); }
function renderQadaList() {
    const container = document.getElementById('qada-list'); container.innerHTML = '';
    const names = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    PRAYER_KEYS.forEach(key => {
        const el = document.createElement('div'); el.className = 'flex justify-between items-center px-5 py-4 border-b last:border-0 hover:bg-emerald-50/50 rounded-2xl mx-1 transition';
        el.innerHTML = `<span class="font-semibold text-lg">${names[key]}</span><div class="flex items-center gap-4"><button onclick="changeQada('${key}',-1)" class="w-9 h-9 text-2xl text-gray-400 hover:text-red-500 transition flex items-center justify-center">−</button><span class="font-mono text-3xl font-bold text-emerald-700 w-12 text-center">${state.qada[key]}</span><button onclick="changeQada('${key}',1)" class="w-9 h-9 text-2xl text-emerald-600 hover:text-emerald-700 transition flex items-center justify-center">+</button></div>`;
        container.appendChild(el);
    });
}
function changeQada(key, delta) { state.qada[key] = Math.max(0, (state.qada[key] || 0) + delta); saveQada(); renderQadaList(); }
function toggleQadaModal(show) { const m = document.getElementById('qada-modal'); if (show) { renderQadaList(); m.classList.add('active'); } else m.classList.remove('active'); }

// ════════════════════════════════════════════════════
// LOCATION & CITY
// ════════════════════════════════════════════════════
function loadSavedCity() {
    const saved = localStorage.getItem('azkarUserCity');
    const savedMethod = localStorage.getItem('calcMethod');
    if (savedMethod) state.calcMethod = savedMethod;
    if (saved) { state.city = JSON.parse(saved); document.getElementById('current-city-btn').innerText = state.city.name; fetchPrayerTimes(state.city.lat, state.city.lon); }
    else { document.getElementById('empty-state').classList.remove('hidden'); toggleModal(true); }
    syncNativeSettings();
}

// ════════════════════════════════════════════════════
// ARABIC FUZZY SEARCH ENGINE
// ════════════════════════════════════════════════════
function normalizeAr(str) {
    if (!str) return '';
    return str
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/^(ال|الا|الإ|الأ|الآ)\s*/, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function scoreCity(city, normQuery) {
    const normName = normalizeAr(city.name);
    const q = normQuery.replace(/^(ال|الا)/, '');
    if (normName === q) return 100;
    if (normName.startsWith(q)) return 90 - Math.abs(normName.length - q.length);
    if (normName.includes(q)) return 75;
    if (city.alt && city.alt.length) {
        for (const alt of city.alt) {
            const na = normalizeAr(alt);
            if (na === q) return 95;
            if (na.startsWith(q)) return 85;
            if (na.includes(q)) return 70;
        }
    }
    if (q.length >= 3) {
        let overlap = 0;
        for (let i = 0; i <= q.length - 2; i++) {
            if (normName.includes(q.slice(i, i + 2))) overlap++;
        }
        if (overlap > 1) return Math.min(50, overlap * 15);
    }
    return 0;
}

function searchLocalCities(query, topN = 12) {
    const normQ = normalizeAr(query);
    if (!normQ || normQ.length < 1) return popularCities.slice(0, 10);
    const results = [];
    const db = (typeof allCities !== 'undefined') ? allCities : popularCities;
    for (const city of db) {
        const score = scoreCity(city, normQ);
        if (score > 0) results.push({ city, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topN).map(r => r.city);
}

const SETTLEMENT_TYPES = new Set([
    'city', 'town', 'village', 'suburb', 'borough', 'municipality',
    'county', 'state', 'region', 'country', 'district', 'quarter',
    'neighbourhood', 'hamlet', 'locality', 'administrative',
    'city_block', 'governorate', 'province'
]);
const SETTLEMENT_CLASSES = new Set(['place', 'boundary']);

function isSettlement(item) {
    return SETTLEMENT_CLASSES.has(item.class) &&
        (SETTLEMENT_TYPES.has(item.type) || item.class === 'boundary');
}

async function searchOnlineCities(query) {
    const listEl = document.getElementById('cities-list');
    const local = searchLocalCities(query, 10);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=20&accept-language=ar&featuretype=settlement&addressdetails=1`,
            { signal: controller.signal }
        );
        clearTimeout(timeout);
        const data = await res.json();
        const settlements = data.filter(isSettlement);
        if (settlements.length) {
            const online = settlements.slice(0, 8).map(item => {
                const parts = item.display_name.split(',').map(s => s.trim());
                const addr = item.address || {};
                const name = addr.city || addr.town || addr.village ||
                    addr.suburb || addr.municipality || parts[0];
                const country = addr.country || parts[parts.length - 1];
                return { name, country, lat: parseFloat(item.lat), lon: parseFloat(item.lon) };
            });
            const merged = [...local];
            for (const oc of online) {
                const isDupe = merged.some(lc =>
                    Math.abs(lc.lat - oc.lat) < 0.3 && Math.abs(lc.lon - oc.lon) < 0.3
                );
                if (!isDupe) merged.push(oc);
            }
            renderCityList(merged.slice(0, 10), false);
            return;
        }
    } catch (_) { }
    if (local.length) {
        renderCityList(local, true);
    } else {
        listEl.innerHTML = `<div class="text-center py-6 text-gray-400 text-sm">
            <i class="fas fa-search-minus text-2xl mb-2 block opacity-30"></i>
            لا توجد نتائج لـ "<strong>${query}</strong>"
        </div>`;
    }
}

function populateInitialCityList() { renderCityList(popularCities, false); }

function handleSearchInput(input) {
    clearTimeout(state.searchTimeout);
    const q = input.value.trim();
    if (q.length < 1) { renderCityList(popularCities, false); return; }
    const localResults = searchLocalCities(q, 10);
    renderCityList(localResults, true);
    if (navigator.onLine) {
        state.searchTimeout = setTimeout(() => searchOnlineCities(q), 600);
    }
}

function renderCityList(cities, isLocal) {
    const listEl = document.getElementById('cities-list');
    if (!cities || !cities.length) {
        listEl.innerHTML = `<div class="text-center py-6 text-gray-400 text-sm">لا توجد نتائج</div>`;
        return;
    }
    const badge = isLocal
        ? `<span class="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-1.5 py-0.5 font-bold flex-shrink-0">بدون نت</span>`
        : '';
    listEl.innerHTML = cities.map(city => `
        <div onclick='selectCity(${JSON.stringify(city).replace(/'/g, "&#39;")})' 
             class="p-3 border-b border-gray-50 cursor-pointer hover:bg-emerald-50/80 active:bg-emerald-100 rounded-xl flex justify-between items-center transition group">
            <div class="overflow-hidden flex-1 min-w-0">
                <span class="font-bold text-gray-800 block truncate text-sm">${city.name}</span>
                <span class="text-xs text-gray-400 group-hover:text-emerald-500 truncate block">${city.country || ''}</span>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0 mr-2">
                ${badge}
                <i class="fas fa-chevron-left text-gray-300 group-hover:text-emerald-400 text-xs"></i>
            </div>
        </div>`).join('');
}

function selectCity(cityObj) { setCity(cityObj); }
function detectLocation() {
    if (!navigator.geolocation) { showToast('المتصفح لا يدعم تحديد الموقع'); return; }
    const btn = document.querySelector('button[onclick="detectLocation()"]'); const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...'; btn.disabled = true;
    navigator.geolocation.getCurrentPosition(
        pos => { btn.innerHTML = orig; btn.disabled = false; setCity({ name: "موقعي الحالي", country: "تلقائي", lat: pos.coords.latitude, lon: pos.coords.longitude }); },
        () => { btn.innerHTML = orig; btn.disabled = false; showToast('⚠️ تعذر تحديد الموقع'); }
    );
}
function setCity(cityObj) {
    state.city = cityObj; localStorage.setItem('azkarUserCity', JSON.stringify(cityObj));
    document.getElementById('current-city-btn').innerText = cityObj.name;
    toggleModal(false); state.manualOverride = false; fetchPrayerTimes(cityObj.lat, cityObj.lon);
    syncNativeSettings();
}
function toggleModal(show) { const m = document.getElementById('city-modal'); if (show) { m.classList.add('active'); setTimeout(() => document.getElementById('city-search').focus(), 300); } else m.classList.remove('active'); }

// ════════════════════════════════════════════════════
// COUNTDOWN
// ════════════════════════════════════════════════════
function startCountdown() { if (state.timerInterval) clearInterval(state.timerInterval); updateCountdownLogic(); state.timerInterval = setInterval(() => { updateCountdownLogic(); checkPrayerConfirmation(); }, 1000); }
function updateCountdownLogic() {
    if (!state.prayerTimes) return;
    const now = new Date(); const t = state.prayerTimes;
    let nextP, nextName, sunanKey;
    if (now < t.Fajr) { nextP = t.Fajr; nextName = "الفجر"; sunanKey = "الفجر"; }
    else if (now < t.Dhuhr) { nextP = t.Dhuhr; nextName = "الظهر"; sunanKey = now < new Date(t.Fajr.getTime() + 45 * 6e4) ? "الفجر" : "الظهر"; }
    else if (now < t.Asr) { nextP = t.Asr; nextName = "العصر"; sunanKey = now < new Date(t.Dhuhr.getTime() + 45 * 6e4) ? "الظهر" : "العصر"; }
    else if (now < t.Maghrib) { nextP = t.Maghrib; nextName = "المغرب"; sunanKey = now < new Date(t.Asr.getTime() + 45 * 6e4) ? "العصر" : "المغرب"; }
    else if (now < t.Isha) { nextP = t.Isha; nextName = "العشاء"; sunanKey = now < new Date(t.Maghrib.getTime() + 45 * 6e4) ? "المغرب" : "العشاء"; }
    else {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        if (state.city) {
            const coords = new adhan.Coordinates(state.city.lat, state.city.lon);
            const params = getAdhanMethod(state.calcMethod);
            const tomorrowPT = new adhan.PrayerTimes(coords, tomorrow, params);
            nextP = tomorrowPT.fajr;
        } else {
            nextP = new Date(t.Fajr); nextP.setDate(nextP.getDate() + 1);
        }
        nextName = "الفجر"; sunanKey = "العشاء";
    }
    state.nextPrayer = nextP; state.nextPrayerName = nextName;
    document.getElementById('next-prayer-name-compact').innerText = nextName;
    const sunan = sunanData[sunanKey] || { pre: '-', post: '-' };
    document.getElementById('sunan-pre').innerText = sunan.pre;
    document.getElementById('sunan-post').innerText = sunan.post;
    const map = { "الفجر": "pi-fajr", "الظهر": "pi-dhuhr", "العصر": "pi-asr", "المغرب": "pi-maghrib", "العشاء": "pi-isha" };
    document.querySelectorAll('.prayer-item').forEach(el => el.classList.remove('active-prayer', 'bg-white/20', 'ring-2', 'ring-emerald-400'));
    const ae = document.getElementById(map[nextName]); if (ae) ae.classList.add('active-prayer', 'bg-white/20', 'ring-2', 'ring-emerald-400');
    const diff = nextP - now;
    if (diff > 0) { const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000); document.getElementById('countdown-timer').innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
    else { document.getElementById('countdown-timer').innerText = '00:00:00'; if (diff > -2000 && state.city) fetchPrayerTimes(state.city.lat, state.city.lon); }
}

// ════════════════════════════════════════════════════
// PRAYER CONFIRMATION + QURAN REMINDER (merged)
// ════════════════════════════════════════════════════
function _getQuranReminderHTML() {
    const goal = parseInt(localStorage.getItem('quranDailyGoal') || '0');
    if (goal <= 0) {
        // Gently suggest setting a daily goal
        return `<div class="mt-4 pt-3 border-t border-gray-100">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">📖</span>
                <span class="text-sm font-bold text-gray-700">وِردك القرآني</span>
            </div>
            <p class="text-xs text-gray-400 mb-2.5">لم تحدد وِردك اليومي بعد — حدد عدد الصفحات التي تريد قراءتها يوميًا</p>
            <div class="grid grid-cols-4 gap-1.5 mb-1">
                ${[2, 5, 10, 20].map(n => `<button onclick="setDailyGoalFromModal(${n})" class="py-2 rounded-xl text-xs font-bold transition-all active:scale-95" style="background:rgba(212,168,83,.1);color:#b8860b;border:1px solid rgba(212,168,83,.2);">${n} صفحات</button>`).join('')}
            </div>
        </div>`;
    }

    // Has goal — show progress
    const log = typeof getQuranDailyLog === 'function' ? getQuranDailyLog() : { pagesRead: 0 };
    const pagesRead = Array.isArray(log.pagesRead) ? log.pagesRead.length : (log.pagesRead || 0);
    const remaining = Math.max(0, goal - pagesRead);
    const pct = Math.min(100, (pagesRead / goal) * 100);
    const isComplete = pagesRead >= goal;

    if (isComplete) {
        return `<div class="mt-4 pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-lg">📖</span>
                    <span class="text-sm font-bold text-emerald-600">أتممت وردك اليومي ✨</span>
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">${pagesRead}/${goal}</span>
            </div>
        </div>`;
    }

    // Always use the all-time finished-pages set as the source of truth so
    // out-of-order completions are handled correctly.
    const nextPage = typeof getNextQuranPage === 'function'
        ? getNextQuranPage()
        : (() => {
            try {
                const all = JSON.parse(localStorage.getItem('quranAllFinishedPages') || '[]');
                const s = new Set(all);
                for (let p = 1; p <= 604; p++) { if (!s.has(p)) return p; }
            } catch { }
            return 1;
        })();

    return `<div class="mt-4 pt-3 border-t border-gray-100">
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
                <span class="text-lg">📖</span>
                <span class="text-sm font-bold text-gray-700">وِردك القرآني</span>
            </div>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:rgba(212,168,83,.12);color:#b8860b;">${pagesRead}/${goal}</span>
        </div>
        <div class="w-full h-1.5 rounded-full overflow-hidden mb-2.5" style="background:rgba(212,168,83,.12);">
            <div class="h-full rounded-full transition-all duration-500" style="width:${pct}%;background:linear-gradient(90deg,#b8860b,#d4a853);"></div>
        </div>
        <p class="text-xs text-gray-400 mb-2.5">تبقّى <strong class="text-gray-600">${remaining}</strong> صفحة لإتمام وردك اليوم</p>
        <button onclick="openQuranFromModal(${nextPage})" class="w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95" style="background:linear-gradient(135deg,#d4a853,#b8860b);color:#1a1207;box-shadow:0 2px 10px rgba(212,168,83,.22);">
            📖 اقرأ الآن — الصفحة ${nextPage}
        </button>
    </div>`;
}

function setDailyGoalFromModal(pages) {
    if (typeof setDailyGoal === 'function') setDailyGoal(pages);
    // Refresh the modal content
    const quranSection = document.getElementById('modal-quran-section');
    if (quranSection) quranSection.innerHTML = _getQuranReminderHTML();
}

function openQuranFromModal(page) {
    // Close prayer modal, open Quran at specific page
    document.getElementById('prayer-check-modal').classList.remove('active');
    state.currentModalPrayer = null;
    if (typeof openQuranModal === 'function') openQuranModal();
    setTimeout(() => {
        if (typeof loadPage === 'function') loadPage(page);
    }, 500);
}

function checkPrayerConfirmation() {
    if (!state.prayerTimes) return;
    const now = new Date();
    let log = getTodayLog();
    const prayers = [
        { name: "الفجر", key: "fajr", time: state.prayerTimes.Fajr },
        { name: "الظهر", key: "dhuhr", time: state.prayerTimes.Dhuhr },
        { name: "العصر", key: "asr", time: state.prayerTimes.Asr },
        { name: "المغرب", key: "maghrib", time: state.prayerTimes.Maghrib },
        { name: "العشاء", key: "isha", time: state.prayerTimes.Isha }
    ];

    let qadaUpdated = false;
    for (let i = 0; i < prayers.length; i++) {
        let p = prayers[i];
        if (log[p.key] === null) {
            let nextTime = (i < prayers.length - 1) ? prayers[i + 1].time : (() => { let d = new Date(now); d.setHours(23, 59, 59); return d; })();
            if (now > nextTime) {
                markPrayer(p.key, 'missed');
                state.qada[p.key] = (state.qada[p.key] || 0) + 1;
                qadaUpdated = true;
            }
        }
    }
    if (qadaUpdated) {
        saveQada();
        log = getTodayLog(); // refresh
    }

    for (let p of prayers) {
        if (log[p.key] !== null) continue;
        const diffMins = (now - p.time) / 60000;
        if (diffMins < 5 || diffMins > 120) continue;
        if (state.snoozeUntil[p.name] && Date.now() < state.snoozeUntil[p.name]) continue;

        const modal = document.getElementById('prayer-check-modal');
        if (!modal.classList.contains('active')) {
            state.currentModalPrayer = p;
            document.getElementById('check-prayer-name').innerText = p.name;
            document.getElementById('check-prayer-time-info').innerText = `وقتها كان ${p.time.toLocaleTimeString('ar-SA', { hour: 'numeric', minute: '2-digit' })}`;
            const quranSection = document.getElementById('modal-quran-section');
            if (quranSection) quranSection.innerHTML = _getQuranReminderHTML();
            modal.classList.add('active');
        }
        return;
    }
}
function confirmPrayer(didPray) {
    const modal = document.getElementById('prayer-check-modal');
    if (!state.currentModalPrayer) { modal.classList.remove('active'); return; }
    const { key } = state.currentModalPrayer;
    if (didPray) { markPrayer(key, 'done'); if (navigator.vibrate) navigator.vibrate([30, 20, 30]); showToast('تقبل الله منا ومنكم صالح الأعمال 🤲'); }
    else { markPrayer(key, 'missed'); state.qada[key] = (state.qada[key] || 0) + 1; saveQada(); }
    modal.classList.remove('active'); state.currentModalPrayer = null; updatePrayerDots(); updateTodayCount();
}
function snoozePrayer() { if (state.currentModalPrayer) state.snoozeUntil[state.currentModalPrayer.name] = Date.now() + 30 * 60 * 1000; document.getElementById('prayer-check-modal').classList.remove('active'); state.currentModalPrayer = null; }

// ════════════════════════════════════════════════════
// TABS & AZKAR RENDERING
// ════════════════════════════════════════════════════
function _toggleFridayTab() {
    const fridayBtn = document.getElementById('tab-friday');
    if (fridayBtn) fridayBtn.classList.toggle('hidden', new Date().getDay() !== 5);
}

function checkAutoTabSwitch() {
    _toggleFridayTab();
    _toggleFridayKahfBanner();
    if (state.manualOverride || !state.prayerTimes) return;
    const now = new Date();
    const pt = state.prayerTimes;
    let targetTab = 'morning', suggestion = "☀️ أذكار الاستيقاظ والصباح";

    let isPostPrayer = false;
    for (let pTime of Object.values(pt)) {
        const diffMin = (now - pTime) / 60000;
        if (diffMin >= 0 && diffMin <= 30) { isPostPrayer = true; break; }
    }

    if (isPostPrayer) {
        targetTab = 'prayer'; suggestion = "🤲 وقت أذكار دبر الصلاة";
    }
    else if (now < pt.Asr) {
        targetTab = 'morning'; suggestion = "☀️ أذكار الاستيقاظ والصباح";
    }
    else if (now >= pt.Asr && now < pt.Isha) {
        targetTab = 'evening'; suggestion = "🌙 أذكار المساء";
    }
    else if (now >= pt.Isha) {
        targetTab = 'sleep'; suggestion = "💤 أذكار النوم والمساء";
    }

    renderCategory(targetTab); showSuggestion(suggestion);
}
// ════════════════════════════════════════════════════
// AZKAR SEARCH
// ════════════════════════════════════════════════════
function manualSelectTab(cat) { state.manualOverride = true; document.getElementById('auto-suggestion-msg').classList.add('hidden'); renderCategory(cat); }
function showSuggestion(text) {
    document.getElementById('suggestion-text').innerText = text;
    document.getElementById('auto-suggestion-msg').classList.remove('hidden');
}

function _makeDividerCard(icon, label, sublabel, colorFrom, colorTo, borderColor) {
    const div = document.createElement('div');
    div.className = 'relative overflow-hidden rounded-2xl my-0.5';
    div.style.cssText = `background:linear-gradient(135deg,${colorFrom},${colorTo});border:1px solid ${borderColor};padding:7px 14px;`;
    div.innerHTML = `
        <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style="background:rgba(255,255,255,.15);">${icon}</div>
            <div>
                <div class="font-extrabold text-xs" style="color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.18);">${label}</div>
                ${sublabel ? `<div class="text-[9px]" style="color:rgba(255,255,255,.65);">${sublabel}</div>` : ''}
            </div>
        </div>
        <div style="position:absolute;right:-20px;top:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.07);pointer-events:none;"></div>`;
    return div;
}

function _makeAzkarCard(item) {
    const card = document.createElement('div');
    card.className = 'azkar-card bg-white/80 backdrop-blur-[20px] p-6 rounded-3xl border border-white/60 relative overflow-hidden shadow-sm hover:shadow-md transition-all';
    const titleHTML = item.title ? `<h3 class="text-[10px] font-extrabold text-emerald-700 mb-2 bg-emerald-50/70 inline-flex px-2 py-0.5 rounded-lg border border-emerald-100/50">${item.title}</h3>` : '';
    const textClass = item.isQuran ? 'quran-text' : 'text-base leading-[2.4] font-medium text-gray-800 tracking-wide';
    const fadlHTML = item.fadl ? `<div class="mt-4 bg-gradient-to-br from-[#fef3c7]/60 to-[#fffbeb]/60 border border-[#fde68a]/50 rounded-xl p-3 flex items-start gap-2.5 shadow-sm"><i class="fas fa-star text-[10px] text-amber-500 mt-1"></i><span class="text-[11px] text-amber-900/90 leading-relaxed font-bold">فضل: <span class="font-medium opacity-90">${item.fadl}</span></span></div>` : '';
    const countHTML = item.count > 1 ? `<button onclick="decrementCounter(this,${item.count})" class="count-btn w-full mt-5 py-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100 transition flex items-center justify-center gap-3 select-none text-sm font-bold text-emerald-800 border border-emerald-200/50 shadow-sm"><i class="fas fa-fingerprint opacity-40 text-xs text-emerald-600"></i><span class="count-curr text-xl">${item.count}</span><span class="text-[11px] font-normal opacity-50">/ ${item.count}</span></button><div class="progress-bar mt-2 h-1.5 bg-gray-100/80 rounded-full overflow-hidden shadow-inner"><div class="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300" style="width:0%"></div></div>` : `<div class="mt-4 pt-3 flex justify-center border-t border-gray-100/50"><span class="bg-gray-50/80 px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-400 border border-gray-100 shadow-sm">يقرأ مرة واحدة</span></div>`;
    card.innerHTML = `${titleHTML}<p class="${textClass} text-justify" style="white-space:pre-line">${item.text}</p>${fadlHTML}${countHTML}`;
    return card;
}

function renderCategory(category) {
    document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active-tab'); b.classList.add('bg-white', 'text-gray-500'); });
    const active = document.getElementById(`tab-${category}`); if (active) { active.classList.add('active-tab'); active.classList.remove('bg-white', 'text-gray-500'); }
    const container = document.getElementById('azkar-container'); container.innerHTML = '';

    const now = new Date();
    const pt = state.prayerTimes;

    if (category === 'morning') {
        // Waking azkar section
        container.appendChild(_makeDividerCard('🌅', 'أذكار الاستيقاظ', 'عند الإفاقة من النوم', '#065f46', '#047857', 'rgba(16,185,129,.2)'));
        (azkarData.waking || []).forEach(item => container.appendChild(_makeAzkarCard(item)));
        // Morning azkar section
        container.appendChild(_makeDividerCard('☀️', 'أذكار الصباح', 'تقرأ بعد صلاة الفجر وحتى الضحى', '#0f766e', '#0d9488', 'rgba(20,184,166,.2)'));
        (azkarData.morning || []).forEach(item => container.appendChild(_makeAzkarCard(item)));

        // Duha time: from ~1.5h after sunrise until 30min before Dhuhr
        if (pt && pt.Sunrise) {
            const duhaStart = new Date(pt.Sunrise.getTime() + 90 * 60000);
            const duhaEnd = new Date(pt.Dhuhr.getTime() - 30 * 60000);
            if (now >= duhaStart && now < duhaEnd) {
                container.appendChild(_makeDividerCard('🌞', 'وقت الضحى', 'الآن وقت صلاة الضحى وأذكارها', '#b45309', '#d97706', 'rgba(217,119,6,.2)'));
                (azkarData.duha || []).forEach(item => container.appendChild(_makeAzkarCard(item)));
            }
        }

        // Friday extra azkar
        if (now.getDay() === 5) {
            container.appendChild(_makeDividerCard('🕌', 'أذكار يوم الجمعة', 'خاصة بيوم الجمعة المبارك', '#854d0e', '#92400e', 'rgba(180,83,9,.2)'));
            (azkarData.friday || []).forEach(item => container.appendChild(_makeAzkarCard(item)));
        }
    } else if (category === 'sleep') {
        if (pt && now >= pt.Isha) {
            // Evening first, then sleep
            container.appendChild(_makeDividerCard('🌙', 'أذكار المساء', 'تقرأ من بعد العصر حتى الغروب', '#1e3a5f', '#1e40af', 'rgba(37,99,235,.2)'));
            (azkarData.evening || []).forEach(item => container.appendChild(_makeAzkarCard(item)));
            container.appendChild(_makeDividerCard('💤', 'أذكار النوم', 'تقرأ عند الخلود إلى النوم', '#2d1b69', '#4c1d95', 'rgba(139,92,246,.2)'));
            (azkarData.sleep || []).forEach(item => container.appendChild(_makeAzkarCard(item)));

            // Tahajjud: last third of night (from 2/3 of night elapsed after Isha until Fajr)
            if (pt.Fajr) {
                const nightDuration = pt.Fajr.getTime() - pt.Isha.getTime();
                const lastThirdStart = new Date(pt.Isha.getTime() + (nightDuration * 2 / 3));
                if (now >= lastThirdStart) {
                    container.appendChild(_makeDividerCard('🌌', 'قيام الليل والتهجد', 'الثلث الأخير من الليل — أفضل أوقات الدعاء', '#1e1b4b', '#312e81', 'rgba(99,102,241,.2)'));
                    (azkarData.tahajjud || []).forEach(item => container.appendChild(_makeAzkarCard(item)));
                }
            }
        } else {
            container.appendChild(_makeDividerCard('💤', 'أذكار النوم', 'تقرأ عند الخلود إلى النوم', '#2d1b69', '#4c1d95', 'rgba(139,92,246,.2)'));
            (azkarData.sleep || []).forEach(item => container.appendChild(_makeAzkarCard(item)));
        }
    } else if (category === 'friday') {
        container.appendChild(_makeDividerCard('🕌', 'أذكار يوم الجمعة', 'يوم الجمعة خير يوم طلعت عليه الشمس', '#854d0e', '#92400e', 'rgba(180,83,9,.2)'));
        (azkarData.friday || []).forEach(item => container.appendChild(_makeAzkarCard(item)));
    } else {
        const list = azkarData[category] || [];
        if (!list.length) return;
        list.forEach(item => container.appendChild(_makeAzkarCard(item)));
    }
}

function decrementCounter(btn, max) {
    const span = btn.querySelector('.count-curr'); const bar = btn.nextElementSibling?.querySelector('div');
    let current = parseInt(span.innerText);
    if (current > 0) {
        current--; span.innerText = current; if (bar) bar.style.width = `${((max - current) / max) * 100}%`;
        if (current === 0) { btn.className = "w-full mt-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 text-sm"; btn.innerHTML = '<i class="fas fa-check-circle"></i> اكتمل'; btn.onclick = null; if (navigator.vibrate) navigator.vibrate(40); }
    }
}

// ════════════════════════════════════════════════════
// FRIDAY SURAH AL-KAHF REMINDER
// ════════════════════════════════════════════════════
function _toggleFridayKahfBanner() {
    const banner = document.getElementById('friday-kahf-banner');
    if (!banner) return;
    banner.classList.toggle('hidden', new Date().getDay() !== 5);
}

function openSurahKahf() {
    if (typeof openQuranModal === 'function') openQuranModal();
    // Surah Al-Kahf (Surah 18) starts at page 293 of the standard 604-page Mushaf
    setTimeout(() => { if (typeof loadPage === 'function') loadPage(293); }, 500);
}

// ════════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════════
function updateHijriDate() { document.getElementById('hijri-date').innerText = new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', calendar: 'islamic-umalqura' }); }
function showToast(msg, duration = 3000) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), duration); }

// ════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    updateHijriDate();
    _toggleFridayTab();
    _toggleFridayKahfBanner();
    loadReminderSettings();
    loadSavedCity();
    populateInitialCityList();
    loadQada();
    loadBannerPreference();
    initBannerScrollCollapse();
    refreshReminderSettingsUI();
    syncNativeSettings();
    setInterval(checkAutoTabSwitch, 60000);
    setInterval(checkPrayerConfirmation, 15000);
    setInterval(() => { if (state.city) fetchPrayerTimes(state.city.lat, state.city.lon); }, 3600000);
    if (!navigator.onLine) document.body.classList.add('offline');
});
