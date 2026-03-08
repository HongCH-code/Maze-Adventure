import { Puzzle, PuzzleType, DifficultyTier } from "../types";

type PuzzleGenerator = (difficulty: DifficultyTier) => Puzzle;

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
