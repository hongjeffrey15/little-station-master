/* 小站長 Little Station Master — curriculum data
 *
 * Everything the game teaches lives here, so parents/teachers can tune
 * content without touching the engine. Three "MTR lines":
 *   m — 數字線 Number Line   (maths, Numberblocks-style progression)
 *   c — 香港中文線 Chinese Line (Trad. Chinese via HK places + daily life)
 *   e — English Line          (phonics, first words, bilingual bridge)
 *
 * Station types:
 *   count  — count a tower of blocks, pick the numeral (opts: min,max, mode:'onemore')
 *   add    — two towers, pick the total (opts: max)
 *   match  — tap a word tile, tap its picture tile (pairs: a=word, b=picture,
 *            j=jyutping, e=english gloss, sub=bridge hint shown under the word)
 */

const LINES = [
  {
    id: 'm',
    name: '數字線',
    en: 'Number Line',
    color: 'var(--blue)',
    colorKey: 'blue',
    stations: [
      { id: 'm1', name: '數到三', en: 'Count to 3',  icon: '3',  type: 'count', min: 1, max: 3 },
      { id: 'm2', name: '數到五', en: 'Count to 5',  icon: '5',  type: 'count', min: 2, max: 5 },
      { id: 'm3', name: '數到十', en: 'Count to 10', icon: '10', type: 'count', min: 5, max: 10 },
      { id: 'm4', name: '數字配對', en: 'Match 1–5', icon: '＝', type: 'match', lang: 'num',
        pairs: [
          { a: '2', b: '🟦🟦', e: 'two' },
          { a: '3', b: '🟦🟦🟦', e: 'three' },
          { a: '5', b: '🟦🟦🟦🟦🟦', e: 'five' },
        ] },
      { id: 'm5', name: '數字配對二', en: 'Match 6–10', icon: '＝', type: 'match', lang: 'num',
        pairs: [
          { a: '6',  b: '🟨🟨🟨<br>🟨🟨🟨', e: 'six' },
          { a: '8',  b: '🟨🟨🟨🟨<br>🟨🟨🟨🟨', e: 'eight' },
          { a: '10', b: '🟨🟨🟨🟨🟨<br>🟨🟨🟨🟨🟨', e: 'ten' },
        ] },
      { id: 'm6', name: '多一個', en: 'One more', icon: '+1', type: 'count', min: 1, max: 9, mode: 'onemore' },
      { id: 'm7', name: '加加睇', en: 'Add to 5',  icon: '+',  type: 'add', max: 5 },
      { id: 'm8', name: '加到十', en: 'Add to 10', icon: '+',  type: 'add', max: 10 },
    ],
  },
  {
    id: 'c',
    name: '香港中文線',
    en: 'Chinese Line',
    color: 'var(--red)',
    colorKey: 'red',
    stations: [
      { id: 'c1', name: '早晨站', en: 'Good Morning', icon: '日', type: 'match', lang: 'zh',
        pairs: [
          { a: '日', b: '☀️', j: 'jat6',  e: 'sun' },
          { a: '月', b: '🌙', j: 'jyut6', e: 'moon' },
          { a: '人', b: '🚶', j: 'jan4',  e: 'person' },
        ] },
      { id: 'c2', name: '食飯站', en: 'Yum Yum', icon: '食', type: 'match', lang: 'zh',
        pairs: [
          { a: '食', b: '🍽️', j: 'sik6',  e: 'eat' },
          { a: '飯', b: '🍚', j: 'faan6', e: 'rice' },
          { a: '水', b: '💧', j: 'seoi2', e: 'water' },
          { a: '茶', b: '🍵', j: 'caa4',  e: 'tea' },
        ] },
      { id: 'c3', name: '大細站', en: 'Big & Small', icon: '大', type: 'match', lang: 'zh',
        pairs: [
          { a: '大', b: '🐘', j: 'daai6', e: 'big' },
          { a: '小', b: '🐁', j: 'siu2',  e: 'small' },
          { a: '手', b: '✋', j: 'sau2',  e: 'hand' },
          { a: '口', b: '👄', j: 'hau2',  e: 'mouth' },
        ] },
      { id: 'c4', name: '中環站', en: 'Central', icon: '中', type: 'match', lang: 'zh',
        pairs: [
          { a: '中環', b: '🏙️', j: 'zung1 waan4', e: 'Central' },
          { a: '山頂', b: '⛰️', j: 'saan1 deng2', e: 'The Peak' },
          { a: '迪士尼', b: '🏰', j: 'dik6 si6 nei4', e: 'Disneyland' },
        ] },
      { id: 'c5', name: '搭港鐵站', en: 'MTR Ride', icon: '鐵', type: 'match', lang: 'zh',
        pairs: [
          { a: '旺角', b: '🛍️', j: 'wong6 gok3',  e: 'Mong Kok' },
          { a: '沙田', b: '🐎', j: 'saa1 tin4',   e: 'Sha Tin' },
          { a: '東涌', b: '🚠', j: 'dung1 cung1', e: 'Tung Chung' },
        ] },
      { id: 'c6', name: '山頂站', en: 'The Peak', icon: '山', type: 'match', lang: 'zh',
        pairs: [
          { a: '山', b: '⛰️', j: 'saan1',  e: 'mountain' },
          { a: '上', b: '⬆️', j: 'soeng6', e: 'up' },
          { a: '下', b: '⬇️', j: 'haa6',   e: 'down' },
        ] },
      { id: 'c7', name: '天星站', en: 'Star Ferry', icon: '星', type: 'match', lang: 'zh',
        pairs: [
          { a: '天', b: '🌥️', j: 'tin1',  e: 'sky' },
          { a: '星', b: '⭐', j: 'sing1', e: 'star' },
          { a: '船', b: '⛴️', j: 'syun4', e: 'boat' },
        ] },
      { id: 'c8', name: '海洋站', en: 'Ocean Park', icon: '海', type: 'match', lang: 'zh',
        pairs: [
          { a: '海', b: '🌊', j: 'hoi2', e: 'sea' },
          { a: '魚', b: '🐠', j: 'jyu2', e: 'fish' },
          { a: '花', b: '🌸', j: 'faa1', e: 'flower' },
          { a: '樹', b: '🌳', j: 'syu6', e: 'tree' },
        ] },
    ],
  },
  {
    id: 'e',
    name: 'English Line',
    en: 'phonics · words',
    color: 'var(--green)',
    colorKey: 'green',
    stations: [
      { id: 'e1', name: 's · a · t', en: 'Letter sounds', icon: 's', type: 'match', lang: 'en',
        pairs: [
          { a: 's', b: '🐍', e: 'snake' },
          { a: 'a', b: '🍎', e: 'apple' },
          { a: 't', b: '🐯', e: 'tiger' },
        ] },
      { id: 'e2', name: 'p · i · n', en: 'Letter sounds', icon: 'p', type: 'match', lang: 'en',
        pairs: [
          { a: 'p', b: '🐷', e: 'pig' },
          { a: 'i', b: '🐛', e: 'insect' },
          { a: 'n', b: '👃', e: 'nose' },
        ] },
      { id: 'e3', name: 'First words', en: 'cat · sun · bus', icon: 'c', type: 'match', lang: 'en',
        pairs: [
          { a: 'cat', b: '🐱', e: 'cat' },
          { a: 'sun', b: '☀️', e: 'sun' },
          { a: 'bus', b: '🚌', e: 'bus' },
        ] },
      { id: 'e4', name: 'More words', en: 'dog · egg · hat', icon: 'd', type: 'match', lang: 'en',
        pairs: [
          { a: 'dog', b: '🐶', e: 'dog' },
          { a: 'egg', b: '🥚', e: 'egg' },
          { a: 'hat', b: '🎩', e: 'hat' },
        ] },
      { id: 'e5', name: 'Colours', en: 'red · blue · green', icon: '🎨', type: 'match', lang: 'en',
        pairs: [
          { a: 'red',    b: '🔴', e: 'red' },
          { a: 'blue',   b: '🔵', e: 'blue' },
          { a: 'green',  b: '🟢', e: 'green' },
          { a: 'yellow', b: '🟡', e: 'yellow' },
        ] },
      { id: 'e6', name: 'Animals', en: 'fish · bird · horse', icon: '🐟', type: 'match', lang: 'en',
        pairs: [
          { a: 'fish',  b: '🐟', e: 'fish' },
          { a: 'bird',  b: '🐦', e: 'bird' },
          { a: 'horse', b: '🐴', e: 'horse' },
        ] },
      { id: 'e7', name: 'HK Bridge 一', en: 'Two languages, one word', icon: '⛰️', type: 'match', lang: 'en',
        pairs: [
          { a: 'mountain', sub: '山', b: '⛰️', e: 'mountain' },
          { a: 'star',     sub: '星', b: '⭐', e: 'star' },
          { a: 'sea',      sub: '海', b: '🌊', e: 'sea' },
        ] },
      { id: 'e8', name: 'HK Bridge 二', en: 'Two languages, one word', icon: '⛴️', type: 'match', lang: 'en',
        pairs: [
          { a: 'water', sub: '水', b: '💧', e: 'water' },
          { a: 'boat',  sub: '船', b: '⛴️', e: 'boat' },
          { a: 'moon',  sub: '月', b: '🌙', e: 'moon' },
        ] },
    ],
  },
];

/* Encouragement lines rotate so praise doesn't wear out. */
const PRAISE = [
  { zh: '叻叻！',   en: 'You did it!' },
  { zh: '好叻呀！', en: 'Brilliant!' },
  { zh: '勁呀！',   en: 'Amazing!' },
  { zh: '做得好！', en: 'Well done!' },
];
const NUDGE = [
  { zh: '再試吓！', en: 'Try again!' },
  { zh: '差少少！', en: 'Almost!' },
];

const BLOCK_COLORS = ['#E24A3B', '#F58A2E', '#FFC53D', '#129D58', '#1B6FC0', '#7C5CD6', '#E85D8A', '#22B8C4', '#8B6F47', '#5A6B7D'];
