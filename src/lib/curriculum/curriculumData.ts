export interface VocabWord {
  word: string;
  pos: string; // part of speech: n, v, adj, adv
  phonetic?: string;
  meaning: string;
  example: string;
}

export interface GrammarPoint {
  title: string;
  formula?: string;
  usage: string;
  examples: string[];
}

export interface ExerciseQuestion {
  id: string;
  type: "mcq" | "fill_blank" | "true_false" | "matching" | "reorder";
  content: any;
  answer: any;
  explanation: string;
}

export interface LessonData {
  id: string; // e.g. "unit-1-lesson-1"
  unitId: string; // e.g. "unit-1"
  unitCode: string; // e.g. "Unit 1"
  unitTitle: string; // e.g. "My New School"
  lessonNumber: number; // 1 to 5
  title: string; // e.g. "Bài 1: Getting Started & Từ vựng"
  subTitle?: string;
  grade: string; // e.g. "Chương trình lớp 6"
  bookTitle: string; // e.g. "Tiếng Anh 6 - Global Success"
  durationMinutes: number;
  defaultVideoUrl: string; // YouTube or video link
  vocabulary: VocabWord[];
  grammar: GrammarPoint[];
  questions: ExerciseQuestion[];
}

export interface UnitData {
  id: string;
  code: string;
  title: string;
  grade: string;
  bookTitle: string;
  lessons: {
    id: string;
    number: number;
    title: string;
    durationMinutes: number;
  }[];
}

export const CURRICULUM_UNITS: UnitData[] = [
  {
    id: "unit-1",
    code: "Unit 1",
    title: "My New School",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    lessons: [
      { id: "unit-1-lesson-1", number: 1, title: "Bài 1 · Getting Started & Từ vựng trường học", durationMinutes: 8 },
      { id: "unit-1-lesson-2", number: 2, title: "Bài 2 · A Closer Look 1 (Phát âm /ɑː/ & /ʌ/)", durationMinutes: 7 },
      { id: "unit-1-lesson-3", number: 3, title: "Bài 3 · A Closer Look 2 (Ngữ pháp: Present Simple)", durationMinutes: 10 },
      { id: "unit-1-lesson-4", number: 4, title: "Bài 4 · Communication & Skills (Kỹ năng giao tiếp)", durationMinutes: 9 },
      { id: "unit-1-lesson-5", number: 5, title: "Bài 5 · Looking Back & Bài tập tổng hợp", durationMinutes: 12 },
    ],
  },
  {
    id: "unit-2",
    code: "Unit 2",
    title: "My House",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    lessons: [
      { id: "unit-2-lesson-1", number: 1, title: "Bài 1 · Getting Started & Từ vựng các phòng, đồ vật", durationMinutes: 8 },
      { id: "unit-2-lesson-2", number: 2, title: "Bài 2 · A Closer Look 1 (Phát âm /s/ & /z/)", durationMinutes: 7 },
      { id: "unit-2-lesson-3", number: 3, title: "Bài 3 · A Closer Look 2 (Giới từ chỉ vị trí & Sở hữu cách)", durationMinutes: 9 },
      { id: "unit-2-lesson-4", number: 4, title: "Bài 4 · Communication & Skills (Mô tả ngôi nhà mơ ước)", durationMinutes: 8 },
      { id: "unit-2-lesson-5", number: 5, title: "Bài 5 · Looking Back & Tổng kết Unit 2", durationMinutes: 10 },
    ],
  },
  {
    id: "unit-3",
    code: "Unit 3",
    title: "My Friends",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    lessons: [
      { id: "unit-3-lesson-1", number: 1, title: "Bài 1 · Getting Started & Từ vựng tính cách, ngoại hình", durationMinutes: 8 },
      { id: "unit-3-lesson-2", number: 2, title: "Bài 2 · A Closer Look 1 (Phát âm /b/ & /p/)", durationMinutes: 7 },
      { id: "unit-3-lesson-3", number: 3, title: "Bài 3 · A Closer Look 2 (Ngữ pháp: Present Continuous)", durationMinutes: 10 },
      { id: "unit-3-lesson-4", number: 4, title: "Bài 4 · Communication & Skills (Miêu tả bạn thân)", durationMinutes: 9 },
      { id: "unit-3-lesson-5", number: 5, title: "Bài 5 · Looking Back & Ôn tập cuối Unit 3", durationMinutes: 11 },
    ],
  },
  {
    id: "unit-4",
    code: "Unit 4",
    title: "My Neighbourhood",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    lessons: [
      { id: "unit-4-lesson-1", number: 1, title: "Bài 1 · Getting Started & Từ vựng địa điểm khu phố", durationMinutes: 8 },
      { id: "unit-4-lesson-2", number: 2, title: "Bài 2 · A Closer Look 1 (Phát âm /iː/ & /ɪ/)", durationMinutes: 7 },
      { id: "unit-4-lesson-3", number: 3, title: "Bài 3 · A Closer Look 2 (So sánh hơn của tính từ ngắn)", durationMinutes: 10 },
      { id: "unit-4-lesson-4", number: 4, title: "Bài 4 · Communication & Hỏi đường chỉ đường", durationMinutes: 9 },
      { id: "unit-4-lesson-5", number: 5, title: "Bài 5 · Looking Back & Ôn tập Unit 4", durationMinutes: 10 },
    ],
  },
];

export const LESSON_DETAILS: Record<string, LessonData> = {
  // UNIT 1
  "unit-1-lesson-1": {
    id: "unit-1-lesson-1",
    unitId: "unit-1",
    unitCode: "Unit 1",
    unitTitle: "My New School",
    lessonNumber: 1,
    title: "Bài 1: Getting Started & Từ vựng trường học",
    subTitle: "A special day & School Things",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    durationMinutes: 8,
    defaultVideoUrl: "https://www.youtube.com/watch?v=0_u6eJj_mC4",
    vocabulary: [
      { word: "Calculator", pos: "n", phonetic: "/ˈkælkjuleɪtər/", meaning: "Máy tính cầm tay", example: "I use a calculator in my maths lesson." },
      { word: "School bag", pos: "n", phonetic: "/ˈskuːl bæɡ/", meaning: "Cặp sách / Balo đi học", example: "Her school bag is heavy today." },
      { word: "Uniform", pos: "n", phonetic: "/ˈjuːnɪfɔːm/", meaning: "Đồng phục học sinh", example: "We wear uniforms on Mondays." },
      { word: "Compass", pos: "n", phonetic: "/ˈkʌmpəs/", meaning: "Com-pa (dụng cụ vẽ hình tròn)", example: "He draws a circle with a compass." },
      { word: "Pencil sharpener", pos: "n", phonetic: "/ˈpensl ʃɑːpnər/", meaning: "Cái gọt bút chì", example: "Can I borrow your pencil sharpener?" },
      { word: "Excited", pos: "adj", phonetic: "/ɪkˈsaɪtɪd/", meaning: "Hào hứng, phấn khởi", example: "Phong is excited about his first day at secondary school." },
    ],
    grammar: [
      {
        title: "Động từ 'have', 'do', 'play', 'study' đi cùng danh từ môn học",
        formula: "have / do / play / study + Noun",
        usage: "Các cụm từ cố định thường gặp trong chủ đề trường học:",
        examples: [
          "• have: have breakfast, have lessons, have lunch",
          "• do: do homework, do judo, do exercise",
          "• play: play football, play music, play badminton",
          "• study: study maths, study English, study history",
        ],
      },
    ],
    questions: [
      {
        id: "u1l1-q1",
        type: "mcq",
        content: {
          prompt: "1. Students wear their ______ on Mondays and Fridays.",
          options: ["compass", "uniform", "calculator", "rubber"],
        },
        answer: { correct: 1 },
        explanation: "Học sinh mặc 'đồng phục' (uniform) vào các ngày thứ Hai và thứ Sáu.",
      },
      {
        id: "u1l1-q2",
        type: "fill_blank",
        content: {
          prompt: "2. Lan often [blank] her homework right after dinner. (do)",
        },
        answer: {
          blanks: [["does"]],
        },
        explanation: "Chủ ngữ là 'Lan' (ngôi 3 số ít), động từ 'do' chia thành 'does'. Cụm từ: do homework.",
      },
      {
        id: "u1l1-q3",
        type: "true_false",
        content: {
          statement: "3. We say 'play judo' instead of 'do judo'.",
        },
        answer: { correct: false },
        explanation: "Sai. Với các môn võ thuật hoặc thể dục cá nhân, ta dùng 'do judo', không dùng 'play judo'.",
      },
      {
        id: "u1l1-q4",
        type: "matching",
        content: {
          left: ["do", "play", "have"],
          right: ["football", "breakfast", "homework"],
        },
        answer: {
          pairs: [
            [0, 2], // do homework
            [1, 0], // play football
            [2, 1], // have breakfast
          ],
        },
        explanation: "do homework (làm bài tập), play football (chơi bóng đá), have breakfast (ăn sáng).",
      },
      {
        id: "u1l1-q5",
        type: "reorder",
        content: {
          tokens: ["my", "new", "I", "school.", "love"],
        },
        answer: {
          order: [2, 4, 0, 1, 3], // I love my new school.
        },
        explanation: "Cấu trúc câu khẳng định: S (I) + V (love) + O (my new school).",
      },
    ],
  },

  "unit-1-lesson-2": {
    id: "unit-1-lesson-2",
    unitId: "unit-1",
    unitCode: "Unit 1",
    unitTitle: "My New School",
    lessonNumber: 2,
    title: "Bài 2: A Closer Look 1 (Phát âm & Từ vựng mở rộng)",
    subTitle: "Sounds /ɑː/ and /ʌ/ & School subjects",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    durationMinutes: 7,
    defaultVideoUrl: "https://www.youtube.com/watch?v=0_u6eJj_mC4",
    vocabulary: [
      { word: "Subject", pos: "n", phonetic: "/ˈsʌbdʒɪkt/", meaning: "Môn học", example: "English is my favourite subject." },
      { word: "Science", pos: "n", phonetic: "/ˈsaɪəns/", meaning: "Môn Khoa học tự nhiên", example: "We have science on Thursday." },
      { word: "History", pos: "n", phonetic: "/ˈhɪstri/", meaning: "Môn Lịch sử", example: "Learning history helps us understand the past." },
      { word: "Smart", pos: "adj", phonetic: "/smɑːt/", meaning: "Sáng sủa, thông minh", example: "He looks very smart in his school uniform." },
    ],
    grammar: [
      {
        title: "Quy tắc phát âm cặp âm /ɑː/ (a dài) và /ʌ/ (á ngắn)",
        formula: "/ɑː/ vs /ʌ/",
        usage: "Cách phát âm chuẩn và các từ thường gặp:",
        examples: [
          "• Âm /ɑː/ (mở rộng miệng, kéo dài): star, smart, class, park, fast",
          "• Âm /ʌ/ (miệng mở tự nhiên, dứt khoát): study, subject, club, rubber, lunch",
        ],
      },
    ],
    questions: [
      {
        id: "u1l2-q1",
        type: "mcq",
        content: {
          prompt: "1. Which word has the underlined sound /ɑː/?",
          options: ["study", "club", "smart", "lunch"],
        },
        answer: { correct: 2 },
        explanation: "'smart' phát âm là /smɑːt/ (âm /ɑː/), trong khi các từ còn lại chứa âm /ʌ/.",
      },
      {
        id: "u1l2-q2",
        type: "fill_blank",
        content: {
          prompt: "2. What is your favourite [blank] at school? - It's English.",
        },
        answer: {
          blanks: [["subject"]],
        },
        explanation: "'subject' nghĩa là môn học. Câu hỏi: Môn học yêu thích của bạn là gì?",
      },
    ],
  },

  "unit-1-lesson-3": {
    id: "unit-1-lesson-3",
    unitId: "unit-1",
    unitCode: "Unit 1",
    unitTitle: "My New School",
    lessonNumber: 3,
    title: "Bài 3: A Closer Look 2 (Ngữ pháp: Present Simple)",
    subTitle: "Thì Hiện tại đơn - Cấu trúc & Dấu hiệu nhận biết",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    durationMinutes: 10,
    defaultVideoUrl: "https://www.youtube.com/watch?v=0_u6eJj_mC4",
    vocabulary: [
      { word: "Routine", pos: "n", phonetic: "/ruːˈtiːn/", meaning: "Thói quen hàng ngày", example: "My daily routine starts at 6 AM." },
      { word: "Always", pos: "adv", phonetic: "/ˈɔːlweɪz/", meaning: "Luôn luôn (100%)", example: "I always do my homework." },
      { word: "Usually", pos: "adv", phonetic: "/ˈjuːʒuəli/", meaning: "Thường thường (80%)", example: "She usually walks to school." },
      { word: "Never", pos: "adv", phonetic: "/ˈnevər/", meaning: "Không bao giờ (0%)", example: "They never arrive late." },
    ],
    grammar: [
      {
        title: "Thì Hiện tại đơn (The Present Simple Tense)",
        formula: "(+) S + V(s/es) | (-) S + don't/doesn't + V_inf | (?) Do/Does + S + V_inf?",
        usage: "Diễn tả thói quen lặp đi lặp lại hoặc chân lý, sự thật hiển nhiên.",
        examples: [
          "• I / You / We / They + V nguyên thể (Ví dụ: They play badminton.)",
          "• He / She / It + V thêm s/es (Ví dụ: He lives in Hanoi.)",
          "• Trạng từ chỉ tần suất đứng TRƯỚC động từ thường, đứng SAU to be.",
        ],
      },
    ],
    questions: [
      {
        id: "u1l3-q1",
        type: "mcq",
        content: {
          prompt: "1. She usually ______ to school with her best friend.",
          options: ["walk", "walks", "walking", "walked"],
        },
        answer: { correct: 1 },
        explanation: "Chủ ngữ 'She' là ngôi 3 số ít, thì Hiện tại đơn nên động từ thêm 's': walks.",
      },
      {
        id: "u1l3-q2",
        type: "fill_blank",
        content: {
          prompt: "2. My father [blank] (not like) watching horror movies.",
        },
        answer: {
          blanks: [["doesn't like"], ["does not like"]],
        },
        explanation: "Chủ ngữ 'My father' số ít, phủ định dùng trợ động từ 'doesn't like'.",
      },
      {
        id: "u1l3-q3",
        type: "reorder",
        content: {
          tokens: ["never", "late", "for", "is", "Mai", "school."],
        },
        answer: {
          order: [4, 3, 0, 1, 2, 5], // Mai is never late for school.
        },
        explanation: "Trạng từ chỉ tần suất 'never' đứng SAU động từ to be: Mai is never late for school.",
      },
    ],
  },

  // UNIT 2
  "unit-2-lesson-1": {
    id: "unit-2-lesson-1",
    unitId: "unit-2",
    unitCode: "Unit 2",
    unitTitle: "My House",
    lessonNumber: 1,
    title: "Bài 1: Getting Started & Từ vựng các phòng, đồ vật",
    subTitle: "A look inside the house",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    durationMinutes: 8,
    defaultVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    vocabulary: [
      { word: "Living room", pos: "n", meaning: "Phòng khách", example: "Our living room has a large TV." },
      { word: "Bedroom", pos: "n", meaning: "Phòng ngủ", example: "There is a bed and a desk in my bedroom." },
      { word: "Kitchen", pos: "n", meaning: "Phòng bếp", example: "My mother is cooking in the kitchen." },
      { word: "Bathroom", pos: "n", meaning: "Phòng tắm", example: "The bathroom is next to the bedroom." },
      { word: "Wardrobe", pos: "n", meaning: "Tủ đựng quần áo", example: "Put your clothes in the wardrobe." },
    ],
    grammar: [
      {
        title: "Cấu trúc 'There is / There are'",
        formula: "There is + Danh từ số ít / không đếm được | There are + Danh từ số nhiều",
        usage: "Dùng để miêu tả sự tồn tại của đồ vật hoặc người ở một nơi nào đó.",
        examples: [
          "• There is a lamp on the desk.",
          "• There are two pillows on the bed.",
        ],
      },
    ],
    questions: [
      {
        id: "u2l1-q1",
        type: "mcq",
        content: {
          prompt: "1. There ______ four chairs in the dining room.",
          options: ["is", "are", "have", "has"],
        },
        answer: { correct: 1 },
        explanation: "'four chairs' là danh từ số nhiều nên dùng 'There are'.",
      },
    ],
  },

  // UNIT 3
  "unit-3-lesson-1": {
    id: "unit-3-lesson-1",
    unitId: "unit-3",
    unitCode: "Unit 3",
    unitTitle: "My Friends",
    lessonNumber: 1,
    title: "Bài 1: Getting Started & Từ vựng ngoại hình, tính cách",
    subTitle: "A surprise guest & Personality adjectives",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    durationMinutes: 8,
    defaultVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    vocabulary: [
      { word: "Clever", pos: "adj", phonetic: "/ˈklevər/", meaning: "Thông minh, lanh lợi", example: "He is a clever boy who learns quickly." },
      { word: "Kind", pos: "adj", phonetic: "/kaɪnd/", meaning: "Tốt bụng, nhân hậu", example: "Mai is very kind and always helps her classmates." },
      { word: "Creative", pos: "adj", phonetic: "/kriˈeɪtɪv/", meaning: "Sáng tạo", example: "She has creative ideas for art projects." },
      { word: "Confident", pos: "adj", phonetic: "/ˈkɒnfɪdənt/", meaning: "Tự tin", example: "Nam is confident when speaking in public." },
      { word: "Hard-working", pos: "adj", phonetic: "/ˌhɑːd ˈwɜːkɪŋ/", meaning: "Chăm chỉ", example: "They are hard-working students." },
    ],
    grammar: [
      {
        title: "Cách dùng tính từ miêu tả người",
        formula: "S + be + adj | S + have/has + adj + noun",
        usage: "Dùng để miêu tả đặc điểm tính cách hoặc ngoại hình của bạn bè.",
        examples: [
          "• An is very friendly and active.",
          "• She has long black hair and big round eyes.",
        ],
      },
    ],
    questions: [
      {
        id: "u3l1-q1",
        type: "mcq",
        content: {
          prompt: "1. Mai likes making new things and drawing. She is very ______.",
          options: ["kind", "creative", "shy", "lazy"],
        },
        answer: { correct: 1 },
        explanation: "Thích sáng tạo đồ vật mới và vẽ tranh thể hiện tính cách 'creative' (sáng tạo).",
      },
    ],
  },

  "unit-3-lesson-2": {
    id: "unit-3-lesson-2",
    unitId: "unit-3",
    unitCode: "Unit 3",
    unitTitle: "My Friends",
    lessonNumber: 2,
    title: "Bài 2: A Closer Look 1 (Phát âm /b/ & /p/ và Bộ phận cơ thể)",
    subTitle: "Sounds /b/ & /p/ and Body parts",
    grade: "Chương trình lớp 6",
    bookTitle: "Tiếng Anh 6 - Global Success",
    durationMinutes: 7,
    defaultVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    vocabulary: [
      { word: "Round face", pos: "n", meaning: "Khuôn mặt tròn", example: "She has a cute round face." },
      { word: "Straight hair", pos: "n", meaning: "Mái tóc thẳng", example: "Her sister has long straight hair." },
      { word: "Chubby cheeks", pos: "n", meaning: "Đôi má phúng phính", example: "The baby has chubby cheeks." },
      { word: "Glasses", pos: "n", meaning: "Cặp kính mắt", example: "He wears glasses when reading." },
    ],
    grammar: [
      {
        title: "Cặp âm /b/ và /p/",
        formula: "/b/ (hữu thanh) vs /p/ (vô thanh)",
        usage: "Luyện phát âm chuẩn hai âm môi:",
        examples: [
          "• /b/: big, book, boy, blonde, brown",
          "• /p/: pen, patient, picture, pencil, play",
        ],
      },
    ],
    questions: [
      {
        id: "u3l2-q1",
        type: "mcq",
        content: {
          prompt: "1. Which word starts with the /p/ sound?",
          options: ["book", "pencil", "big", "boy"],
        },
        answer: { correct: 1 },
        explanation: "'pencil' bắt đầu bằng âm /p/.",
      },
    ],
  },
};

/**
 * Helper to get a lesson by its id or slug.
 * Falls back gracefully to unit-1-lesson-1 if not found.
 */
export function getLessonById(id: string): LessonData {
  if (LESSON_DETAILS[id]) {
    return LESSON_DETAILS[id];
  }

  // Check if matches pattern unit-X-lesson-Y
  const match = id.match(/unit-(\d+)-lesson-(\d+)/i);
  if (match) {
    const unitNum = parseInt(match[1]);
    const lessonNum = parseInt(match[2]);

    // Construct synthetic lesson based on unit and lesson number
    const unit = CURRICULUM_UNITS.find((u) => u.id === `unit-${unitNum}`) || CURRICULUM_UNITS[0];
    const lessonMeta = unit.lessons.find((l) => l.number === lessonNum) || unit.lessons[0];

    return {
      id,
      unitId: unit.id,
      unitCode: unit.code,
      unitTitle: unit.title,
      lessonNumber: lessonNum,
      title: lessonMeta.title,
      subTitle: `${unit.code}: ${unit.title}`,
      grade: unit.grade,
      bookTitle: unit.bookTitle,
      durationMinutes: lessonMeta.durationMinutes,
      defaultVideoUrl: "https://www.youtube.com/watch?v=0_u6eJj_mC4",
      vocabulary: [
        { word: "Practice", pos: "v", meaning: "Luyện tập", example: "Practice speaking English every day." },
        { word: "Review", pos: "v", meaning: "Ôn lại kiến thức", example: "Review grammar notes before class." },
      ],
      grammar: [
        {
          title: `Lý thuyết trọng tâm ${unit.code} - ${lessonMeta.title}`,
          usage: "Ôn tập và nắm vững cấu trúc bài học theo sách giáo khoa.",
          examples: ["• Ghi nhớ từ vựng và vận dụng vào bài tập tự luyện."],
        },
      ],
      questions: [
        {
          id: `${id}-q1`,
          type: "mcq",
          content: {
            prompt: `1. Đây là bài luyện tập cho ${unit.code}: ${lessonMeta.title}. Chọn câu trả lời đúng:`,
            options: ["Lựa chọn A", "Lựa chọn B (Chính xác)", "Lựa chọn C", "Lựa chọn D"],
          },
          answer: { correct: 1 },
          explanation: "Chúc mừng bạn đã hoàn thành câu hỏi tự luyện của bài học!",
        },
      ],
    };
  }

  return LESSON_DETAILS["unit-1-lesson-1"];
}

/**
 * Returns all lessons for a specific unit.
 */
export function getLessonsForUnit(unitId: string) {
  const unit = CURRICULUM_UNITS.find((u) => u.id === unitId) || CURRICULUM_UNITS[0];
  return unit.lessons;
}

/**
 * Returns prev and next lesson ids for navigation buttons.
 */
export function getAdjacentLessons(currentLessonId: string) {
  const current = getLessonById(currentLessonId);
  const unit = CURRICULUM_UNITS.find((u) => u.id === current.unitId) || CURRICULUM_UNITS[0];
  const currentIndex = unit.lessons.findIndex((l) => l.id === currentLessonId);

  const prevLesson = currentIndex > 0 ? unit.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < unit.lessons.length - 1 ? unit.lessons[currentIndex + 1] : null;

  return { prevLesson, nextLesson, currentUnit: unit };
}
