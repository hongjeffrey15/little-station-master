# 小站長 Little Station Master — Syllabus

**Learner:** 5-year-old in Hong Kong, Cantonese/English bilingual (K2–K3)
**Format:** 10–15 minute sessions · every lesson is a "station" on an MTR-style
journey map · no failure states — only gentle retry and guided practice
**Lines:** 數字線 Number Line (maths) · 香港中文線 Chinese Line (Traditional
characters) · English Line

---

## Strand A — 數字線 Number Line

Progression modelled on **Numberblocks Seasons 1–4**.

| Stage | Numberblocks ref | Skills | Stations |
|---|---|---|---|
| A1 | S1 (eps 1–8) | Count 1–5, subitising, numeral ↔ quantity | m1 數到三 · m2 數到五 · m4 數字配對 1–5 |
| A2 | S1 (eps 9–15) | Count 6–10, number shapes, one more / one less | m3 數到十 · m5 數字配對 6–10 · m6 多一個 |
| A3 | S2 | Addition within 10, number bonds, odd & even | m7 加加睇 (+5) · m8 加到十 · (v2: 拆數橋 bonds, 單雙站 odd/even) |
| A4 | S3 | Teens 11–20 as "ten and some more", ordering | v2: 十加幾 · 排隊站 |
| A5 | S4 | Tens to 100, skip counting 2/5/10, doubles & halves, patterns | v2: 十十車廂 · 跳數列車 · 孖孖站 |

V1 ships A1–A3 (stations m1–m8). A4–A5 are content updates only — the count /
match / add engines already support them (see `js/data.js`).

---

## Strand B — 香港中文線 Chinese Line (Traditional, Cantonese audio)

**Pedagogy**

- **Whole-character recognition first** (look-and-say). Writing and stroke
  order are *not* v1 goals; recognition + speech are.
- **Pictographs first** — 日 月 山 水 人 look like what they mean, giving fast
  early wins.
- **Radicals later as "building blocks"** — a deliberate echo of how
  Numberblocks builds numbers from ones.
- Jyutping is displayed small (for the parent); the child learns by ear via
  Cantonese audio.
- **Whole-name reading** for MTR stations: a 5-year-old can sight-read 中環
  as a unit long before writing 環 — and gets the real-world payoff of
  reading the actual station sign on a real journey.

| Theme | Stations | Characters / words |
|---|---|---|
| B1 我的一天 Daily routine | c1 早晨站 · c2 食飯站 · c3 大細站 | 日 月 人 食 飯 水 茶 大 小 手 口 · later: 早 晨 刷 牙 返 學 瞓 覺 爸 媽 多謝 唔該 |
| B2 搭港鐵 MTR | c4 中環站 · c5 搭港鐵站 | 中環 · 山頂 · 迪士尼 · 旺角 · 沙田 · 東涌 · later: 金鐘 尖沙咀 太子 香港 銅鑼灣 |
| B3 遊香港 Sightseeing | c6 山頂站 · c7 天星站 · c8 海洋站 | 山 上 下 天 星 船 海 魚 花 樹 |

**Milestones:** ~50 characters by sight + sound in the first term; reads 8 MTR
station names on a real journey; answers "呢個係咩字?" for all B1 characters.

---

## Strand C — English Line

| Unit | Stations | Content |
|---|---|---|
| C1 Letter sounds | e1 s·a·t · e2 p·i·n | Jolly Phonics order (next: c k e h r m d) — letter ↔ sound-picture |
| C2 First words | e3 · e4 | CVC words: cat sun bus dog egg hat |
| C3 Vocabulary | e5 Colours · e6 Animals | red blue green yellow · fish bird horse |
| C4 HK Bridge | e7 · e8 | The signature bilingual activity: one picture carries both 山 and *mountain* — each language reinforces the other |

---

## Reward & wellbeing design — the "no harmful hooks" contract

- **Earn, never buy.** Stars → station badges → sticker book. No ads, no
  in-app purchases, no external links reachable from the child's flow.
- **No pressure loops.** No streaks, no lives, no countdown timers, no
  "come back or lose it" notifications.
- **Failure teaches.** Wrong answer → gentle wiggle + "再試吓!". After two
  misses, the correct answer glows / the blocks count themselves out loud —
  the game scaffolds instead of punishing.
- **Session pacing.** After ~15 minutes a friendly 夠鐘休息啦 screen suggests
  a stretch. Celebratory, not punitive; parent can toggle it.
- **Parent gate.** Settings, progress and backup live behind a
  hold-3-seconds button, out of the child's flow.

## Progression & assessment

- A station is **mastered (gold badge)** when completed on two different
  days — spaced repetition built into the reward system.
- First completion +3 ⭐, replays +1 ⭐ (revisiting is rewarded, never
  required).
- Stations unlock in sequence per line; the three lines are independent so a
  child can be ahead in maths and earlier in Chinese.
- Parent dashboard: characters known, stations per line, sync status.

## 12-week suggested rhythm

| Weeks | Number Line | Chinese Line | English Line |
|---|---|---|---|
| 1–2 | m1–m2 count to 5 | c1 早晨站 | e1 s·a·t |
| 3–4 | m3 count to 10 | c2 食飯站 | e2 p·i·n |
| 5–6 | m4 match 1–5 | c3 大細站 | e3 first words |
| 7–8 | m5–m6 match, one more | c4 中環站 | e4 more words |
| 9–10 | m7 add to 5 | c5 搭港鐵 + c6 山頂 | e5 colours |
| 11–12 | m8 add to 10 | c7 天星 + c8 海洋 | e6–e8 animals + bridge |

Little and often beats long sessions: 10–15 minutes, ideally tied to a daily
anchor (after dinner, before bath). Replaying earlier stations is a feature —
that's how badges turn gold.
