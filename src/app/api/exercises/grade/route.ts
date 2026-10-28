import { NextRequest, NextResponse } from "next/server";
import { gradeSingleQuestion, QuestionData, GradedQuestionResult } from "@/lib/grading/grader";

// Sample questions database for demo / fallback
const DEMO_QUESTIONS: Record<string, QuestionData> = {
  "q1": {
    id: "q1",
    type: "mcq",
    content: {
      prompt: "She usually ______ to the music club on Sunday mornings.",
      options: ["go", "goes", "going", "went"],
    },
    answer: { correct: 1 },
    explanation: "Chủ ngữ là 'She' (ngôi thứ 3 số ít) và có trạng từ chỉ tần suất 'usually' nên động từ 'go' thêm 'es' thành 'goes'.",
  },
  "q2": {
    id: "q2",
    type: "fill_blank",
    content: {
      prompt: "My brother [blank] swimming every afternoon. (love)",
    },
    answer: {
      blanks: [["loves"]],
    },
    explanation: "Chủ ngữ 'My brother' là ngôi thứ 3 số ít, thì Hiện tại đơn nên động từ thêm 's': loves.",
  },
  "q3": {
    id: "q3",
    type: "true_false",
    content: {
      statement: "We use Present Simple to describe permanent truths or daily routines.",
    },
    answer: { correct: true },
    explanation: "Đúng. Thì Hiện tại đơn diễn tả sự thật hiển nhiên hoặc thói quen, hành động lặp đi lặp lại hàng ngày.",
  },
  "q4": {
    id: "q4",
    type: "matching",
    content: {
      left: ["Listen to", "Play", "Read"],
      right: ["books", "music", "football"],
    },
    answer: {
      pairs: [
        [0, 1], // Listen to -> music
        [1, 2], // Play -> football
        [2, 0], // Read -> books
      ],
    },
    explanation: "Listen to music (nghe nhạc), Play football (chơi bóng đá), Read books (đọc sách).",
  },
  "q5": {
    id: "q5",
    type: "reorder",
    content: {
      tokens: ["plays", "piano", "the", "He", "everyday."],
    },
    answer: {
      order: [3, 0, 2, 1, 4], // He plays the piano everyday.
    },
    explanation: "Cấu trúc câu khẳng định: S (He) + V-s (plays) + O (the piano) + Adverb (everyday).",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exerciseId, answers } = body as {
      exerciseId: string;
      answers: Record<string, any>;
    };

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Dữ liệu bài nộp không hợp lệ" },
        { status: 400 }
      );
    }

    const results: GradedQuestionResult[] = [];
    let totalScore = 0;
    const questionKeys = Object.keys(answers);

    for (const qId of questionKeys) {
      const question = DEMO_QUESTIONS[qId];
      if (question) {
        const { isCorrect, score } = gradeSingleQuestion(question, answers[qId]);
        totalScore += score;
        results.push({
          questionId: qId,
          isCorrect,
          score,
          correctAnswer: question.answer,
          explanation: question.explanation,
        });
      }
    }

    const count = results.length || 1;
    const finalPercentage = Math.round((totalScore / count) * 100);

    return NextResponse.json({
      success: true,
      exerciseId,
      score: finalPercentage,
      passed: finalPercentage >= 70,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi máy chủ khi chấm bài" },
      { status: 500 }
    );
  }
}
