/* Progress store — local-first, cloud-sync-ready.
 *
 * Everything persists to localStorage immediately. If the app is hosted
 * somewhere with the /api/progress function available (Cloudflare Pages +
 * KV — see functions/), sync switches on automatically: progress is pushed
 * after every change and pulled on startup, keyed by an anonymous family
 * code. No accounts, no PII — the code is the only identifier.
 */

const STORE_KEY = 'lsm-progress-v1';

const Store = {
  data: null,
  cloud: false,          // becomes true if the sync API answers the ping
  syncTimer: null,

  defaults() {
    return {
      v: 1,
      stars: 0,
      badges: {},        // stationId -> { plays, days: [dateStr, ...] }
      settings: { audio: true, rest: true, seq: false, sawPhonics: false },
      familyCode: 'HK-' + Math.random().toString(36).slice(2, 6).toUpperCase()
                        + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      updatedAt: 0,
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      this.data = raw ? Object.assign(this.defaults(), JSON.parse(raw)) : this.defaults();
    } catch (e) {
      this.data = this.defaults();
    }
    this.save(false);
    return this.data;
  },

  save(push = true) {
    this.data.updatedAt = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) {}
    if (push && this.cloud) this.schedulePush();
  },

  /* ---- game-facing helpers ---- */

  addStars(n) { this.data.stars += n; this.save(); },

  completeStation(id) {
    const today = new Date().toISOString().slice(0, 10);
    const b = this.data.badges[id] || { plays: 0, days: [] };
    b.plays += 1;
    if (!b.days.includes(today)) b.days.push(today);
    this.data.badges[id] = b;
    const firstTime = b.plays === 1;
    this.data.stars += firstTime ? 3 : 1;
    this.save();
    return firstTime;
  },

  isDone(id)     { return !!this.data.badges[id]; },
  isMastered(id) { const b = this.data.badges[id]; return !!b && b.days.length >= 2; },

  isUnlocked(line, idx) {
    /* Free roam is the default — every station open for exploring.
     * Parents can switch sequential unlocking back on in settings. */
    if (!this.data.settings.seq) return true;
    if (idx === 0) return true;
    /* A completed station never re-locks, even if new stations are
     * inserted before it in a content update. */
    if (this.isDone(line.stations[idx].id)) return true;
    return this.isDone(line.stations[idx - 1].id);
  },

  lineProgress(line) {
    return line.stations.filter(s => this.isDone(s.id)).length;
  },

  nextStation(line) {
    return line.stations.find(s => !this.isDone(s.id)) || null;
  },

  /* ---- backup code (works everywhere, no server needed) ---- */

  exportCode() {
    const json = JSON.stringify(this.data);
    return btoa(unescape(encodeURIComponent(json)));
  },

  importCode(code) {
    try {
      const json = decodeURIComponent(escape(atob(code.trim())));
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object' || parsed.v !== 1) return false;
      this.data = Object.assign(this.defaults(), parsed);
      this.save();
      return true;
    } catch (e) { return false; }
  },

  /* ---- cloud sync (auto-detects the Cloudflare Pages function) ---- */

  async detectCloud() {
    try {
      const r = await fetch('api/progress/__ping', { cache: 'no-store' });
      if (!r.ok) return;
      const ct = r.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return;   // GH Pages 404 page etc.
      this.cloud = true;
      await this.pull();
    } catch (e) { /* offline or static host — stay local */ }
  },

  schedulePush() {
    clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => this.push(), 1500);
  },

  async push() {
    try {
      await fetch('api/progress/' + encodeURIComponent(this.data.familyCode), {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(this.data),
      });
    } catch (e) { /* retry on next change */ }
  },

  async pull() {
    try {
      const r = await fetch('api/progress/' + encodeURIComponent(this.data.familyCode), { cache: 'no-store' });
      if (!r.ok) return;
      const remote = await r.json();
      if (remote && remote.v === 1 && remote.updatedAt > this.data.updatedAt) {
        this.data = Object.assign(this.defaults(), remote);
        this.save(false);
        if (typeof App !== 'undefined' && App.refresh) App.refresh();
      }
    } catch (e) {}
  },

  /* Join an existing family code from another device (cloud mode). */
  async joinFamily(code) {
    this.data.familyCode = code.trim().toUpperCase();
    this.save(false);
    if (this.cloud) await this.pull();
    this.save();
  },
};
