export interface DailyActivity {
  date: string; // YYYY-MM-DD
  minutes: number;
  lessonsCompleted: number;
  scoreAvg: number;
}

export interface MistakeItem {
  id: string;
  unitId: string;
  unitTitle: string;
  lessonTitle: string;
  category: "vocabulary" | "grammar" | "reading";
  questionId: string;
  prompt: string;
  type: "mcq" | "fill_blank" | "true_false" | "matching" | "reorder";
  content: any;
  answer: any;
  userLastWrongAnswer: any;
  explanation: string;
  mastered: boolean;
  wrongCount: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  weekDays: {
    dayName: string;
    date: string;
    completed: boolean;
    isToday: boolean;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  category: "streak" | "accuracy" | "review";
}

export const INITIAL_MISTAKES: MistakeItem[] = [
  {
    id: "mis-01",
    unitId: "unit-2",
    unitTitle: "Unit 2: My Family",
    lessonTitle: "Từ vựng: Family Members",
    category: "vocabulary",
    questionId: "q-fam-1",
    prompt: "My father's sister is my ______.",
    type: "mcq",
    content: {
      prompt: "My father's sister is my ______.",
      options: ["cousin", "aunt", "niece", "grandmother"],
    },
    answer: { correct: 1 },
    userLastWrongAnswer: 0,
    explanation: "Chị gái hoặc em gái của bố là cô/bác gái/dì, tiếng Anh là 'aunt'. 'Cousin' là anh/chị/em họ.",
    mastered: false,
    wrongCount: 2,
  },
  {
    id: "mis-02",
    unitId: "unit-2",
    unitTitle: "Unit 2: My Family",
    lessonTitle: "Từ vựng: Family Members",
    category: "vocabulary",
    questionId: "q-fam-2",
    prompt: "The son of my uncle is my [blank].",
    type: "fill_blank",
    content: {
      prompt: "The son of my uncle is my [blank].",
    },
    answer: {
      blanks: [["cousin"]],
    },
    userLastWrongAnswer: ["nephew"],
    explanation: "Con trai của chú/bác là anh/em họ, tiếng Anh là 'cousin'. 'Nephew' là cháu trai.",
    mastered: false,
    wrongCount: 1,
  },
  {
    id: "mis-03",
    unitId: "unit-1",
    unitTitle: "Unit 1: My New School",
    lessonTitle: "Ngữ pháp: To be & Have",
    category: "grammar",
    questionId: "q-tobe-1",
    prompt: "They ______ new students at Quang Trung secondary school.",
    type: "mcq",
    content: {
      prompt: "They ______ new students at Quang Trung secondary school.",
      options: ["is", "am", "are", "be"],
    },
    answer: { correct: 2 },
    userLastWrongAnswer: 0,
    explanation: "Chủ ngữ là 'They' (đại từ số nhiều) nên động từ to be ở hiện tại là 'are'.",
    mastered: false,
    wrongCount: 2,
  },
  {
    id: "mis-04",
    unitId: "unit-1",
    unitTitle: "Unit 1: My New School",
    lessonTitle: "Ngữ pháp: Present Simple",
    category: "grammar",
    questionId: "q-pres-1",
    prompt: "Sắp xếp câu: uniform / wears / She / on / Mondays.",
    type: "reorder",
    content: {
      tokens: ["wears", "She", "uniform", "on", "Mondays."],
    },
    answer: {
      order: [1, 0, 2, 3, 4], // She wears uniform on Mondays.
    },
    userLastWrongAnswer: [0, 1, 2, 3, 4],
    explanation: "Thứ tự câu: Chủ ngữ (She) + Động từ (wears) + Tân ngữ (uniform) + Trạng từ (on Mondays).",
    mastered: false,
    wrongCount: 1,
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: "badge-streak-7",
    title: "Chăm chỉ 7 ngày",
    description: "Học liên tục 7 ngày không gián đoạn",
    icon: "🔥",
    unlockedAt: "2026-10-28",
    category: "streak",
  },
  {
    id: "badge-perfect-3",
    title: "Điểm tuyệt đối",
    description: "Đạt 100/100 điểm ở 3 bài tập liên tiếp",
    icon: "🌟",
    unlockedAt: "2026-10-27",
    category: "accuracy",
  },
  {
    id: "badge-mistake-solver",
    title: "Chiến binh sửa sai",
    description: "Làm đúng lại 5 câu từng làm sai",
    icon: "🛡️",
    unlockedAt: null,
    category: "review",
  },
  {
    id: "badge-book-finisher",
    title: "Chinh phục tập 1",
    description: "Hoàn thành 100% video và bài tập sách",
    icon: "🏆",
    unlockedAt: null,
    category: "accuracy",
  },
];
