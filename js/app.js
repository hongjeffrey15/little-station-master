/* 小站長 Little Station Master — app shell + game engines.
 * No build step, no dependencies. See js/data.js for curriculum,
 * js/store.js for persistence/sync.
 */

const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const pickFrom = a => a[Math.floor(Math.random() * a.length)];

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
          return `
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

  renderParentPanel() {
    const known = LINES.find(l => l.id === 'c').stations
      .filter(s => Store.isDone(s.id))
      .flatMap(s => s.pairs.map(p => p.a));
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
        <p class="sub">識咗嘅字 Characters known（${known.length}）：${known.join('、') || '未開始'}</p>
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

const Game = {
  line: null, st: null,
  round: 0, rounds: 3,
  matched: 0, selWord: null, selPic: null, misses: 0,
  target: 0, addends: null,

  start(line, st) {
    this.line = line;
    this.st = st;
    this.round = 0;
    this.misses = 0;
    this.rounds = st.type === 'match' ? 1 : 3;
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
    if (this.st.type === 'match') this.buildMatch();
    else if (this.st.type === 'add') this.buildAdd();
    else this.buildCount();
    if (this.rounds > 1) this.pips();
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

  /* ---------- MATCH ---------- */
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
    const cols = Math.min(pairs.length, 4);
    $('#gboard').innerHTML = `
      <div class="pairgrid" id="wordRow" style="grid-template-columns:repeat(${cols},1fr)"></div>
      <div class="pairgrid" id="picRow"  style="grid-template-columns:repeat(${cols},1fr);margin-top:12px"></div>`;
    const wr = $('#wordRow'), pr = $('#picRow');
    shuffle([...pairs]).forEach(p => {
      const b = document.createElement('button');
      b.className = 'tile' + (p.a.length > 2 ? ' longword' : '');
      b.dataset.key = p.a;
      b.innerHTML = `${p.a}<small>${p.sub || p.j || ''}</small>`;
      b.onclick = () => { speak(p.a, this.st.lang === 'zh' ? 'zh' : 'en'); this.pick(b, 'word'); };
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
      $('#gstars').textContent = Store.data.stars;
      if (this.matched === this.st.pairs.length) {
        setTimeout(() => this.finishStation(), 550);
      }
    } else {
      this.misses++;
      a.classList.add('wrong'); b.classList.add('wrong');
      toast(this.misses >= 2 ? '一齊搵吓⋯ Let’s look together!' : pickFrom(NUDGE).zh + ' ' + pickFrom(NUDGE).en);
      if (this.misses >= 2) {
        /* After two misses, glow the correct picture — teach, don't fail. */
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

  /* ---------- COUNT / ONE-MORE ---------- */
  buildCount() {
    const st = this.st;
    const onemore = st.mode === 'onemore';
    const min = st.min || 1;
    const max = onemore ? st.max - 1 : st.max;
    this.target = min + Math.floor(Math.random() * (max - min + 1));
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

  /* ---------- ADD ---------- */
  buildAdd() {
    const max = this.st.max;
    const a = 1 + Math.floor(Math.random() * (max - 2));
    const b = 1 + Math.floor(Math.random() * (max - a - 0.01));
    this.addends = [a, b];
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

  buildAnswers(answer, cap) {
    const opts = new Set([answer]);
    while (opts.size < 3) {
      const d = answer + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2));
      if (d >= 1 && d <= Math.max(cap, answer + 2)) opts.add(d);
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
    if (n === answer) {
      speak(String(answer), 'zh');
      this.round++;
      if (this.rounds > 1) this.pips();
      if (this.round >= this.rounds) {
        setTimeout(() => this.finishStation(), 400);
      } else {
        toast(`啱晒！${answer} ✓`);
        setTimeout(() => this.nextRound(), 750);
      }
    } else {
      this.misses++;
      btn.classList.add('wrongpick');
      if (this.misses >= 2) {
        toast('一齊數吓：1、2、3⋯ Count together!');
        /* Bounce blocks one by one as a counting scaffold. */
        $$('#gboard .block').forEach((bl, i) => {
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
