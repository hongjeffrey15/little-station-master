# 小站長 Little Station Master 🚇

A bilingual (Traditional Chinese + English) learning game for young kids in
Hong Kong. Every lesson is a **station** on an MTR-style journey: Chinese
characters from famous HK places and daily life, English phonics and first
words, and early maths inspired by Numberblocks.

**No ads. No purchases. No streaks, timers or pressure loops.** Wrong answers
get a gentle "再試吓!" and, after two tries, the game teaches instead of
failing the child. A rest reminder appears after 15 minutes.

## Play

- **Live:** https://hongjeffrey15.github.io/little-station-master/
- Works on any phone/tablet browser. Add to home screen for a full-screen app.

## The three lines

| Line | What it teaches |
|---|---|
| 數字線 Number Line | Counting 1–10, numeral matching, one-more, addition — Numberblocks S1–S2 progression |
| 香港中文線 Chinese Line | Trad. characters via daily routine, MTR station names (中環, 旺角, 沙田…) and HK sights (山頂, 天星小輪, 海洋公園) with Cantonese audio |
| English Line | Jolly-Phonics-order letter sounds, first words, and "HK Bridge" bilingual vocabulary |

Full curriculum: [docs/SYLLABUS.md](docs/SYLLABUS.md). All content lives in
[`js/data.js`](js/data.js) — add stations without touching the engine.

## Tech

- Vanilla HTML/CSS/JS. **No build step, no dependencies.** Open `index.html`
  or serve the folder with any static server.
- Progress is local-first (`localStorage`) with a copyable **backup code**
  for moving between devices (Parents → Backup).
- Audio uses the browser's speech synthesis (`zh-HK` / `en-GB`).

## Deploying

### GitHub Pages (current)

Pushes to `main` auto-deploy via `.github/workflows/pages.yml`.

### Cloudflare Pages — switches on cloud sync

1. Cloudflare dashboard → Workers & Pages → Create → Pages →
   connect this repo. Framework preset: **None**, build command: *(empty)*,
   output directory: `/`.
2. Create a KV namespace (Workers → KV) and bind it to the Pages project as
   **`PROGRESS`** (Pages project → Settings → Bindings → KV namespace).
3. Redeploy. Done — the app detects `/api/progress/__ping` and starts
   syncing automatically, keyed by the anonymous family code shown in the
   Parents area. Enter the same code on another device to share progress.

No accounts, no personal data — the random family code is the only key.

### Vercel

Static hosting works out of the box (`vercel --prod`), but the sync function
in `functions/` is Cloudflare-specific; on Vercel the app simply stays in
local + backup-code mode.
