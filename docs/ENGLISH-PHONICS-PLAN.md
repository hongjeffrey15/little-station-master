# English Line — Phonics Redesign Plan

> For review. Nothing here is built yet. The goal: replace the current
> fragmented English line with a proper **synthetic-phonics** progression that
> teaches a child to *decode* — to combine sounds into words — the way HK and
> UK schools actually teach reading.

---

## 1. What's wrong today (honest diagnosis)

The current English line (e1–e8) is **not phonics** — it's four unrelated
activities wearing a phonics label:

| Now | Problem |
|---|---|
| e1–e2: letter → picture (s→snake) | Teaches "s is for snake" (initial-sound trivia), but never the pure sound /s/, and never what to *do* with it. |
| e3–e4: whole words cat/sun/bus → picture | Jumps straight to matching whole-word *shapes* to pictures. The child memorises the picture, they don't **decode** c-a-t. This is "look-and-guess", the opposite of phonics. |
| e5–e6: colours, animals | Vocabulary, not phonics at all. |
| e7–e8: HK bridge | Good idea, but the English words aren't decodable yet. |

**The missing thing is the whole point of phonics: blending** — pushing
individual sounds together to read an unknown word (c-a-t → "cat"). Without it,
a child can't read a word they haven't already memorised.

---

## 2. The method we should follow

**Synthetic phonics** — the approach mandated in UK schools and used across HK
international/bilingual kindergartens (Jolly Phonics, Letters & Sounds). Three
evidence-based principles:

1. **Teach pure sounds, not letter names.** The child learns /s/ /a/ /t/
   (the sounds), *not* "ess" "ay" "tee" (the names). You can't blend names —
   "ess-ay-tee" doesn't make "sat"; "sss-a-t" does.
2. **Ear before print.** Start with *oral* blending — hearing "c-a-t" and
   knowing it's *cat* — before a single letter is shown. (This is Letters &
   Sounds "Phase 1".)
3. **Sounds in a smart order, blending from day one.** The first six sounds are
   **s a t i p n** — chosen because they make more little words than any other
   six letters, so the child blends *real words* almost immediately. Each new
   set of sounds is instantly combined with the old ones.

Canonical sound order (Jolly Phonics groups / Letters & Sounds Phase 2–3):

`s a t i p n` → `c k e h r m d` → `g o u l f b` → digraphs `sh ch th ng` → …

Sources: [Letters & Sounds phases](https://www.twinkl.com/teaching-wiki/order-of-phonics-teaching) ·
[Jolly Phonics 7 groups](https://www.vedantu.com/phonics/42-sounds-of-jolly-phonics) ·
[blending & segmenting](https://fivefromfive.com.au/phonics-teaching/essential-principles-of-systematic-and-explicit-phonics-instruction/blending-and-segmenting/).

---

## 3. New game engines (in our station idiom)

| Engine | What the child does | Skill |
|---|---|---|
| **Letter Sound** `lettersound` | A big letter appears; hears the **pure sound** /s/; a keyword picture (snake) + action; taps to replay; a quick "which one says /s/?" check | Grapheme→phoneme |
| **Sound Hunt** `hearblend` | Hears three separated sounds "c … a … t", taps the matching picture (cat) among 3. **No letters shown.** | Oral blending (the ear) |
| **Blend to Read** `blend` | Sees tiles `c a t`; taps each to hear its sound; a **"blend it!" button** sweeps the sounds together fast → "cat"; then picks the picture | **Decoding — the core skill** |
| **Word Builder** `spell` | Hears "cat" + sees the picture; drags letter tiles into 3 slots to spell it | Segmenting (for spelling) |
| **Tricky Words** `tricky` | Learns high-frequency words that *can't* be sounded out (the, I, to, go) as sight words, with audio and in a short phrase | Sight vocabulary |

`blend` reuses our existing tile + picture-choice patterns; `spell` reuses the
sentence-train drag-into-slots mechanic. So ~2 genuinely new engines, 3 are
recombinations of what we already have.

---

## 4. Proposed progression (replaces e1–e8)

Each unit = a few stations. New sounds are **bold**; every unit blends them
with all earlier sounds.

| Unit | Focus | Sounds | Words the child can now read |
|---|---|---|---|
| **0 · Big Ears 👂** | Oral only, *no letters* — rhyme, alliteration, Sound Hunt | — | (hears & blends by ear) |
| **1 · s a t p** | first sounds + first blends | **s a t p** | at, sat, pat, tap, sap |
| **2 · i n m d** | + blending | **i n m d** | in, it, sit, tin, pin, man, mad, dad, nap |
| **3 · g o c k** | + blending | **g o c k** | dog, got, cot, cat, kit, can, cap |
| **4 · e u r ck** | + blending | **e u r ck** | red, run, rug, sun, cup, duck, kick, sock |
| **5 · h b f l** | + blending | **h b f l** | hat, hen, bed, bus, fan, fun, leg, log |
| **6 · Word Builder** | segmenting/spelling across all learned sounds | — | spells cat, dog, sun, bus… |
| **7 · Tricky Words** | non-decodable sight words | — | the, I, to, no, go, into |
| **8 · First Digraphs** | two letters, one sound | **sh ch th ng** | ship, shop, chat, chip, this, ring, sing |
| **9 · HK Bridge 🇭🇰** | decodable English ↔ Chinese | — | sun/太陽, cat/貓, bus/巴士 — now *decoded*, not memorised |

By Unit 5 the child can genuinely **read ~40 three-letter words they've never
seen** — the real milestone. That's what the current line never delivers.

---

## 5. The one thing that needs a decision: **audio**

Phonics lives or dies on **pure phoneme sound**. The problem: the phone's
built-in text-to-speech says letter **names** ("ess", "ay") and *cannot*
reliably produce an isolated /s/ — which would teach the child the wrong thing
and make blending impossible.

So proper phonics needs a small set of **recorded sound clips**: ~42 phonemes +
~120 keyword/CVC words (≈2–3 minutes of audio total, small compressed files
committed to the repo). Three ways to get them:

- **A. Generate once with a TTS service** (e.g. a phonics-capable voice) — I'd
  need a network domain allowed, then I produce and commit them. Fast, free,
  consistent; slightly robotic.
- **B. You (or a native speaker) record them** — warmest and most authentic;
  ~30 min of recording from a word list I'd provide.
- **C. Ship with device TTS as a fallback now**, add real clips later — lets the
  engines land immediately, but the phoneme quality is wrong until clips arrive.

This is the same "recorded audio" upgrade I flagged earlier — phonics is the
feature that actually makes it worth doing. The Chinese line can stay on device
TTS; only the English phonics needs recorded phonemes.

---

## 6. Suggested rollout

- **Build 1:** the `blend` + `hearblend` engines and Units 0–2 (s a t i p n).
  This alone turns the line into real phonics and proves the approach.
- **Build 2:** Units 3–5 (rest of the single sounds) + `spell` Word Builder.
- **Build 3:** Tricky words, digraphs, and the re-decodable HK Bridge.

Existing e1–e8 would be retired; since free-roam is on and progress is early,
that's low-cost.

---

## Decisions I need from you

1. **Audio route** — A (I generate via TTS), B (you record), or C (TTS now,
   clips later)?
2. **Approve the progression** in §4, or adjust (e.g. slower start, keep
   colours/animals as a separate "vocabulary" side-line)?
3. **Build scope** — start with Build 1 (Units 0–2) for review, or go further?
