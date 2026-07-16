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
| A2b | S1 | Subitising (recognise without counting) | m9 瞬間睇 Quick Peek |
| A3 | S2 | Addition & subtraction within 10, part-part-whole bonds, zero | m7 加加睇 · m10 減減睇 Hop Off · m11 拆數橋 Bond Bridge · m8 加到十 · m13 零之站 Zero Hero |
| A3b | S2–S3 | Doubles, odd & even, "five and a bit", bonds to 10 | m12 孖孖站 Twins · m14 單雙站 Odd or Even · m15 五加幾 Five & a Bit · m16 合十朋友 Make Ten |
| A4 | S3 | Teens 11–20 as "ten and some more", ordering | v3: 十加幾 · 排隊站 |
| A5 | S4 | Tens to 100, skip counting 2/5/10, halving, arrays | v3: 十十車廂 · 跳數列車 |

V2 ships A1–A3b (16 stations). A4–A5 are content updates — the engines
already support them (see `js/data.js`).

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

**Learning modes (v2):** every theme mixes several engines —
*Match* (learn) · *聽字 Listen & Find* (sound→print) · *傾偈 Talk Time*
(conversational replies) · *翻卡 Memory Flip* (retrieval practice) ·
*砌字工場 Character Factory* (compositional/radical awareness: 日+月=明) ·
*句子火車 Sentence Train* (first syntax).

| Theme | Stations | Characters / words |
|---|---|---|
| B1 我的一天 Daily routine | c1 早晨站 · c2 食飯站 · c3 大細站 | 日 月 人 食 飯 水 茶 大 小 手 口 |
| B2 搭港鐵 MTR | c4 中環站 · c5 搭港鐵站 | 中環 · 山頂 · 迪士尼 · 旺角 · 沙田 · 東涌 |
| B3 遊香港 Sightseeing | c6 山頂站 · c7 天星站 · c8 海洋站 | 山 上 下 天 星 船 海 魚 花 樹 |
| B4 屋企 Family | c9 match · c10 listen · c11 talk | 爸爸 媽媽 哥哥 姐姐 妹妹 我 + 早晨/多謝/唔使客氣 dialogues |
| B5 飲茶 Dim sum | c12 match · c13 listen · c14 talk | 蝦餃 燒賣 蛋撻 奶茶 粥 飲 食 + ordering dialogues |
| B6 顏色 Colours | c15 match · c16 memory | 紅 黃 藍 綠 黑 白 |
| B7 數字 Numbers | c17 match · c18 listen | 一 至 十 — cross-line bridge with the Number Line |
| B8 身體 Body | c19 match · c20 memory | 頭 眼 耳 口 手 腳 |
| B9 砌字工場 Factory | c21 · c22 | 日+月=明 · 木+木=林 · 火+火=炎 · 女+子=好 · 人+木=休 · 木×3=森 |
| B10 講句子 Sentences | c23 · c24 | 我食飯 · 我飲水 · 我去山頂 · 爸爸飲茶 · 媽媽食燒賣 |
| B11 天氣 Weather | c25 match · c26 talk | 太陽 雨 風 熱 凍 + weather dialogues |
| B12 街市 Market | c27 match · c28 memory | 菜 魚 蛋 蘋果 橙 |
| B13 出街 Transport | c29 match · c30 listen | 巴士 的士 電車 船 飛機 |
| B14 節日 Festivals | c31 match · c32 talk | 新年 利是 月餅 燈籠 + 恭喜發財 dialogues |

**Milestones:** ~80 characters/words by sight + sound across the year; reads 8
MTR station names on a real journey; orders dim sum in Cantonese; builds 6
compound characters from components.

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
