/* 小站長 Little Station Master — app shell + game engines (v2).
 * No build step, no dependencies. Curriculum: js/data.js. Persistence: js/store.js.
 *
 * Engines: match · listen · talk · factory · memory · sentence
 *          count · add · peek · takeaway · bond · double · oddeven · fivebit · maketen
 */

const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const pickFrom = a => a[Math.floor(Math.random() * a.length)];
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

/* ---------- speech (Cantonese / English) ---------- */
function speak(text, lang) {
  if (!Store.data.settings.audio) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'en' ? 'en-GB' : 'zh-HK';
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ============================================================ */

const App = {
  currentLine: null,
  currentStation: null,
  playSeconds: 0,
  restShown: false,

  init() {
    Store.load();
    Store.detectCloud();
    $$('.nav button').forEach(b => b.addEventListener('click', () => App.show(b.dataset.nav)));
    this.show('home');
    /* Gentle session pacing: count active minutes, suggest a rest once. */
    setInterval(() => {
      if (document.visibilityState === 'visible') this.playSeconds += 30;
      if (Store.data.settings.rest && !this.restShown && this.playSeconds >= 15 * 60) {
        this.restShown = true;
        $('#rest').classList.add('show');
      }
    }, 30000);
  },

  refresh() {
    const active = $('.screen.active');
    if (active) this.show(active.id.replace('scr-', ''), true);
  },

  show(id, force) {
    if (id === 'home')     this.renderHome();
    if (id === 'line')     this.renderLine();
    if (id === 'stickers') this.renderStickers();
    if (id === 'parents')  this.renderParents();
    $$('.screen').forEach(s => s.classList.remove('active'));
    $('#scr-' + id).classList.add('active');
    const navId = { line: 'home', game: 'home' }[id] || id;
    $$('.nav button').forEach(b => b.classList.toggle('on', b.dataset.nav === navId));
    $('#screens').scrollTop = 0;
  },

  greeting() {
    const h = new Date().getHours();
    if (h < 12) return ['早晨呀！', 'Good morning!'];
    if (h < 18) return ['午安呀！', 'Good afternoon!'];
    return ['夜晚好！', 'Good evening!'];
  },

  /* ---------- HOME ---------- */
  renderHome() {
    const [zh, en] = this.greeting();
    const stops = LINES.map(l => ({ line: l, st: Store.nextStation(l) }));
    $('#scr-home').innerHTML = `
      <div class="row spread">
        <div class="greet">
          <div class="avatar">🐼</div>
          <div><h1>${zh}</h1><p class="sub">${en}</p></div>
        </div>
        <span class="chip">⭐ ${Store.data.stars}</span>
      </div>

      <div class="card">
        <div class="row spread"><h2>今日旅程 · Today's trip</h2></div>
        <div class="journey">
          ${stops.map(({ line, st }) => st ? `
            <button class="stop now" onclick="App.openStation('${line.id}','${st.id}')">
              <span class="dot" style="border-color:${line.color}">${st.icon}</span>
              <small>${st.name}</small>
            </button>` : `
            <div class="stop done">
              <span class="dot">✓</span><small>${line.name}<br>完成!</small>
            </div>`).join('')}
        </div>
      </div>

      <h2>揀條線玩 · Pick a line</h2>
      ${LINES.map(l => {
        const done = Store.lineProgress(l), total = l.stations.length;
        return `
        <button class="linecard" onclick="App.openLine('${l.id}')">
          <span class="roundel" style="background:${l.color}">
            <b style="color:${l.color}">${l.stations[0].icon}</b></span>
          <span class="meta">
            <span class="row spread"><strong>${l.name}</strong><span class="sub">${done}/${total}</span></span>
            <span class="sub">${l.en}</span>
            <span class="track"><span class="fill" style="width:${total ? Math.round(done / total * 100) : 0}%;background:${l.color}"></span></span>
          </span>
          <span class="chev">›</span>
        </button>`;
      }).join('')}`;
  },

  /* ---------- LINE MAP ---------- */
  openLine(lineId) {
    this.currentLine = LINES.find(l => l.id === lineId);
    this.show('line');
  },

  renderLine() {
    const l = this.currentLine;
    if (!l) return;
    let lastTheme = null;
    $('#scr-line').innerHTML = `
      <div class="gamehead">
        <button class="back" onclick="App.show('home')">‹</button>
        <div class="titles"><h2>${l.name}</h2><p class="sub">${l.en}</p></div>
        <span class="chip">⭐ ${Store.data.stars}</span>
      </div>
      <div class="linemap" style="--linecolor:${l.color}">
        ${l.stations.map((s, i) => {
          const unlocked = Store.isUnlocked(l, i);
          const done = Store.isDone(s.id);
          const gold = Store.isMastered(s.id);
          let head = '';
          if (s.theme && s.theme !== lastTheme) {
            lastTheme = s.theme;
            head = `<div class="themehead"><span style="color:${l.color}">◈</span> ${s.theme}</div>`;
          }
          return head + `
          <button class="stationrow ${unlocked ? '' : 'locked'}"
                  ${unlocked ? `onclick="App.openStation('${l.id}','${s.id}')"` : 'disabled'}>
            <span class="mapdot ${done ? 'done' : ''}" style="border-color:${l.color}">
              ${done ? (gold ? '🏅' : '✓') : (unlocked ? s.icon : '·')}
            </span>
            <span class="meta">
              <strong>${s.name}</strong>
              <span class="sub">${s.en}${gold ? ' · 金徽章 mastered' : ''}</span>
            </span>
            <span class="chev">${unlocked ? '›' : '🔒'}</span>
          </button>`;
        }).join('')}
      </div>`;
  },

  /* ---------- STICKERS ---------- */
  renderStickers() {
    const jarGoal = 20;
    const pct = Math.min(100, Math.round(Store.data.stars / jarGoal * 100));
    $('#scr-stickers').innerHTML = `
      <h1>我嘅貼紙簿 · Sticker book</h1>
      <p class="sub">每過一個站有一個站徽，兩日都完成就變金色！<br>
         A badge per station — done on two different days turns it gold.</p>
      ${LINES.map(l => `
        <div class="card">
          <h2 style="color:${l.color}">${l.name}</h2>
          <div class="stickers" style="margin-top:10px">
            ${l.stations.map(s => {
              const done = Store.isDone(s.id), gold = Store.isMastered(s.id);
              return `<div class="sticker ${done ? '' : 'locked'} ${gold ? 'gold' : ''}">
                ${done
                  ? `<span class="roundel" style="background:${gold ? 'var(--star)' : l.color}">
                       <b style="color:${gold ? 'var(--star)' : l.color}">${s.icon}</b></span>${s.name}`
                  : '?'}
              </div>`;
            }).join('')}
          </div>
        </div>`).join('')}
      <div class="card">
        <h2>⭐ 星星罐 Star jar — ${Store.data.stars}</h2>
        <div class="track" style="margin-top:10px">
          <span class="fill" style="width:${pct}%;background:var(--star)"></span></div>
        <p class="sub" style="margin-top:8px">冇嘢需要購買 — 全部靠自己努力賺！Nothing to buy — everything is earned.</p>
      </div>`;
  },

  /* ---------- PARENTS ---------- */
  renderParents() {
    $('#parent-panel').hidden = true;
    $('#parent-gate').hidden = false;
    this.renderParentPanel();
  },

  knownChars() {
    const seen = new Set();
    LINES.find(l => l.id === 'c').stations.forEach(s => {
      if (!Store.isDone(s.id)) return;
      (s.pairs || []).forEach(p => seen.add(p.a));
      (s.pool || []).forEach(p => seen.add(p.a));
      (s.builds || []).forEach(b => { b.parts.forEach(x => seen.add(x)); seen.add(b.result); });
      (s.sentences || []).forEach(x => x.words.forEach(w => seen.add(w)));
    });
    return [...seen];
  },

  renderParentPanel() {
    const known = this.knownChars();
    $('#parent-progress').innerHTML = `
      <div class="card">
        <div class="row spread">
          <h2>☁️ 雲端同步 Cloud sync</h2>
          <span class="chip">${Store.cloud ? '已連接 ✓' : '本機儲存中 local'}</span>
        </div>
        <p class="sub" style="margin-top:8px">
          家庭代碼 Family code：<b class="inkstrong">${Store.data.familyCode}</b><br>
          ${Store.cloud
            ? '進度會自動同步到雲端 — 喺另一部機輸入相同代碼即可繼續。'
            : '目前儲存喺呢部機。部署到 Cloudflare Pages 後（見 README），雲端同步會自動開啟。而家可以用下面嘅備份碼搬進度。'}
        </p>
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:12px">
        <h2>進度 Progress</h2>
        ${LINES.map(l => {
          const done = Store.lineProgress(l), total = l.stations.length;
          return `<div class="bar">
            <div class="row spread"><span>${l.name}</span><span class="sub">${done}/${total} 站</span></div>
            <div class="track"><span class="fill" style="width:${Math.round(done / total * 100)}%;background:${l.color}"></span></div>
          </div>`;
        }).join('')}
        <p class="sub">識咗嘅字詞 Words known（${known.length}）：${known.join('、') || '未開始'}</p>
      </div>
      <div class="card">
        <h2 style="margin-bottom:4px">設定 Settings</h2>
        <div class="switchrow"><span>發音 Audio (粵語/English)</span>
          <span class="switch"><input type="checkbox" ${Store.data.settings.audio ? 'checked' : ''}
            onchange="Store.data.settings.audio=this.checked;Store.save()"><span class="knob"></span></span></div>
        <div class="switchrow"><span>15 分鐘休息提示 Rest reminder</span>
          <span class="switch"><input type="checkbox" ${Store.data.settings.rest ? 'checked' : ''}
            onchange="Store.data.settings.rest=this.checked;Store.save()"><span class="knob"></span></span></div>
      </div>
      <div class="card">
        <h2>備份 Backup</h2>
        <p class="sub" style="margin:8px 0">將備份碼貼到另一部機，即可搬進度（毋須帳號）。</p>
        <div class="row" style="gap:8px">
          <button class="btn ghost" style="flex:1" onclick="App.copyBackup()">複製備份碼 Copy</button>
          <button class="btn ghost" style="flex:1" onclick="App.pasteBackup()">貼上還原 Restore</button>
        </div>
      </div>
      <div class="safety">
        <span class="chip">🚫 無廣告 No ads</span>
        <span class="chip">🚫 無內購 No purchases</span>
        <span class="chip">🔒 唔收集個人資料 No PII</span>
      </div>`;
  },

  copyBackup() {
    const code = Store.exportCode();
    const done = () => toast('已複製 ✓ Copied');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done, () => prompt('複製呢個備份碼 Copy this code:', code));
    } else {
      prompt('複製呢個備份碼 Copy this code:', code);
    }
  },

  pasteBackup() {
    const code = prompt('貼上備份碼 Paste your backup code:');
    if (!code) return;
    if (Store.importCode(code)) { toast('已還原 ✓ Restored'); this.refresh(); }
    else toast('備份碼唔啱喎 · That code didn’t work');
  },

  /* ---------- GAME LAUNCH ---------- */
  openStation(lineId, stationId) {
    this.currentLine = LINES.find(l => l.id === lineId);
    this.currentStation = this.currentLine.stations.find(s => s.id === stationId);
    Game.start(this.currentLine, this.currentStation);
    this.show('game');
  },
};

/* ============================================================
 * Game engines
 * ============================================================ */

const ROUNDS_BY_TYPE = {
  match: 1, memory: 1,
  count: 3, add: 3, peek: 3, takeaway: 3, bond: 3, double: 3,
  oddeven: 3, fivebit: 3, maketen: 3,
  listen: 4,
};

const Game = {
  line: null, st: null,
  round: 0, rounds: 3,
  matched: 0, selWord: null, selPic: null, misses: 0,
  target: 0, busy: false, lastKey: null,
  memFirst: null, memLock: false,
  factorySlots: [],

  start(line, st) {
    this.line = line;
    this.st = st;
    this.round = 0;
    this.misses = 0;
    this.busy = false;
    this.lastKey = null;
    this.rounds = st.type === 'talk' ? st.dialogs.length
      : st.type === 'factory' ? st.builds.length
      : st.type === 'sentence' ? st.sentences.length
      : (ROUNDS_BY_TYPE[st.type] || 3);
    this.renderShell();
    this.nextRound();
  },

  renderShell() {
    $('#scr-game').innerHTML = `
      <div class="gamehead">
        <button class="back" onclick="App.openLine('${this.line.id}')">‹</button>
        <div class="titles"><h2>${this.st.name}</h2><p class="sub">${this.st.en}</p></div>
        <span class="chip">⭐ <span id="gstars">${Store.data.stars}</span></span>
      </div>
      ${this.rounds > 1 ? `<div class="roundpips" id="pips">${'<i></i>'.repeat(this.rounds)}</div>` : ''}
      <p class="prompt" id="gprompt"></p>
      <div id="gboard"></div>`;
  },

  pips() {
    $$('#pips i').forEach((p, i) => p.classList.toggle('on', i < this.round));
  },

  nextRound() {
    this.misses = 0;
    this.busy = false;
    const t = this.st.type;
    if (t === 'match')    this.buildMatch();
    else if (t === 'listen')   this.buildListen();
    else if (t === 'talk')     this.buildTalk();
    else if (t === 'factory')  this.buildFactory();
    else if (t === 'memory')   this.buildMemory();
    else if (t === 'sentence') this.buildSentence();
    else if (t === 'add')      this.buildAdd();
    else if (t === 'peek')     this.buildPeek();
    else if (t === 'takeaway') this.buildTakeaway();
    else if (t === 'bond')     this.buildBond();
    else if (t === 'double')   this.buildDouble();
    else if (t === 'oddeven')  this.buildOddEven();
    else if (t === 'fivebit')  this.buildFivebit();
    else if (t === 'maketen')  this.buildMaketen();
    else this.buildCount();
    if (this.rounds > 1) this.pips();
  },

  roundWon(delayNext = 750) {
    this.round++;
    if (this.rounds > 1) this.pips();
    if (this.round >= this.rounds) {
      setTimeout(() => this.finishStation(), 500);
    } else {
      setTimeout(() => this.nextRound(), delayNext);
    }
  },

  finishStation() {
    const first = Store.completeStation(this.st.id);
    const gold = Store.isMastered(this.st.id);
    const praise = pickFrom(PRAISE);
    $('#celeTitle').textContent = praise.zh + ' ' + praise.en;
    $('#celeSub').textContent = first
      ? `+3 ⭐ 攞到「${this.st.name}」站徽！`
      : (gold ? `+1 ⭐ 金徽章 GOLD badge!` : `+1 ⭐ 溫故知新！`);
    $('#celeStars').textContent = first ? '⭐⭐⭐' : '⭐';
    $('#celebrate').classList.add('show');
    speak(praise.zh, 'zh');
  },

  speakLang() { return this.st.lang === 'en' ? 'en' : 'zh'; },

  /* ================= MATCH ================= */
  buildMatch() {
    this.matched = 0;
    this.selWord = this.selPic = null;
    const pairs = this.st.pairs;
    const zh = this.st.lang === 'zh';
    $('#gprompt').innerHTML = zh
      ? '將個字同圖片配對！撳字有得聽 🔊<br>Tap a word, then its picture.'
      : (this.st.lang === 'num'
        ? '將數字同方塊配對！<br>Match the number to the blocks.'
        : 'Tap a word, then its picture. 🔊');
    const cols = pairs.length <= 4 ? pairs.length : 3;
    $('#gboard').innerHTML = `
      <div class="pairgrid" id="wordRow" style="grid-template-columns:repeat(${cols},1fr)"></div>
      <div class="pairgrid" id="picRow"  style="grid-template-columns:repeat(${cols},1fr);margin-top:12px"></div>`;
    const wr = $('#wordRow'), pr = $('#picRow');
    shuffle([...pairs]).forEach(p => {
      const b = document.createElement('button');
      b.className = 'tile' + (p.a.length > 2 ? ' longword' : '');
      b.dataset.key = p.a;
      b.innerHTML = `${p.a}<small>${p.sub || p.j || ''}</small>`;
      b.onclick = () => { speak(p.a, this.speakLang()); this.pick(b, 'word'); };
      wr.appendChild(b);
    });
    shuffle([...pairs]).forEach(p => {
      const b = document.createElement('button');
      b.className = 'tile pic';
      b.dataset.key = p.a;
      b.innerHTML = `<span class="picbody">${p.b}</span><small>${p.e || ''}</small>`;
      b.onclick = () => this.pick(b, 'pic');
      pr.appendChild(b);
    });
  },

  pick(el, kind) {
    if (el.classList.contains('matched')) return;
    const prev = kind === 'word' ? this.selWord : this.selPic;
    if (prev) prev.classList.remove('sel');
    el.classList.add('sel');
    if (kind === 'word') this.selWord = el; else this.selPic = el;
    if (!(this.selWord && this.selPic)) return;

    const a = this.selWord, b = this.selPic;
    this.selWord = this.selPic = null;
    if (a.dataset.key === b.dataset.key) {
      a.classList.remove('sel'); b.classList.remove('sel');
      a.classList.add('matched'); b.classList.add('matched');
      this.matched++;
      if (this.matched === this.st.pairs.length) {
        setTimeout(() => this.finishStation(), 550);
      }
    } else {
      this.misses++;
      a.classList.add('wrong'); b.classList.add('wrong');
      toast(this.misses >= 2 ? '一齊搵吓⋯ Let’s look together!' : pickFrom(NUDGE).zh + ' ' + pickFrom(NUDGE).en);
      if (this.misses >= 2) {
        const hint = $$('#picRow .tile:not(.matched)');
        hint.forEach(t => { if (t.dataset.key === a.dataset.key) t.classList.add('hint'); });
        setTimeout(() => hint.forEach(t => t.classList.remove('hint')), 1600);
      }
      setTimeout(() => {
        a.classList.remove('sel', 'wrong');
        b.classList.remove('sel', 'wrong');
      }, 450);
    }
  },

  /* ================= LISTEN & FIND ================= */
  buildListen() {
    const pool = this.st.pool;
    const target = pickFrom(pool.filter(p => p.a !== this.lastKey));
    this.lastKey = target.a;
    this.target = target;
    const options = shuffle([target, ...shuffle(pool.filter(p => p.a !== target.a)).slice(0, 2)]);
    $('#gprompt').innerHTML = this.st.prompt
      || '你聽到邊個字？撳個喇叭再聽多次。<br>Tap the word you hear.';
    $('#gboard').innerHTML = `
      <div class="listenhub">
        <button class="speakerbtn" id="replay">🔊</button>
        <span class="sub">再聽 replay</span>
      </div>
      <div class="pairgrid" id="listenRow" style="grid-template-columns:repeat(3,1fr)"></div>`;
    $('#replay').onclick = () => speak(target.a, this.speakLang());
    const row = $('#listenRow');
    options.forEach(p => {
      const b = document.createElement('button');
      b.className = 'tile' + (p.a.length > 2 ? ' longword' : '');
      b.dataset.key = p.a;
      b.dataset.ok = p.a === target.a ? '1' : '0';
      b.innerHTML = `${p.a}<small>${p.j || ''}</small>`;
      b.onclick = () => this.listenPick(b);
      row.appendChild(b);
    });
    setTimeout(() => speak(target.a, this.speakLang()), 350);
  },

  listenPick(el) {
    if (this.busy) return;
    if (el.dataset.ok === '1') {
      this.busy = true;
      el.classList.add('matched');
      speak(this.target.a, this.speakLang());
      if (this.target.fact) {
        toast(this.target.fact);
        this.roundWon(1600);
      } else {
        this.roundWon();
      }
    } else {
      this.misses++;
      el.classList.add('wrong');
      setTimeout(() => el.classList.remove('wrong'), 450);
      if (this.misses >= 2) {
        const right = $('#listenRow .tile[data-ok="1"]');
        right.classList.add('hint');
        toast(`係「${this.target.a}」呀！Listen: ${this.target.e}`);
        speak(this.target.a, this.speakLang());
      } else {
        const nd = pickFrom(NUDGE);
        toast(nd.zh + ' 再聽多次 🔊');
        speak(this.target.a, this.speakLang());
      }
    }
  },

  /* ================= TALK TIME ================= */
  buildTalk() {
    const d = this.st.dialogs[this.round];
    $('#gprompt').innerHTML = '應該點答呢？Tap the best reply.';
    $('#gboard').innerHTML = `
      <div class="talkstage">
        <div class="npcrow">
          <span class="npcface">${d.icon}</span>
          <button class="bubble" id="npcbubble">${d.say}<small>${d.e}</small></button>
        </div>
        <div class="replies" id="replies"></div>
      </div>`;
    $('#npcbubble').onclick = () => speak(d.say, 'zh');
    const box = $('#replies');
    shuffle([...d.opts]).forEach(o => {
      const b = document.createElement('button');
      b.className = 'replybtn';
      b.dataset.ok = o.ok ? '1' : '0';
      b.textContent = o.t;
      b.onclick = () => this.talkPick(b, o);
      box.appendChild(b);
    });
    setTimeout(() => speak(d.say, 'zh'), 350);
  },

  talkPick(el, opt) {
    if (this.busy) return;
    speak(opt.t, 'zh');
    if (opt.ok) {
      this.busy = true;
      el.classList.add('goodreply');
      this.roundWon(1100);
    } else {
      this.misses++;
      el.classList.add('wrong');
      setTimeout(() => el.classList.remove('wrong'), 450);
      if (this.misses >= 2) $('#replies .replybtn[data-ok="1"]').classList.add('hint');
      toast('諗吓先⋯ Hmm, try the other one!');
    }
  },

  /* ================= CHARACTER FACTORY ================= */
  buildFactory() {
    const b = this.st.builds[this.round];
    this.factorySlots = new Array(b.parts.length).fill(null);
    /* parts pool = needed parts + one distractor from the other builds */
    const others = this.st.builds.filter(x => x !== b).flatMap(x => x.parts)
      .filter(p => !b.parts.includes(p));
    const pool = shuffle([...b.parts, ...(others.length ? [pickFrom(others)] : [])]);
    $('#gprompt').innerHTML = `啲字可以砌埋一齊㗎！砌個「${b.e}」字 ${b.pic}<br>Build the character that means “${b.e}”.`;
    $('#gboard').innerHTML = `
      <div class="factory">
        <div class="fslots" id="fslots">
          ${this.factorySlots.map((_, i) => `<button class="fslot" data-i="${i}"></button>`).join('')}
          <span class="farrow">→</span>
          <div class="fresult" id="fresult">?</div>
        </div>
        <div class="fparts" id="fparts">
          ${pool.map((p, i) => `<button class="tile fpart" data-part="${p}" data-i="${i}">${p}</button>`).join('')}
        </div>
      </div>`;
    $$('#fparts .fpart').forEach(t => t.onclick = () => this.factoryAdd(t, b));
    $$('#fslots .fslot').forEach(s => s.onclick = () => this.factoryRemove(s));
  },

  factoryAdd(tile, build) {
    if (this.busy || tile.classList.contains('used')) return;
    const i = this.factorySlots.indexOf(null);
    if (i === -1) return;
    speak(tile.dataset.part, 'zh');
    this.factorySlots[i] = { part: tile.dataset.part, tile };
    tile.classList.add('used');
    const slot = $(`#fslots .fslot[data-i="${i}"]`);
    slot.textContent = tile.dataset.part;
    slot.classList.add('filled');
    if (!this.factorySlots.includes(null)) this.factoryCheck(build);
  },

  factoryRemove(slot) {
    if (this.busy) return;
    const i = +slot.dataset.i;
    const cur = this.factorySlots[i];
    if (!cur) return;
    cur.tile.classList.remove('used');
    this.factorySlots[i] = null;
    slot.textContent = '';
    slot.classList.remove('filled');
  },

  factoryCheck(build) {
    const got = this.factorySlots.map(s => s.part).sort().join('');
    const want = [...build.parts].sort().join('');
    if (got === want) {
      this.busy = true;
      const res = $('#fresult');
      res.textContent = build.result;
      res.classList.add('made');
      speak(build.result, 'zh');
      toast(`${build.parts.join(' + ')} = ${build.result}（${build.e}）${build.pic}`);
      this.roundWon(1500);
    } else {
      this.misses++;
      $('#fslots').classList.add('wrong');
      toast(this.misses >= 2 ? `要用：${build.parts.join(' + ')} 呀！` : pickFrom(NUDGE).zh + ' ' + pickFrom(NUDGE).en);
      setTimeout(() => {
        $('#fslots').classList.remove('wrong');
        $$('#fslots .fslot').forEach(s => this.factoryRemove(s));
      }, 600);
    }
  },

  /* ================= MEMORY FLIP ================= */
  buildMemory() {
    this.memFirst = null;
    this.memLock = false;
    this.matched = 0;
    const pairs = this.st.pairs;
    const cards = shuffle(pairs.flatMap(p => [
      { key: p.a, face: p.a, small: p.j || '' },
      { key: p.a, face: p.b, small: p.e || '' },
    ]));
    $('#gprompt').innerHTML = '翻兩張卡，搵返一對！<br>Flip two cards to find a pair.';
    const cols = cards.length > 6 ? 4 : 3;
    $('#gboard').innerHTML = `<div class="memgrid" style="grid-template-columns:repeat(${cols},1fr)">
      ${cards.map((c, i) => `
        <button class="mcard" data-key="${c.key}" data-i="${i}">
          <span class="mback">🚇</span>
          <span class="mface">${c.face}<small>${c.small}</small></span>
        </button>`).join('')}
    </div>`;
    $$('.mcard').forEach(c => c.onclick = () => this.memFlip(c));
  },

  memFlip(card) {
    if (this.memLock || card.classList.contains('open') || card.classList.contains('matchedcard')) return;
    card.classList.add('open');
    if (/[一-鿿]/.test(card.querySelector('.mface').textContent)) {
      speak(card.dataset.key, 'zh');
    }
    if (!this.memFirst) { this.memFirst = card; return; }
    const a = this.memFirst, b = card;
    this.memFirst = null;
    if (a.dataset.key === b.dataset.key) {
      a.classList.add('matchedcard');
      b.classList.add('matchedcard');
      this.matched++;
      if (this.matched === this.st.pairs.length) {
        setTimeout(() => this.finishStation(), 600);
      }
    } else {
      this.memLock = true;
      setTimeout(() => {
        a.classList.remove('open');
        b.classList.remove('open');
        this.memLock = false;
      }, 900);
    }
  },

  /* ================= SENTENCE TRAIN ================= */
  buildSentence() {
    const s = this.st.sentences[this.round];
    this.target = s;
    this.factorySlots = new Array(s.words.length).fill(null);
    const otherWords = this.st.sentences.filter(x => x !== s).flatMap(x => x.words)
      .filter(w => !s.words.includes(w));
    const tray = shuffle([...s.words, ...(otherWords.length ? [pickFrom(otherWords)] : [])]);
    $('#gprompt').innerHTML = `${s.pic}<br>砌返句句子啦！Build the sentence: <i>${s.e}</i>`;
    $('#gboard').innerHTML = `
      <div class="sentence">
        <div class="strain" id="strain">
          <span class="sloco">🚂</span>
          ${this.factorySlots.map((_, i) => `<button class="sslot" data-i="${i}"></button>`).join('')}
        </div>
        <div class="stray" id="stray">
          ${tray.map((w, i) => `<button class="tile sword" data-word="${w}" data-i="${i}">${w}</button>`).join('')}
        </div>
      </div>`;
    $$('#stray .sword').forEach(t => t.onclick = () => this.sentenceAdd(t, s));
    $$('#strain .sslot').forEach(sl => sl.onclick = () => this.sentenceRemove(sl));
  },

  sentenceAdd(tile, s) {
    if (this.busy || tile.classList.contains('used')) return;
    const i = this.factorySlots.indexOf(null);
    if (i === -1) return;
    speak(tile.dataset.word, 'zh');
    this.factorySlots[i] = { part: tile.dataset.word, tile };
    tile.classList.add('used');
    const slot = $(`#strain .sslot[data-i="${i}"]`);
    slot.textContent = tile.dataset.word;
    slot.classList.add('filled');
    if (!this.factorySlots.includes(null)) this.sentenceCheck(s);
  },

  sentenceRemove(slot) {
    if (this.busy) return;
    const i = +slot.dataset.i;
    const cur = this.factorySlots[i];
    if (!cur) return;
    cur.tile.classList.remove('used');
    this.factorySlots[i] = null;
    slot.textContent = '';
    slot.classList.remove('filled');
  },

  sentenceCheck(s) {
    const got = this.factorySlots.map(x => x.part).join('');
    if (got === s.words.join('')) {
      this.busy = true;
      $('#strain').classList.add('depart');
      speak(s.words.join(''), 'zh');
      toast('🚂 ' + s.words.join('') + '！');
      this.roundWon(1400);
    } else {
      this.misses++;
      $('#strain').classList.add('wrong');
      if (this.misses >= 2) {
        /* Teach, don't fail: show the right order, say it, move on. */
        this.busy = true;
        setTimeout(() => {
          $$('#strain .sslot').forEach((sl, i) => {
            sl.textContent = s.words[i];
            sl.classList.add('filled', 'hint');
          });
          speak(s.words.join(''), 'zh');
          toast('一齊讀：' + s.words.join('') + '！');
          this.roundWon(1800);
        }, 650);
      } else {
        toast(pickFrom(NUDGE).zh + ' 聽吓個句子先 🔊');
        speak(s.words.join(''), 'zh');
        setTimeout(() => {
          $('#strain').classList.remove('wrong');
          $$('#strain .sslot').forEach(sl => this.sentenceRemove(sl));
        }, 650);
      }
    }
  },

  /* ================= COUNT / ONE-MORE ================= */
  buildCount() {
    const st = this.st;
    const onemore = st.mode === 'onemore';
    const min = st.min || 1;
    const max = onemore ? st.max - 1 : st.max;
    this.target = randInt(min, max);
    const answer = onemore ? this.target + 1 : this.target;
    $('#gprompt').innerHTML = onemore
      ? `呢度有 ${this.target} 個 — 多<b>一個</b>係幾多？<br>One MORE than ${this.target} is…?`
      : '有幾多個方塊？How many blocks?';
    $('#gboard').innerHTML = `
      <div class="blockstage"><div class="tower" id="tower"></div></div>
      <div class="answers" id="answers"></div>`;
    this.buildTower($('#tower'), this.target);
    this.buildAnswers(answer, st.max + (onemore ? 1 : 0));
  },

  /* ================= ADD ================= */
  buildAdd() {
    const max = this.st.max;
    const a = randInt(1, max - 2);
    const b = randInt(1, max - a - 1) || 1;
    this.target = a + b;
    $('#gprompt').innerHTML = `${a} 加 ${b} 係幾多？<br>What is ${a} + ${b}?`;
    $('#gboard').innerHTML = `
      <div class="blockstage add">
        <div class="tower" id="towerA"></div>
        <div class="plus">+</div>
        <div class="tower" id="towerB"></div>
      </div>
      <div class="answers" id="answers"></div>`;
    this.buildTower($('#towerA'), a);
    this.buildTower($('#towerB'), b);
    this.buildAnswers(this.target, max);
  },

  /* ================= QUICK PEEK (subitising) ================= */
  buildPeek() {
    this.target = randInt(this.st.min, this.st.max);
    $('#gprompt').innerHTML = '快啲睇！有幾多個？<br>Quick peek — how many?';
    $('#gboard').innerHTML = `
      <div class="blockstage" id="peekstage"><div class="tower" id="tower"></div>
        <div class="peekcover" id="peekcover">🎁</div></div>
      <div class="answers" id="answers"></div>`;
    this.buildTower($('#tower'), this.target);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      $('#peekcover').classList.add('down');
      this.buildAnswers(this.target, this.st.max);
    }, reduced ? 3200 : 1700);
  },

  /* ================= TAKE AWAY / ZERO ================= */
  buildTakeaway() {
    const max = this.st.max;
    const n = randInt(2, max);
    const k = this.st.allowZero ? (Math.random() < 0.4 ? n : randInt(1, n)) : randInt(1, n - 1);
    this.target = n - k;
    $('#gprompt').innerHTML = `${n} 減 ${k} 剩返幾多？<br>${n} take away ${k} — how many left?`;
    $('#gboard').innerHTML = `
      <div class="blockstage"><div class="tower" id="tower"></div></div>
      <div class="answers" id="answers"></div>`;
    this.buildTower($('#tower'), n);
    setTimeout(() => {
      const blocks = $$('#tower .block');
      for (let i = 0; i < k; i++) {
        const bl = blocks[blocks.length - 1 - i];
        bl.classList.add('hop');
        bl.style.animationDelay = (i * 0.22) + 's';
      }
      setTimeout(() => this.buildAnswers(this.target, max, this.st.allowZero), k * 220 + 500);
    }, 800);
  },

  /* ================= BOND BRIDGE ================= */
  buildBond() {
    const N = randInt(3, this.st.max);
    const a = randInt(1, N - 1);
    this.target = N - a;
    $('#gprompt').innerHTML = `${N} 可以拆開 ${a} 同幾多？<br>${N} = ${a} + ?`;
    $('#gboard').innerHTML = `
      <div class="blockstage add">
        <div class="tower" id="towerA"></div>
        <div class="plus">+</div>
        <div class="mystery">?</div>
      </div>
      <div class="answers" id="answers"></div>`;
    this.buildTower($('#towerA'), a);
    this.buildAnswers(this.target, this.st.max);
  },

  /* ================= TWINS (doubles) ================= */
  buildDouble() {
    const a = randInt(1, this.st.max);
    this.target = a * 2;
    $('#gprompt').innerHTML = `孖孖魔法！${a} 加 ${a} 係幾多？<br>Double ${a} is…?`;
    $('#gboard').innerHTML = `
      <div class="blockstage add">
        <div class="tower" id="towerA"></div>
        <div class="plus">+</div>
        <div class="tower ghost" id="towerB"></div>
      </div>
      <div class="answers" id="answers"></div>`;
    this.buildTower($('#towerA'), a);
    this.buildTower($('#towerB'), a);
    this.buildAnswers(this.target, this.st.max * 2);
  },

  /* ================= ODD OR EVEN ================= */
  buildOddEven() {
    const n = randInt(2, this.st.max);
    this.target = n % 2 === 0 ? 'even' : 'odd';
    $('#gprompt').innerHTML = `${n} 個方塊，兩個兩個孖住企 — 有冇一個冇得孖？<br>Is ${n} odd or even?`;
    const col = BLOCK_COLORS[(n - 1) % BLOCK_COLORS.length];
    let html = '<div class="pairtower">';
    for (let r = Math.ceil(n / 2) - 1; r >= 0; r--) {
      const inRow = Math.min(2, n - r * 2);
      html += `<div class="pairrow">${
        Array.from({ length: inRow }, (_, c) =>
          `<div class="block pb ${inRow === 1 ? 'lonely' : ''}" style="background:${col}"></div>`).join('')
      }</div>`;
    }
    html += '</div>';
    $('#gboard').innerHTML = `
      <div class="blockstage">${html}</div>
      <div class="answers oe" id="answers">
        <button class="btn" data-v="even" style="background:var(--green);box-shadow:0 5px 0 color-mix(in oklab, var(--green) 65%, black)">雙數 even 👯</button>
        <button class="btn red" data-v="odd">單數 odd ☝️</button>
      </div>`;
    $$('#answers .btn').forEach(b => b.onclick = () => {
      if (this.busy) return;
      if (b.dataset.v === this.target) {
        this.busy = true;
        toast(`啱晒！${n} 係${this.target === 'even' ? '雙' : '單'}數 ✓`);
        this.roundWon();
      } else {
        this.misses++;
        b.classList.add('wrong');
        setTimeout(() => b.classList.remove('wrong'), 450);
        toast(this.misses >= 2
          ? (this.target === 'odd' ? '睇吓最頂嗰個，冇得孖呀！☝️' : '個個都有得孖呀！👯')
          : pickFrom(NUDGE).zh + ' 睇吓啲方塊孖唔孖到！');
      }
    });
  },

  /* ================= FIVE AND A BIT ================= */
  buildFivebit() {
    const n = randInt(6, 10);
    this.target = n - 5;
    $('#gprompt').innerHTML = `${n} 係「5 加一啲」— 嗰啲係幾多？<br>${n} is five and a bit — how big is the bit?`;
    $('#gboard').innerHTML = `
      <div class="blockstage"><div class="tower" id="tower"></div></div>
      <div class="answers" id="answers"></div>`;
    const tower = $('#tower');
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'block';
      d.style.background = i < 5 ? 'var(--blue)' : '#F58A2E';
      d.style.animationDelay = (i * 0.06) + 's';
      if (i === n - 1) d.innerHTML =
        '<div class="facebits"><span class="eyes"><i></i><i></i></span><span class="smile"></span></div>';
      tower.appendChild(d);
    }
    this.buildAnswers(this.target, 5);
  },

  /* ================= MAKE TEN ================= */
  buildMaketen() {
    const a = randInt(1, 9);
    this.target = 10 - a;
    $('#gprompt').innerHTML = `${a} 加幾多先變成 10？<br>${a} and who make ten?`;
    $('#gboard').innerHTML = `
      <div class="blockstage"><div class="tower" id="tower"></div></div>
      <div class="answers" id="answers"></div>`;
    const tower = $('#tower');
    for (let i = 0; i < 10; i++) {
      const d = document.createElement('div');
      d.className = 'block' + (i >= a ? ' slotblock' : '');
      if (i < a) {
        d.style.background = BLOCK_COLORS[(a - 1) % BLOCK_COLORS.length];
        d.style.animationDelay = (i * 0.05) + 's';
      }
      if (i === a - 1) d.innerHTML =
        '<div class="facebits"><span class="eyes"><i></i><i></i></span><span class="smile"></span></div>';
      tower.appendChild(d);
    }
    this.buildAnswers(this.target, 9);
  },

  /* ================= shared tower / answers / guess ================= */
  buildTower(el, n) {
    el.innerHTML = '';
    const col = BLOCK_COLORS[(n - 1) % BLOCK_COLORS.length];
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'block';
      d.style.background = col;
      d.style.animationDelay = (i * 0.06) + 's';
      if (i === n - 1) d.innerHTML =
        '<div class="facebits"><span class="eyes"><i></i><i></i></span><span class="smile"></span></div>';
      el.appendChild(d);
    }
  },

  buildAnswers(answer, cap, allowZero = false) {
    const floor = allowZero ? 0 : 1;
    const opts = new Set([answer]);
    while (opts.size < 3) {
      const d = answer + (Math.random() < 0.5 ? -1 : 1) * randInt(1, 2);
      if (d >= floor && d <= Math.max(cap, answer + 2)) opts.add(d);
    }
    const ans = $('#answers');
    ans.innerHTML = '';
    shuffle([...opts]).forEach(n => {
      const b = document.createElement('button');
      b.className = 'numbtn';
      b.style.background = this.line.color;
      b.textContent = n;
      b.onclick = () => this.guess(n, answer, b);
      ans.appendChild(b);
    });
  },

  guess(n, answer, btn) {
    if (this.busy) return;
    if (n === answer) {
      this.busy = true;
      speak(String(answer), 'zh');
      if (answer === 0) toast('冇晒喇！Zero! 0️⃣');
      else toast(`啱晒！${answer} ✓`);
      this.roundWon();
    } else {
      this.misses++;
      btn.classList.add('wrongpick');
      if (this.misses >= 2) {
        toast('一齊數吓：1、2、3⋯ Count together!');
        $('#peekcover') && $('#peekcover').classList.add('down');
        $$('#gboard .block:not(.slotblock)').forEach((bl, i) => {
          bl.style.animation = 'none';
          void bl.offsetWidth;
          bl.style.animation = `drop .3s ease ${i * 0.25}s backwards`;
        });
      } else {
        const nd = pickFrom(NUDGE);
        toast(nd.zh + ' ' + nd.en + ' 💪');
      }
    }
  },
};

/* ---------- celebration / rest overlays ---------- */
function celeReplay() {
  $('#celebrate').classList.remove('show');
  Game.start(App.currentLine, App.currentStation);
  App.show('game');
}
function celeNext() {
  $('#celebrate').classList.remove('show');
  App.openLine(App.currentLine.id);
}

/* ---------- parent gate (hold 3 s) ---------- */
(function gate() {
  let t = null;
  const btn = () => $('#gatebtn');
  document.addEventListener('pointerdown', e => {
    if (e.target.closest && e.target.closest('#gatebtn')) {
      btn().classList.add('holding');
      t = setTimeout(() => {
        $('#parent-gate').hidden = true;
        $('#parent-panel').hidden = false;
        App.renderParentPanel();
      }, 3000);
    }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
    document.addEventListener(ev, () => {
      if (t) { clearTimeout(t); t = null; }
      if (btn()) btn().classList.remove('holding');
    }));
})();

document.addEventListener('DOMContentLoaded', () => App.init());
