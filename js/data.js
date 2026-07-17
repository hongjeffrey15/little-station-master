/* 小站長 Little Station Master — curriculum data (content pack v2)
 *
 * Everything the game teaches lives here, so parents/teachers can tune
 * content without touching the engine. Three "MTR lines":
 *   m — 數字線 Number Line   (maths, Numberblocks S1–S3 progression)
 *   c — 香港中文線 Chinese Line (Trad. Chinese via HK life, themed clusters)
 *   e — English Line          (phonics, first words, bilingual bridge)
 *
 * Station types / engines:
 *   match    — tap a word tile, tap its picture tile (pairs: a=word, b=picture,
 *              j=jyutping, e=english gloss, sub=bridge hint under the word)
 *   listen   — hear the word, tap the right character (pool of pairs)
 *   talk     — pick the right conversational reply (dialogs)
 *   factory  — combine component blocks into a compound character (builds)
 *   memory   — pelmanism: flip cards to pair character ↔ picture (pairs)
 *   sentence — arrange word carriages into a sentence (sentences)
 *   count    — count a tower of blocks (min, max, mode:'onemore')
 *   add      — two towers, pick the total (max)
 *   peek     — subitising: tower flashes then hides (min, max)
 *   takeaway — blocks hop off, how many left (max, allowZero)
 *   bond     — part-part-whole: N = a + ? (max)
 *   double   — mirror the tower, what is the double (max = biggest addend)
 *   oddeven  — do the blocks pair up? odd or even (max)
 *   fivebit  — 6–10 as "five and a bit": how big is the bit (Numberblocks S3)
 *   maketen  — which number joins a to make 10
 *
 * `theme` groups stations under a header on the line map. Station ids are
 * permanent — progress is keyed on them, so never rename existing ids.
 */

const LINES = [
  {
    id: 'm',
    name: '數字線',
    en: 'Number Line',
    color: 'var(--blue)',
    colorKey: 'blue',
    stations: [
      /* —— 數吓數吓 counting (Numberblocks S1) —— */
      { id: 'm1', theme: '數吓數吓', name: '數到三', en: 'Count to 3',  icon: '3',  type: 'count', min: 1, max: 3 },
      { id: 'm2', theme: '數吓數吓', name: '數到五', en: 'Count to 5',  icon: '5',  type: 'count', min: 2, max: 5 },
      { id: 'm3', theme: '數吓數吓', name: '數到十', en: 'Count to 10', icon: '10', type: 'count', min: 5, max: 10 },
      { id: 'm9', theme: '數吓數吓', name: '瞬間睇', en: 'Quick Peek',  icon: '👀', type: 'peek', min: 2, max: 6 },

      /* —— 認數 numerals (S1) —— */
      { id: 'm4', theme: '認數', name: '數字配對', en: 'Match 1–5', icon: '＝', type: 'match', lang: 'num',
        pairs: [
          { a: '2', b: '🟦🟦', e: 'two' },
          { a: '3', b: '🟦🟦🟦', e: 'three' },
          { a: '5', b: '🟦🟦🟦🟦🟦', e: 'five' },
        ] },
      { id: 'm5', theme: '認數', name: '數字配對二', en: 'Match 6–10', icon: '＝', type: 'match', lang: 'num',
        pairs: [
          { a: '6',  b: '🟨🟨🟨<br>🟨🟨🟨', e: 'six' },
          { a: '8',  b: '🟨🟨🟨🟨<br>🟨🟨🟨🟨', e: 'eight' },
          { a: '10', b: '🟨🟨🟨🟨🟨<br>🟨🟨🟨🟨🟨', e: 'ten' },
        ] },
      { id: 'm6', theme: '認數', name: '多一個', en: 'One more', icon: '+1', type: 'count', min: 1, max: 9, mode: 'onemore' },

      /* —— 加加減減 add & take away (S1–S2) —— */
      { id: 'm7',  theme: '加加減減', name: '加加睇', en: 'Add to 5',   icon: '+', type: 'add', max: 5 },
      { id: 'm10', theme: '加加減減', name: '減減睇', en: 'Hop off',    icon: '−', type: 'takeaway', max: 5 },
      { id: 'm11', theme: '加加減減', name: '拆數橋', en: 'Bond Bridge', icon: '⌒', type: 'bond', max: 5 },
      { id: 'm8',  theme: '加加減減', name: '加到十', en: 'Add to 10',  icon: '+', type: 'add', max: 10 },
      { id: 'm13', theme: '加加減減', name: '零之站', en: 'Zero Hero',  icon: '0', type: 'takeaway', max: 4, allowZero: true },

      /* —— 大數字戲法 number tricks (S2–S3) —— */
      { id: 'm12', theme: '大數字戲法', name: '孖孖站', en: 'Twins (doubles)', icon: '×2', type: 'double', max: 5 },
      { id: 'm14', theme: '大數字戲法', name: '單雙站', en: 'Odd or even',     icon: '⁝',  type: 'oddeven', max: 10 },
      { id: 'm15', theme: '大數字戲法', name: '五加幾', en: 'Five and a bit',  icon: '5+', type: 'fivebit' },
      { id: 'm16', theme: '大數字戲法', name: '合十朋友', en: 'Make ten',      icon: '10', type: 'maketen' },

      /* —— 十以上 beyond ten (Numberblocks S3–S4) —— */
      { id: 'm17', theme: '十以上', name: '十加幾', en: 'Teens: ten and a bit', icon: '13', type: 'teens' },
      { id: 'm18', theme: '十以上', name: '十十車廂', en: 'Count in tens',       icon: '30', type: 'tens' },
      { id: 'm19', theme: '十以上', name: '跳數列車', en: 'Skip counting',       icon: '2·4', type: 'skip' },
    ],
  },
  {
    id: 'c',
    name: '香港中文線',
    en: 'Chinese Line',
    color: 'var(--red)',
    colorKey: 'red',
    stations: [
      /* —— 我的一天 daily life —— */
      { id: 'c1', theme: '我的一天', name: '早晨站', en: 'Good Morning', icon: '日', type: 'match', lang: 'zh',
        pairs: [
          { a: '日', b: 'img:sun', j: 'jat6',  e: 'sun' },
          { a: '月', b: 'img:moon', j: 'jyut6', e: 'moon' },
          { a: '人', b: '🚶', j: 'jan4',  e: 'person' },
        ] },
      { id: 'c2', theme: '我的一天', name: '食飯站', en: 'Yum Yum', icon: '食', type: 'match', lang: 'zh',
        pairs: [
          { a: '食', b: 'img:eat', j: 'sik6',  e: 'eat' },
          { a: '飯', b: 'img:rice', j: 'faan6', e: 'rice' },
          { a: '水', b: 'img:water', j: 'seoi2', e: 'water' },
          { a: '茶', b: 'img:tea', j: 'caa4',  e: 'tea' },
        ] },
      { id: 'c3', theme: '我的一天', name: '大細站', en: 'Big & Small', icon: '大', type: 'match', lang: 'zh',
        pairs: [
          { a: '大', b: '🐘', j: 'daai6', e: 'big' },
          { a: '小', b: '🐁', j: 'siu2',  e: 'small' },
          { a: '手', b: '✋', j: 'sau2',  e: 'hand' },
          { a: '口', b: 'img:mouth', j: 'hau2',  e: 'mouth' },
        ] },

      /* —— 搭港鐵 MTR ——
       * Place names are proper nouns — a picture can't "mean" 沙田 to a
       * five-year-old, so these stations use the listen engine instead:
       * hear the announcement, sight-read the name. The landmark trivia
       * lives in `fact`, shown as a fun toast AFTER a correct answer. */
      { id: 'c4', theme: '搭港鐵', name: '中環站', en: 'Central', icon: '中', type: 'listen', lang: 'zh',
        prompt: '🚇 港鐵廣播：「下一站係⋯」<br>“Next station is…” — tap its name!',
        pool: [
          { a: '中環',   j: 'zung1 waan4',   e: 'Central',    fact: '中環好多高樓大廈！🏙️' },
          { a: '山頂',   j: 'saan1 deng2',   e: 'The Peak',   fact: '山頂要搭纜車上去！🚡' },
          { a: '迪士尼', j: 'dik6 si6 nei4', e: 'Disneyland', fact: '迪士尼有座城堡！🏰' },
        ] },
      { id: 'c5', theme: '搭港鐵', name: '搭港鐵站', en: 'MTR Ride', icon: '鐵', type: 'listen', lang: 'zh',
        prompt: '🚇 港鐵廣播：「下一站係⋯」<br>“Next station is…” — tap its name!',
        pool: [
          { a: '旺角', j: 'wong6 gok3',  e: 'Mong Kok',   fact: '旺角好多嘢買、好多嘢食！🛍️' },
          { a: '沙田', j: 'saa1 tin4',   e: 'Sha Tin',    fact: '沙田有個好大嘅公園！🌳' },
          { a: '東涌', j: 'dung1 cung1', e: 'Tung Chung', fact: '東涌可以搭纜車去睇大佛！🚠' },
          { a: '香港', j: 'hoeng1 gong2', e: 'Hong Kong', fact: '香港係我哋嘅家！🏠' },
        ] },

      /* —— 遊香港 sightseeing —— */
      { id: 'c6', theme: '遊香港', name: '山頂站', en: 'The Peak', icon: '山', type: 'match', lang: 'zh',
        pairs: [
          { a: '山', b: 'img:mountain', j: 'saan1',  e: 'mountain' },
          { a: '上', b: 'img:up', j: 'soeng6', e: 'up' },
          { a: '下', b: 'img:down', j: 'haa6',   e: 'down' },
        ] },
      { id: 'c7', theme: '遊香港', name: '天星站', en: 'Star Ferry', icon: '星', type: 'match', lang: 'zh',
        pairs: [
          { a: '天', b: '🌤️', j: 'tin1',  e: 'sky' },
          { a: '星', b: 'img:star', j: 'sing1', e: 'star' },
          { a: '船', b: 'img:boat', j: 'syun4', e: 'boat' },
        ] },
      { id: 'c8', theme: '遊香港', name: '海洋站', en: 'Ocean Park', icon: '海', type: 'match', lang: 'zh',
        pairs: [
          { a: '海', b: '🌊', j: 'hoi2', e: 'sea' },
          { a: '魚', b: 'img:fish', j: 'jyu2', e: 'fish' },
          { a: '花', b: 'img:flower', j: 'faa1', e: 'flower' },
          { a: '樹', b: 'img:tree', j: 'syu6', e: 'tree' },
        ] },

      /* —— 屋企 family —— */
      { id: 'c9', theme: '屋企', name: '屋企站', en: 'My Family', icon: '家', type: 'match', lang: 'zh',
        pairs: [
          { a: '爸爸', b: '👨', j: 'baa4 baa1',  e: 'daddy' },
          { a: '媽媽', b: '👩', j: 'maa4 maa1',  e: 'mummy' },
          { a: '爺爺', b: '👴', j: 'je4 je2',    e: 'grandpa' },
          { a: '嫲嫲', b: '👵', j: 'maa4 maa4',  e: 'grandma' },
          { a: '哥哥', b: '👦', j: 'go4 go1',    e: 'big brother' },
          { a: '姐姐', b: '👧', j: 'ze4 ze1',    e: 'big sister' },
        ] },
      { id: 'c10', theme: '屋企', name: '屋企・聽字', en: 'Family — listen', icon: '👂', type: 'listen', lang: 'zh',
        pool: [
          { a: '爸爸', j: 'baa4 baa1', e: 'daddy' },
          { a: '媽媽', j: 'maa4 maa1', e: 'mummy' },
          { a: '爺爺', j: 'je4 je2',   e: 'grandpa' },
          { a: '嫲嫲', j: 'maa4 maa4', e: 'grandma' },
          { a: '哥哥', j: 'go4 go1',   e: 'big brother' },
          { a: '姐姐', j: 'ze4 ze1',   e: 'big sister' },
          { a: '妹妹', j: 'mui4 mui2', e: 'little sister' },
          { a: '我',   j: 'ngo5',      e: 'me' },
        ] },
      { id: 'c11', theme: '屋企', name: '屋企・傾偈', en: 'Family — talk', icon: '💬', type: 'talk', lang: 'zh',
        dialogs: [
          { icon: '👩', say: '早晨！', e: 'Good morning!',
            opts: [ { t: '早晨呀，媽媽！', ok: true }, { t: '拜拜！', ok: false } ] },
          { icon: '👨', say: '呢粒糖畀你。', e: 'This sweet is for you.',
            opts: [ { t: '多謝爸爸！', ok: true }, { t: '唔使客氣。', ok: false } ] },
          { icon: '👧', say: '多謝你呀！', e: 'Thank you!',
            opts: [ { t: '唔使客氣！', ok: true }, { t: '早晨！', ok: false } ] },
        ] },

      /* —— 飲茶 dim sum —— */
      { id: 'c12', theme: '飲茶', name: '茶樓站', en: 'Dim Sum', icon: '點', type: 'match', lang: 'zh',
        pairs: [
          { a: '蝦餃', b: 'img:hargow', j: 'haa1 gaau2',  e: 'shrimp dumpling' },
          { a: '燒賣', b: 'img:siumai', j: 'siu1 maai2',  e: 'siu mai' },
          { a: '蛋撻', b: 'img:eggtart', j: 'daan6 taat1', e: 'egg tart' },
          { a: '奶茶', b: 'img:milktea', j: 'naai5 caa4',  e: 'milk tea' },
          { a: '麵',   b: 'img:noodles', j: 'min6',        e: 'noodles' },
          { a: '粥',   b: 'img:congee', j: 'zuk1',        e: 'congee' },
        ] },
      { id: 'c13', theme: '飲茶', name: '茶樓・聽字', en: 'Dim sum — listen', icon: '👂', type: 'listen', lang: 'zh',
        pool: [
          { a: '蝦餃', j: 'haa1 gaau2',  e: 'shrimp dumpling' },
          { a: '燒賣', j: 'siu1 maai2',  e: 'siu mai' },
          { a: '蛋撻', j: 'daan6 taat1', e: 'egg tart' },
          { a: '奶茶', j: 'naai5 caa4',  e: 'milk tea' },
          { a: '麵',   j: 'min6',        e: 'noodles' },
          { a: '飲',   j: 'jam2',        e: 'drink' },
          { a: '食',   j: 'sik6',        e: 'eat' },
        ] },
      { id: 'c14', theme: '飲茶', name: '茶樓・傾偈', en: 'Dim sum — talk', icon: '💬', type: 'talk', lang: 'zh',
        dialogs: [
          { icon: '🧑‍🍳', say: '你想食咩呀？', e: 'What would you like to eat?',
            opts: [ { t: '我想食蝦餃，唔該。', ok: true }, { t: '我唔知呀。', ok: false } ] },
          { icon: '👩', say: '飲唔飲茶呀？', e: 'Would you like some tea?',
            opts: [ { t: '飲，唔該！', ok: true }, { t: '早晨！', ok: false } ] },
          { icon: '🧑‍🍳', say: '蛋撻嚟喇！', e: 'Here comes the egg tart!',
            opts: [ { t: '多謝！', ok: true }, { t: '拜拜！', ok: false } ] },
        ] },

      /* —— 顏色 colours —— */
      { id: 'c15', theme: '顏色', name: '顏色站', en: 'Colours', icon: '紅', type: 'match', lang: 'zh',
        pairs: [
          { a: '紅', b: '🔴', j: 'hung4', e: 'red' },
          { a: '黃', b: '🟡', j: 'wong4', e: 'yellow' },
          { a: '藍', b: '🔵', j: 'laam4', e: 'blue' },
          { a: '綠', b: '🟢', j: 'luk6',  e: 'green' },
          { a: '黑', b: '⚫', j: 'hak1',  e: 'black' },
          { a: '白', b: '⚪', j: 'baak6', e: 'white' },
        ] },
      { id: 'c16', theme: '顏色', name: '顏色・翻卡', en: 'Colours — memory', icon: '🎴', type: 'memory', lang: 'zh',
        pairs: [
          { a: '紅', b: '🔴', j: 'hung4', e: 'red' },
          { a: '黃', b: '🟡', j: 'wong4', e: 'yellow' },
          { a: '藍', b: '🔵', j: 'laam4', e: 'blue' },
          { a: '綠', b: '🟢', j: 'luk6',  e: 'green' },
        ] },

      /* —— 數字 numbers (bridge with Number Line) —— */
      { id: 'c17', theme: '數字', name: '數字站', en: 'Numbers in Chinese', icon: '三', type: 'match', lang: 'zh',
        pairs: [
          { a: '一', b: '🟥', j: 'jat1',  e: 'one' },
          { a: '二', b: '🟧🟧', j: 'ji6', e: 'two' },
          { a: '三', b: '🟨🟨🟨', j: 'saam1', e: 'three' },
          { a: '四', b: '🟩🟩<br>🟩🟩', j: 'sei3', e: 'four' },
          { a: '五', b: '🟦🟦🟦<br>🟦🟦', j: 'ng5', e: 'five' },
        ] },
      { id: 'c18', theme: '數字', name: '數字・聽字', en: 'Numbers — listen', icon: '👂', type: 'listen', lang: 'zh',
        pool: [
          { a: '一', j: 'jat1', e: 'one' },   { a: '二', j: 'ji6', e: 'two' },
          { a: '三', j: 'saam1', e: 'three' },{ a: '四', j: 'sei3', e: 'four' },
          { a: '五', j: 'ng5', e: 'five' },   { a: '六', j: 'luk6', e: 'six' },
          { a: '七', j: 'cat1', e: 'seven' }, { a: '八', j: 'baat3', e: 'eight' },
          { a: '九', j: 'gau2', e: 'nine' },  { a: '十', j: 'sap6', e: 'ten' },
        ] },

      /* —— 身體 body —— */
      { id: 'c19', theme: '身體', name: '身體站', en: 'My Body', icon: '手', type: 'match', lang: 'zh',
        pairs: [
          { a: '頭', b: 'img:head', j: 'tau4',  e: 'head' },
          { a: '眼', b: 'img:eye', j: 'ngaan5', e: 'eye' },
          { a: '耳', b: 'img:ear', j: 'ji5',   e: 'ear' },
          { a: '口', b: 'img:mouth', j: 'hau2',  e: 'mouth' },
          { a: '手', b: '✋', j: 'sau2',  e: 'hand' },
          { a: '腳', b: 'img:foot', j: 'goek3', e: 'foot' },
        ] },
      { id: 'c20', theme: '身體', name: '身體・翻卡', en: 'Body — memory', icon: '🎴', type: 'memory', lang: 'zh',
        pairs: [
          { a: '眼', b: 'img:eye', j: 'ngaan5', e: 'eye' },
          { a: '耳', b: 'img:ear', j: 'ji5',   e: 'ear' },
          { a: '手', b: '✋', j: 'sau2',  e: 'hand' },
          { a: '腳', b: 'img:foot', j: 'goek3', e: 'foot' },
        ] },

      /* —— 砌字工場 character factory (compositional awareness) —— */
      { id: 'c21', theme: '砌字工場', name: '砌字工場一', en: 'Character Factory 1', icon: '🏗️', type: 'factory', lang: 'zh',
        builds: [
          { parts: ['日', '月'], result: '明', j: 'ming4', e: 'bright', pic: '✨' },
          { parts: ['木', '木'], result: '林', j: 'lam4',  e: 'woods',  pic: '🌲🌲' },
          { parts: ['火', '火'], result: '炎', j: 'jim4',  e: 'blazing', pic: '🔥' },
        ] },
      { id: 'c22', theme: '砌字工場', name: '砌字工場二', en: 'Character Factory 2', icon: '🏗️', type: 'factory', lang: 'zh',
        builds: [
          { parts: ['女', '子'], result: '好', j: 'hou2', e: 'good', pic: '👍' },
          { parts: ['人', '木'], result: '休', j: 'jau1', e: 'rest', pic: '😴' },
          { parts: ['木', '木', '木'], result: '森', j: 'sam1', e: 'forest', pic: '🌳🌳🌳' },
        ] },

      /* —— 講句子 sentences —— */
      { id: 'c23', theme: '講句子', name: '句子火車一', en: 'Sentence Train 1', icon: '🚂', type: 'sentence', lang: 'zh',
        sentences: [
          { words: ['我', '食', '飯'],   pic: '🐼🍚', e: 'I eat rice.' },
          { words: ['我', '飲', '水'],   pic: '🐼💧', e: 'I drink water.' },
          { words: ['我', '食', '蛋撻'], pic: '🐼🥧', e: 'I eat an egg tart.' },
        ] },
      { id: 'c24', theme: '講句子', name: '句子火車二', en: 'Sentence Train 2', icon: '🚂', type: 'sentence', lang: 'zh',
        sentences: [
          { words: ['我', '去', '山頂'],   pic: '🐼⛰️', e: 'I go to the Peak.' },
          { words: ['爸爸', '飲', '茶'],   pic: '👨🍵', e: 'Daddy drinks tea.' },
          { words: ['媽媽', '食', '麵'], pic: '👩🍜', e: 'Mummy eats noodles.' },
        ] },
      { id: 'c33', theme: '講句子', name: '句子火車三', en: 'Sentence Train 3', icon: '🚂', type: 'sentence', lang: 'zh',
        sentences: [
          { words: ['我', '飲', '奶茶'],   pic: '🐼🧋', e: 'I drink milk tea.' },
          { words: ['爺爺', '食', '月餅'], pic: '👴🥮', e: 'Grandpa eats a mooncake.' },
          { words: ['我', '搭', '巴士'],   pic: '🐼🚌', e: 'I take the bus.' },
        ] },

      /* —— 天氣 weather —— */
      { id: 'c25', theme: '天氣', name: '天氣站', en: 'Weather', icon: '雨', type: 'match', lang: 'zh',
        pairs: [
          { a: '太陽', b: 'img:sun', j: 'taai3 joeng4', e: 'sun' },
          { a: '雨',   b: 'img:rain', j: 'jyu5',  e: 'rain' },
          { a: '風',   b: '💨', j: 'fung1', e: 'wind' },
          { a: '熱',   b: '🥵', j: 'jit6',  e: 'hot' },
          { a: '凍',   b: '🥶', j: 'dung3', e: 'cold' },
        ] },
      { id: 'c26', theme: '天氣', name: '天氣・傾偈', en: 'Weather — talk', icon: '💬', type: 'talk', lang: 'zh',
        dialogs: [
          { icon: '👩', say: '今日落雨呀，要帶咩呀？', e: 'It is raining — what should we bring?',
            opts: [ { t: '帶遮！☂️', ok: true }, { t: '帶雪糕！🍦', ok: false } ] },
          { icon: '👨', say: '今日好熱呀！', e: 'It is so hot today!',
            opts: [ { t: '飲多啲水啦！', ok: true }, { t: '着多件衫啦！', ok: false } ] },
          { icon: '👧', say: '今日好凍呀！', e: 'It is so cold today!',
            opts: [ { t: '着多件衫啦！', ok: true }, { t: '食雪糕啦！', ok: false } ] },
        ] },

      /* —— 街市 market —— */
      { id: 'c27', theme: '街市', name: '街市站', en: 'Wet Market', icon: '菜', type: 'match', lang: 'zh',
        pairs: [
          { a: '菜',   b: 'img:vegetables', j: 'coi3',  e: 'vegetables' },
          { a: '魚',   b: 'img:fish', j: 'jyu2',  e: 'fish' },
          { a: '蛋',   b: 'img:egg', j: 'daan2', e: 'egg' },
          { a: '蘋果', b: 'img:apple', j: 'ping4 gwo2', e: 'apple' },
          { a: '橙',   b: 'img:orange', j: 'caang2', e: 'orange' },
        ] },
      { id: 'c28', theme: '街市', name: '街市・翻卡', en: 'Market — memory', icon: '🎴', type: 'memory', lang: 'zh',
        pairs: [
          { a: '菜',   b: 'img:vegetables', j: 'coi3',  e: 'vegetables' },
          { a: '蛋',   b: 'img:egg', j: 'daan2', e: 'egg' },
          { a: '蘋果', b: 'img:apple', j: 'ping4 gwo2', e: 'apple' },
          { a: '橙',   b: 'img:orange', j: 'caang2', e: 'orange' },
        ] },

      /* —— 出街 transport —— */
      { id: 'c29', theme: '出街', name: '交通站', en: 'Transport', icon: '車', type: 'match', lang: 'zh',
        pairs: [
          { a: '巴士', b: 'img:bus2', j: 'baa1 si2',  e: 'bus' },
          { a: '的士', b: 'img:taxi', j: 'dik1 si2',  e: 'taxi' },
          { a: '電車', b: 'img:tram', j: 'din6 ce1',  e: 'tram (ding ding)' },
          { a: '船',   b: 'img:ferry', j: 'syun4',     e: 'boat' },
          { a: '飛機', b: 'img:plane', j: 'fei1 gei1', e: 'plane' },
        ] },
      { id: 'c30', theme: '出街', name: '交通・聽字', en: 'Transport — listen', icon: '👂', type: 'listen', lang: 'zh',
        pool: [
          { a: '巴士', j: 'baa1 si2',  e: 'bus' },
          { a: '的士', j: 'dik1 si2',  e: 'taxi' },
          { a: '電車', j: 'din6 ce1',  e: 'tram' },
          { a: '船',   j: 'syun4',     e: 'boat' },
          { a: '飛機', j: 'fei1 gei1', e: 'plane' },
        ] },

      /* —— 節日 festivals —— */
      { id: 'c31', theme: '節日', name: '節日站', en: 'Festivals', icon: '🧧', type: 'match', lang: 'zh',
        pairs: [
          { a: '新年', b: 'img:fireworks', j: 'san1 nin4',    e: 'New Year' },
          { a: '利是', b: 'img:laisee', j: 'lai6 si6',     e: 'red packet' },
          { a: '月餅', b: 'img:mooncake', j: 'jyut6 beng2',  e: 'mooncake' },
          { a: '燈籠', b: 'img:lantern', j: 'dang1 lung4',  e: 'lantern' },
        ] },
      { id: 'c32', theme: '節日', name: '節日・傾偈', en: 'Festivals — talk', icon: '💬', type: 'talk', lang: 'zh',
        dialogs: [
          { icon: '👴', say: '恭喜發財！', e: 'Kung hei fat choi!',
            opts: [ { t: '利是逗嚟！🧧', ok: true }, { t: '晚安！', ok: false } ] },
          { icon: '👵', say: '中秋節快樂！', e: 'Happy Mid-Autumn Festival!',
            opts: [ { t: '一齊食月餅啦！', ok: true }, { t: '一齊食蛋撻啦！', ok: false } ] },
          { icon: '👨', say: '新年快樂！', e: 'Happy New Year!',
            opts: [ { t: '新年快樂！身體健康！', ok: true }, { t: '唔該晒！', ok: false } ] },
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
      /* —— 聽聲 Big Ears: oral blending, NO letters yet (synthetic phonics
       *    Phase 1). Child hears sounds "c-a-t" and taps the picture. Words
       *    here aren't restricted to taught letters — it's pure ear training.
       *    `sounds` are audio-clip phonemes; `w` plays the whole word. —— */
      { id: 'e1', theme: '聽聲 Big Ears', name: 'Sound Hunt 1', en: 'Blend by ear', icon: '👂', type: 'hearblend', lang: 'en',
        pool: [
          { w: 'cat', sounds: ['k', 'a', 't'], b: '🐱', e: 'cat' },
          { w: 'dog', sounds: ['d', 'o', 'g'], b: 'img:dog', e: 'dog' },
          { w: 'sun', sounds: ['s', 'u', 'n'], b: 'img:sun', e: 'sun' },
          { w: 'pig', sounds: ['p', 'i', 'g'], b: 'img:pig', e: 'pig' },
        ] },
      { id: 'e2', theme: '聽聲 Big Ears', name: 'Sound Hunt 2', en: 'Blend by ear', icon: '👂', type: 'hearblend', lang: 'en',
        pool: [
          { w: 'bus', sounds: ['b', 'u', 's'], b: 'img:bus2', e: 'bus' },
          { w: 'hat', sounds: ['h', 'a', 't'], b: 'img:hat', e: 'hat' },
          { w: 'pin', sounds: ['p', 'i', 'n'], b: '📌', e: 'pin' },
          { w: 'bed', sounds: ['b', 'e', 'd'], b: '🛏️', e: 'bed' },
        ] },

      /* —— Letter sounds: learn the PURE sound (/s/ not "ess") + a keyword,
       *    then a quick check "which one says /s/?". One round per letter. —— */
      { id: 'e3', theme: 'Sounds 一', name: 'Sounds s a t p', en: 'Pure letter sounds', icon: 's', type: 'lettersound', lang: 'en',
        letters: [
          { g: 's', snd: 's', b: 'img:snake', kw: 'snake' },
          { g: 'a', snd: 'a', b: 'img:apple', kw: 'apple' },
          { g: 't', snd: 't', b: 'img:tiger', kw: 'tiger' },
          { g: 'p', snd: 'p', b: 'img:pig',   kw: 'pig' },
        ] },
      { id: 'e4', theme: 'Sounds 二', name: 'Sounds i n m d', en: 'Pure letter sounds', icon: 'n', type: 'lettersound', lang: 'en',
        letters: [
          { g: 'i', snd: 'i', b: '🐜', kw: 'insect' },
          { g: 'n', snd: 'n', b: '👃', kw: 'nose' },
          { g: 'm', snd: 'm', b: '🐭', kw: 'mouse' },
          { g: 'd', snd: 'd', b: 'img:dog', kw: 'dog' },
        ] },

      /* —— Blend to Read: THE decoding engine. See the letters, tap each for
       *    its sound, press "Blend it!" to hear them run together, pick the
       *    picture. Words use only the 8 taught sounds (s a t p i n m d). —— */
      { id: 'e5', theme: 'Blend it! 拼音', name: 'Blend to Read 1', en: 'Sound out the word', icon: '🔤', type: 'blend', lang: 'en',
        words: [
          { w: 'pin', letters: ['p', 'i', 'n'], b: '📌', e: 'pin' },
          { w: 'tin', letters: ['t', 'i', 'n'], b: '🥫', e: 'tin' },
          { w: 'nap', letters: ['n', 'a', 'p'], b: '😴', e: 'nap' },
        ] },
      { id: 'e6', theme: 'Blend it! 拼音', name: 'Blend to Read 2', en: 'Sound out the word', icon: '🔤', type: 'blend', lang: 'en',
        words: [
          { w: 'man', letters: ['m', 'a', 'n'], b: '🧍', e: 'man' },
          { w: 'dad', letters: ['d', 'a', 'd'], b: '👨', e: 'dad' },
          { w: 'tap', letters: ['t', 'a', 'p'], b: '🚰', e: 'tap' },
        ] },

      { id: 'e7', theme: 'HK Bridge', name: 'HK Bridge 一', en: 'Two languages, one word', icon: '⛰️', type: 'match', lang: 'en',
        pairs: [
          { a: 'mountain', sub: '山', b: 'img:mountain', e: 'mountain' },
          { a: 'star',     sub: '星', b: 'img:star', e: 'star' },
          { a: 'sea',      sub: '海', b: '🌊', e: 'sea' },
        ] },
      { id: 'e8', theme: 'HK Bridge', name: 'HK Bridge 二', en: 'Two languages, one word', icon: '⛴️', type: 'match', lang: 'en',
        pairs: [
          { a: 'water', sub: '水', b: 'img:water', e: 'water' },
          { a: 'boat',  sub: '船', b: 'img:boat', e: 'boat' },
          { a: 'moon',  sub: '月', b: 'img:moon', e: 'moon' },
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
