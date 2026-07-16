/* Generates docs/CONTENT.md — a reviewable snapshot of the whole content
 * pack, straight from js/data.js so it can never drift from the game.
 * Run: node scripts/generate-content.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const LINES = new Function(
  fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + '; return LINES;'
)();

const pic = b => !b ? '' : b.startsWith('img:') ? `🖼 ${b.slice(4)}` : b.replace(/<br>/g, ' ');

const mathDesc = s => ({
  count:    s.mode === 'onemore'
    ? `Show a tower of n (${s.min}–${s.max}); child answers n+1 ("one more").`
    : `Count a tower of ${s.min}–${s.max} blocks, pick the numeral.`,
  add:      `Two towers a + b (total ≤ ${s.max}); pick the sum.`,
  peek:     `Subitising: a tower of ${s.min}–${s.max} flashes ~1.7 s then hides; answer from memory.`,
  takeaway: s.allowZero
    ? `Blocks hop off, answers can reach 0 — introduces zero (max ${s.max}).`
    : `n blocks, k hop off; how many left (within ${s.max}).`,
  bond:     `Part-part-whole: N = a + ? (N ≤ ${s.max}).`,
  double:   `Tower + its mirror; what is double a (a ≤ ${s.max}).`,
  oddeven:  `Blocks pair up two-by-two (2–${s.max}); is one left over? odd/even.`,
  fivebit:  `6–10 shown as a blue five plus an orange "bit"; how big is the bit.`,
  maketen:  `A tower of a inside a dashed 10-frame; what joins a to make 10.`,
  teens:    `A ten-frame plus 1–9 ones; what teen number is that.`,
  tens:     `2–5 train carriages of ten; count in tens.`,
  skip:     `Sequence train in 2s/5s/10s; pick the next number.`,
}[s.type]);

let md = `# 小站長 Little Station Master — Content Pack

> Generated from \`js/data.js\` — the single source of truth the game runs on.
> Review anything here and comment; every item is editable data.

**How pictures work:** 🖼 = illustration file in \`assets/pics/\`
(Mulberry Symbols or the hand-drawn HK pack); a plain emoji means the emoji
itself is the picture. Listening / talking / sentence stations are
audio-first and use no pictures by design.

`;

for (const line of LINES) {
  const total = line.stations.length;
  md += `\n---\n\n## ${line.name} ${line.en} — ${total} stations\n`;
  let lastTheme = null;
  for (const s of line.stations) {
    if (s.theme && s.theme !== lastTheme) {
      lastTheme = s.theme;
      md += `\n### 主題 Theme: ${s.theme}\n`;
    }
    md += `\n**${s.id} · ${s.name} — ${s.en}**  \n`;
    if (s.pairs && s.type === 'match') {
      md += `_Match: tap the word, then its picture._\n\n`;
      md += `| 字/word | 讀音 | English | 圖 picture |\n|---|---|---|---|\n`;
      for (const p of s.pairs) md += `| ${p.a}${p.sub ? `（${p.sub}）` : ''} | ${p.j || ''} | ${p.e || ''} | ${pic(p.b)} |\n`;
    } else if (s.type === 'memory') {
      md += `_Memory flip: find the character–picture pairs._\n\n`;
      md += `| 字 | 讀音 | English | 圖 |\n|---|---|---|---|\n`;
      for (const p of s.pairs) md += `| ${p.a} | ${p.j || ''} | ${p.e || ''} | ${pic(p.b)} |\n`;
    } else if (s.type === 'listen') {
      md += `_Listen & find: hear the word${s.prompt ? ' (MTR announcement style)' : ''}, tap the right one. Audio-only — no pictures._\n\n`;
      md += `| 字/名 | 讀音 | English |${s.pool.some(p => p.fact) ? ' 答啱後小知識 fun fact |' : ''}\n|---|---|---|${s.pool.some(p => p.fact) ? '---|' : ''}\n`;
      for (const p of s.pool) md += `| ${p.a} | ${p.j || ''} | ${p.e || ''} |${s.pool.some(x => x.fact) ? ` ${p.fact || ''} |` : ''}\n`;
    } else if (s.type === 'talk') {
      md += `_Talk time: pick the right conversational reply._\n\n`;
      for (const d of s.dialogs) {
        const good = d.opts.find(o => o.ok).t;
        const bad = d.opts.filter(o => !o.ok).map(o => o.t).join(' / ');
        md += `- ${d.icon}「${d.say}」(${d.e})\n  - ✅ 「${good}」 ❌ 「${bad}」\n`;
      }
    } else if (s.type === 'factory') {
      md += `_Character factory: build the compound from its parts._\n\n`;
      for (const b of s.builds) md += `- ${b.parts.join(' + ')} = **${b.result}** (${b.j}, ${b.e}) ${b.pic}\n`;
    } else if (s.type === 'sentence') {
      md += `_Sentence train: arrange the word carriages._\n\n`;
      for (const x of s.sentences) md += `- ${x.pic} **${x.words.join(' · ')}** — ${x.e}\n`;
    } else {
      md += `_Maths (${s.type}): ${mathDesc(s)}_\n`;
    }
  }
}

md += `\n---\n\n## Reward & safety rules (engine-wide)

- First completion of a station: **+3 ⭐** and its badge; replays **+1 ⭐**.
- A badge turns **gold** when the station is completed on two different days.
- Two misses anywhere → the game teaches (glowing hint, counting together,
  or assembling the sentence itself) — never a fail state.
- 15-minute gentle rest reminder · no ads · no purchases · no streaks.
- 自由探索 Free roam is on by default; parents can turn sequential
  unlocking back on in 家長專區.
`;

fs.writeFileSync(path.join(root, 'docs/CONTENT.md'), md);
console.log('Wrote docs/CONTENT.md —',
  LINES.reduce((n, l) => n + l.stations.length, 0), 'stations across',
  LINES.length, 'lines');
