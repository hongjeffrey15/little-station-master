#!/usr/bin/env bash
# Generates English phonics audio with espeak-ng (offline) -> MP3 (iOS-safe).
# Pure phonemes use [[...]] espeak phoneme codes so the child hears the SOUND
# /s/, never the letter name "ess". Re-run to regenerate. Needs espeak-ng + lame.
set -e
cd "$(dirname "$0")/.."
OUT=assets/audio/en
mkdir -p "$OUT"
gen(){ # gen <name> <espeak-text> [speed] [pitch]
  espeak-ng -v en-gb -s "${3:-140}" -p "${4:-58}" "$2" -w "$OUT/$1.wav" 2>/dev/null
  lame --quiet --preset voice -m m "$OUT/$1.wav" "$OUT/$1.mp3"
  rm -f "$OUT/$1.wav"
}
# --- pure letter sounds (phonemes); stops kept crisp to limit the schwa ---
gen snd_a "[[a]]";  gen snd_e "[[E]]";  gen snd_i "[[I]]"; gen snd_o "[[0]]"; gen snd_u "[[V]]"
gen snd_s "[[s:]]"; gen snd_t "[[t]]";  gen snd_p "[[p]]"; gen snd_n "[[n]]"
gen snd_m "[[m:]]"; gen snd_d "[[d]]";  gen snd_k "[[k]]"; gen snd_g "[[g]]"
gen snd_b "[[b]]";  gen snd_h "[[h]]"
# --- whole words (said after blending) ---
for w in cat dog sun pig bus hat pin bed tin nap man dad tap; do gen "w_$w" "$w" 130 58; done
echo "generated $(ls "$OUT"/*.mp3 | wc -l) clips, $(du -sh "$OUT" | cut -f1)"
