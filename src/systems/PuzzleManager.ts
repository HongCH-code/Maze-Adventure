import { Puzzle, PuzzleType, DifficultyTier } from "../types";

type PuzzleGenerator = (difficulty: DifficultyTier) => Puzzle;

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** Fisher-Yates shuffle (returns new array) */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick one random element */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick n distinct elements from arr (n <= arr.length) */
function pickNDistinct<T>(arr: T[], n: number): T[] {
  return shuffleArray(arr).slice(0, n);
}

// ---------------------------------------------------------------------------
// Clock data — all 24 half-hour times & corresponding emoji
// ---------------------------------------------------------------------------

interface ClockTime {
  hour: number;   // 1-12
  minute: 0 | 30;
  label: string;  // "3:00" or "7:30"
  emoji: string;  // 🕐 – 🕧
}

const CLOCK_EMOJIS: Record<string, string> = {
  "1:00": "🕐", "1:30": "🕜",
  "2:00": "🕑", "2:30": "🕝",
  "3:00": "🕒", "3:30": "🕞",
  "4:00": "🕓", "4:30": "🕟",
  "5:00": "🕔", "5:30": "🕠",
  "6:00": "🕕", "6:30": "🕡",
  "7:00": "🕖", "7:30": "🕢",
  "8:00": "🕗", "8:30": "🕣",
  "9:00": "🕘", "9:30": "🕤",
  "10:00": "🕙", "10:30": "🕥",
  "11:00": "🕚", "11:30": "🕦",
  "12:00": "🕛", "12:30": "🕧",
};

const CLOCK_TIMES: ClockTime[] = (() => {
  const times: ClockTime[] = [];
  for (let h = 1; h <= 12; h++) {
    for (const m of [0, 30] as const) {
      const label = `${h}:${m === 0 ? "00" : "30"}`;
      times.push({ hour: h, minute: m, label, emoji: CLOCK_EMOJIS[label] });
    }
  }
  return times;
})();

// ---------------------------------------------------------------------------
// Zhuyin vocabulary (~30 first-grade words)
// ---------------------------------------------------------------------------

interface ZhuyinWord {
  zhuyin: string;
  character: string;
}

const ZHUYIN_VOCAB: ZhuyinWord[] = [
  { zhuyin: "ㄒㄩㄝˊ ㄒㄧㄠˋ", character: "學校" },
  { zhuyin: "ㄌㄠˇ ㄕ", character: "老師" },
  { zhuyin: "ㄊㄨㄥˊ ㄒㄩㄝˊ", character: "同學" },
  { zhuyin: "ㄆㄥˊ ㄧㄡˇ", character: "朋友" },
  { zhuyin: "ㄎㄞ ㄒㄧㄣ", character: "開心" },
  { zhuyin: "ㄎㄨㄞˋ ㄌㄜˋ", character: "快樂" },
  { zhuyin: "ㄇㄟˇ ㄌㄧˋ", character: "美麗" },
  { zhuyin: "ㄊㄞˋ ㄧㄤˊ", character: "太陽" },
  { zhuyin: "ㄩㄝˋ ㄌㄧㄤˋ", character: "月亮" },
  { zhuyin: "ㄒㄧㄥ ㄒㄧㄥ", character: "星星" },
  { zhuyin: "ㄏㄨㄚ ㄉㄨㄛˇ", character: "花朵" },
  { zhuyin: "ㄕㄨˋ ㄇㄨˋ", character: "樹木" },
  { zhuyin: "ㄒㄧㄠˇ ㄋㄧㄠˇ", character: "小鳥" },
  { zhuyin: "ㄇㄠ ㄇㄧ", character: "貓咪" },
  { zhuyin: "ㄒㄧㄠˇ ㄍㄡˇ", character: "小狗" },
  { zhuyin: "ㄐㄧㄚ ㄖㄣˊ", character: "家人" },
  { zhuyin: "ㄅㄚˋ ㄅㄚ˙", character: "爸爸" },
  { zhuyin: "ㄇㄚ ㄇㄚ˙", character: "媽媽" },
  { zhuyin: "ㄍㄜ ㄍㄜ˙", character: "哥哥" },
  { zhuyin: "ㄐㄧㄝˇ ㄐㄧㄝ˙", character: "姐姐" },
  { zhuyin: "ㄉㄧˋ ㄉㄧ˙", character: "弟弟" },
  { zhuyin: "ㄇㄟˋ ㄇㄟ˙", character: "妹妹" },
  { zhuyin: "ㄔ ㄈㄢˋ", character: "吃飯" },
  { zhuyin: "ㄏㄜ ㄕㄨㄟˇ", character: "喝水" },
  { zhuyin: "ㄎㄢˋ ㄕㄨ", character: "看書" },
  { zhuyin: "ㄒㄧㄝˇ ㄗˋ", character: "寫字" },
  { zhuyin: "ㄏㄨㄚˋ ㄏㄨㄚˋ", character: "畫畫" },
  { zhuyin: "ㄔㄤˋ ㄍㄜ", character: "唱歌" },
  { zhuyin: "ㄆㄠˇ ㄅㄨˋ", character: "跑步" },
  { zhuyin: "ㄧㄡˊ ㄩㄥˇ", character: "游泳" },
];

// ---------------------------------------------------------------------------
// Image vocabulary (~15 emoji + name + zhuyin)
// ---------------------------------------------------------------------------

interface ImageWord {
  emoji: string;
  name: string;
  zhuyin: string;
}

const IMAGE_VOCAB: ImageWord[] = [
  { emoji: "🍎", name: "蘋果", zhuyin: "ㄆㄧㄥˊ ㄍㄨㄛˇ" },
  { emoji: "🍌", name: "香蕉", zhuyin: "ㄒㄧㄤ ㄐㄧㄠ" },
  { emoji: "🍇", name: "葡萄", zhuyin: "ㄆㄨˊ ㄊㄠˊ" },
  { emoji: "🍊", name: "橘子", zhuyin: "ㄐㄩˊ ㄗˇ" },
  { emoji: "🍉", name: "西瓜", zhuyin: "ㄒㄧ ㄍㄨㄚ" },
  { emoji: "🐟", name: "魚", zhuyin: "ㄩˊ" },
  { emoji: "🐦", name: "小鳥", zhuyin: "ㄒㄧㄠˇ ㄋㄧㄠˇ" },
  { emoji: "🐱", name: "貓咪", zhuyin: "ㄇㄠ ㄇㄧ" },
  { emoji: "🐶", name: "小狗", zhuyin: "ㄒㄧㄠˇ ㄍㄡˇ" },
  { emoji: "🌸", name: "花", zhuyin: "ㄏㄨㄚ" },
  { emoji: "🌳", name: "樹", zhuyin: "ㄕㄨˋ" },
  { emoji: "☀️", name: "太陽", zhuyin: "ㄊㄞˋ ㄧㄤˊ" },
  { emoji: "🌙", name: "月亮", zhuyin: "ㄩㄝˋ ㄌㄧㄤˋ" },
  { emoji: "⭐", name: "星星", zhuyin: "ㄒㄧㄥ ㄒㄧㄥ" },
  { emoji: "🌧️", name: "下雨", zhuyin: "ㄒㄧㄚˋ ㄩˇ" },
];

// ---------------------------------------------------------------------------
// Ocean creatures (~15 entries)
// ---------------------------------------------------------------------------

interface OceanCreature {
  emoji: string;
  name: string;
}

const OCEAN_CREATURES: OceanCreature[] = [
  { emoji: "🐟", name: "魚" },
  { emoji: "🐠", name: "熱帶魚" },
  { emoji: "🐡", name: "河豚" },
  { emoji: "🦈", name: "鯊魚" },
  { emoji: "🐬", name: "海豚" },
  { emoji: "🐳", name: "鯨魚" },
  { emoji: "🐙", name: "章魚" },
  { emoji: "🦑", name: "烏賊" },
  { emoji: "🦀", name: "螃蟹" },
  { emoji: "🦐", name: "蝦子" },
  { emoji: "🐚", name: "貝殼" },
  { emoji: "🪸", name: "珊瑚" },
  { emoji: "🐢", name: "海龜" },
  { emoji: "🦭", name: "海豹" },
  { emoji: "🐧", name: "企鵝" },
];

// ---------------------------------------------------------------------------
// Life-safety questions (12 scenarios)
// ---------------------------------------------------------------------------

interface SafetyQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: [string, string, string];
}

const SAFETY_QUESTIONS: SafetyQuestion[] = [
  {
    question: "過馬路要怎麼做？",
    correctAnswer: "走斑馬線，看紅綠燈",
    wrongAnswers: ["直接跑過去", "閉著眼睛走", "在馬路上玩"],
  },
  {
    question: "下雨天出門要注意什麼？",
    correctAnswer: "帶雨傘，走慢一點",
    wrongAnswers: ["在水坑裡跳", "不穿鞋出門", "淋雨跑步"],
  },
  {
    question: "地震的時候要怎麼做？",
    correctAnswer: "趴下、掩護、穩住",
    wrongAnswers: ["站在窗戶旁邊", "跑到陽台", "躲在書架旁"],
  },
  {
    question: "陌生人給你糖果，要怎麼做？",
    correctAnswer: "說不要，趕快離開",
    wrongAnswers: ["拿來吃", "跟他走", "幫他拿更多糖果"],
  },
  {
    question: "去游泳池要注意什麼？",
    correctAnswer: "要有大人陪，不能跑",
    wrongAnswers: ["自己一個人去", "在池邊跑步", "直接跳進深水區"],
  },
  {
    question: "發現火災要怎麼做？",
    correctAnswer: "大聲呼救，趕快逃出去",
    wrongAnswers: ["躲在衣櫃裡", "去找火玩", "自己去滅火"],
  },
  {
    question: "騎腳踏車要注意什麼？",
    correctAnswer: "戴安全帽，騎慢一點",
    wrongAnswers: ["騎很快比賽", "不用戴安全帽", "在大馬路上騎"],
  },
  {
    question: "小朋友晚上幾點要睡覺？",
    correctAnswer: "九點左右要上床睡覺",
    wrongAnswers: ["半夜十二點", "想睡再睡", "凌晨兩點"],
  },
  {
    question: "什麼時候要洗手？",
    correctAnswer: "吃飯前和上完廁所後",
    wrongAnswers: ["只有手很髒的時候", "一個月洗一次", "不用洗手"],
  },
  {
    question: "同學跌倒了要怎麼做？",
    correctAnswer: "幫忙扶起來，告訴老師",
    wrongAnswers: ["笑他", "不理他", "推他一下"],
  },
  {
    question: "吃東西前要先做什麼？",
    correctAnswer: "先洗手再吃",
    wrongAnswers: ["直接用手拿來吃", "用衣服擦手就好", "不用洗手"],
  },
  {
    question: "坐車的時候要怎麼做？",
    correctAnswer: "繫好安全帶，坐好不亂動",
    wrongAnswers: ["站起來玩", "把頭伸出窗外", "不用繫安全帶"],
  },
];

// Number range per difficulty tier
const TIER_RANGES: Record<DifficultyTier, { min: number; max: number }> = {
  1: { min: 1, max: 10 },
  2: { min: 1, max: 15 },
  3: { min: 1, max: 18 },
  4: { min: 1, max: 20 },
  5: { min: 10, max: 50 },
  6: { min: 10, max: 80 },
  7: { min: 10, max: 99 },
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChoices(correct: number, tier: DifficultyTier): number[] {
  const range = TIER_RANGES[tier];
  const choices = new Set<number>([correct]);

  // Use wider distractor offset for two-digit tiers
  const maxOffset = tier >= 5 ? 5 : 3;

  while (choices.size < 4) {
    // Generate distractors near the correct answer
    const offset = randInt(1, maxOffset) * (Math.random() > 0.5 ? 1 : -1);
    const distractor = correct + offset;
    if (distractor >= 0 && distractor <= range.max) {
      choices.add(distractor);
    } else {
      choices.add(randInt(Math.max(0, range.min - 1), range.max));
    }
  }

  // Shuffle
  return [...choices].sort(() => Math.random() - 0.5);
}

/** Generate choices for single-digit answers (0-9), used by placeValue */
function generateDigitChoices(correct: number): number[] {
  const choices = new Set<number>([correct]);
  while (choices.size < 4) {
    const offset = randInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
    const distractor = correct + offset;
    if (distractor >= 0 && distractor <= 9) {
      choices.add(distractor);
    } else {
      choices.add(randInt(0, 9));
    }
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

const generators: Partial<Record<PuzzleType, PuzzleGenerator>> = {
  addition: (tier) => {
    const range = TIER_RANGES[tier];
    const a = randInt(range.min, Math.floor(range.max / 2));
    const b = randInt(range.min, range.max - a);
    const correct = a + b;
    return {
      question: `${a} + ${b} = ?`,
      correctAnswer: correct,
      choices: generateChoices(correct, tier),
      puzzleType: "addition",
    };
  },

  subtraction: (tier) => {
    const range = TIER_RANGES[tier];
    const a = randInt(Math.floor(range.max / 2), range.max);
    const b = randInt(range.min, a);
    const correct = a - b;
    return {
      question: `${a} - ${b} = ?`,
      correctAnswer: correct,
      choices: generateChoices(correct, tier),
      puzzleType: "subtraction",
    };
  },

  counting: (tier) => {
    const range = TIER_RANGES[tier];
    const count = randInt(Math.max(range.min, 2), Math.min(range.max, 10));
    const emoji = ["🍎", "⭐", "🌟", "🔵", "🟢"][randInt(0, 4)];
    // Arrange emojis in rows of 5 for readability
    const rows: string[] = [];
    for (let i = 0; i < count; i += 5) {
      const rowCount = Math.min(5, count - i);
      rows.push(Array(rowCount).fill(emoji).join(" "));
    }
    return {
      question: `數一數，有幾個？\n${rows.join("\n")}`,
      correctAnswer: count,
      choices: generateChoices(count, tier),
      puzzleType: "counting",
    };
  },

  comparison: (tier) => {
    const range = TIER_RANGES[tier];
    const a = randInt(range.min, range.max);
    let b = randInt(range.min, range.max);
    while (b === a) b = randInt(range.min, range.max);

    const bigger = Math.max(a, b);
    return {
      question: `哪個比較大？\n${a} 還是 ${b}`,
      correctAnswer: bigger,
      choices: generateChoices(bigger, tier),
      puzzleType: "comparison",
    };
  },

  twoDigitAdd: (tier) => {
    const range = TIER_RANGES[tier];
    const a = randInt(range.min, range.max);
    // Ensure sum doesn't exceed 99
    const maxB = Math.min(range.max, 99 - a);
    const b = randInt(range.min, Math.max(range.min, maxB));
    const correct = a + b;
    return {
      question: `${a} + ${b} = ?`,
      correctAnswer: correct,
      choices: generateChoices(correct, tier),
      puzzleType: "twoDigitAdd",
    };
  },

  twoDigitSub: (tier) => {
    const range = TIER_RANGES[tier];
    // Pick a larger number first, then subtract a smaller one to ensure result >= 0
    const a = randInt(Math.max(range.min, Math.floor((range.min + range.max) / 2)), range.max);
    const b = randInt(range.min, a);
    const correct = a - b;
    return {
      question: `${a} - ${b} = ?`,
      correctAnswer: correct,
      choices: generateChoices(correct, tier),
      puzzleType: "twoDigitSub",
    };
  },

  placeValue: (tier) => {
    const range = TIER_RANGES[tier];
    const num = randInt(Math.max(range.min, 10), range.max);
    const askTens = Math.random() > 0.5;
    const tensDigit = Math.floor(num / 10);
    const onesDigit = num % 10;
    const correct = askTens ? tensDigit : onesDigit;
    const digitName = askTens ? "十" : "個";
    return {
      question: `${num} 的${digitName}位數字是？`,
      correctAnswer: correct,
      choices: generateDigitChoices(correct),
      puzzleType: "placeValue",
    };
  },

  ordering: (tier) => {
    const range = TIER_RANGES[tier];
    const nums = new Set<number>();
    while (nums.size < 3) {
      nums.add(randInt(range.min, range.max));
    }
    const numArr = [...nums];
    const correct = Math.max(...numArr);
    return {
      question: `哪個最大？\n${numArr.join(", ")}`,
      correctAnswer: correct,
      choices: generateChoices(correct, tier),
      puzzleType: "ordering",
    };
  },

  // ------ New ocean-theme generators ------

  clockReading: (_tier) => {
    const target = pickRandom(CLOCK_TIMES);
    const correctLabel = target.label;
    // Pick 3 distinct wrong labels
    const others = CLOCK_TIMES.filter((t) => t.label !== correctLabel);
    const wrongLabels = pickNDistinct(others, 3).map((t) => t.label);
    const choices = shuffleArray([correctLabel, ...wrongLabels]);
    return {
      question: `現在幾點？\n${target.emoji}`,
      correctAnswer: correctLabel,
      choices,
      puzzleType: "clockReading",
    };
  },

  coinCounting: (_tier) => {
    const coinValues = [1, 5, 10, 50];
    // Pick 2-4 coins
    const numCoins = randInt(2, 4);
    const coins: number[] = [];
    for (let i = 0; i < numCoins; i++) {
      coins.push(pickRandom(coinValues));
    }
    const total = coins.reduce((s, c) => s + c, 0);
    const coinStr = coins.map((c) => `${c}元`).join(" + ");

    // Generate 3 wrong totals near the correct one
    const choiceSet = new Set<number>([total]);
    while (choiceSet.size < 4) {
      const offset = randInt(1, 10) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = total + offset;
      if (wrong > 0) choiceSet.add(wrong);
    }
    const choices = shuffleArray([...choiceSet]);
    return {
      question: `算一算，總共多少元？\n${coinStr}`,
      correctAnswer: total,
      choices,
      puzzleType: "coinCounting",
    };
  },

  zhuyinToChar: (_tier) => {
    const target = pickRandom(ZHUYIN_VOCAB);
    const others = ZHUYIN_VOCAB.filter((w) => w.character !== target.character);
    const wrongChars = pickNDistinct(others, 3).map((w) => w.character);
    const choices = shuffleArray([target.character, ...wrongChars]);
    return {
      question: `這是哪個詞？\n${target.zhuyin}`,
      correctAnswer: target.character,
      choices,
      puzzleType: "zhuyinToChar",
    };
  },

  imageToZhuyin: (_tier) => {
    const target = pickRandom(IMAGE_VOCAB);
    const others = IMAGE_VOCAB.filter((w) => w.name !== target.name);
    const wrongZhuyin = pickNDistinct(others, 3).map((w) => w.zhuyin);
    const choices = shuffleArray([target.zhuyin, ...wrongZhuyin]);
    return {
      question: `這個的注音是什麼？\n${target.emoji}`,
      correctAnswer: target.zhuyin,
      choices,
      puzzleType: "imageToZhuyin",
    };
  },

  oceanCreature: (_tier) => {
    const target = pickRandom(OCEAN_CREATURES);
    const others = OCEAN_CREATURES.filter((c) => c.name !== target.name);
    const showEmoji = Math.random() > 0.5;

    if (showEmoji) {
      // Show emoji, pick correct name from 4 choices
      const wrongNames = pickNDistinct(others, 3).map((c) => c.name);
      const choices = shuffleArray([target.name, ...wrongNames]);
      return {
        question: `這是什麼海洋生物？\n${target.emoji}`,
        correctAnswer: target.name,
        choices,
        puzzleType: "oceanCreature",
      };
    } else {
      // Show name, pick correct emoji from 4 choices
      const wrongEmojis = pickNDistinct(others, 3).map((c) => c.emoji);
      const choices = shuffleArray([target.emoji, ...wrongEmojis]);
      return {
        question: `「${target.name}」是哪一個？`,
        correctAnswer: target.emoji,
        choices,
        puzzleType: "oceanCreature",
      };
    }
  },

  lifeSafety: (_tier) => {
    const q = pickRandom(SAFETY_QUESTIONS);
    const choices = shuffleArray([q.correctAnswer, ...q.wrongAnswers]);
    return {
      question: q.question,
      correctAnswer: q.correctAnswer,
      choices,
      puzzleType: "lifeSafety",
    };
  },
};

export class PuzzleManager {
  private registry: Map<PuzzleType, PuzzleGenerator> = new Map();

  constructor() {
    // Register built-in generators
    for (const [type, gen] of Object.entries(generators)) {
      this.registry.set(type as PuzzleType, gen);
    }
  }

  register(type: PuzzleType, generator: PuzzleGenerator): void {
    this.registry.set(type, generator);
  }

  generate(type: PuzzleType, difficulty: DifficultyTier): Puzzle {
    const gen = this.registry.get(type);
    if (!gen) {
      throw new Error(`Unknown puzzle type: ${type}`);
    }
    return gen(difficulty);
  }

  /** Get available puzzle types for a difficulty tier */
  getAvailableTypes(tier: DifficultyTier): PuzzleType[] {
    const tierTypes: Record<DifficultyTier, PuzzleType[]> = {
      1: ["addition"],
      2: ["addition", "subtraction"],
      3: ["addition", "subtraction", "counting"],
      4: ["addition", "subtraction", "counting", "comparison"],
      5: ["twoDigitAdd", "twoDigitSub"],
      6: ["twoDigitAdd", "twoDigitSub", "placeValue"],
      7: ["twoDigitAdd", "twoDigitSub", "placeValue", "ordering"],
    };
    return tierTypes[tier];
  }
}
