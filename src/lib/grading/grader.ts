export interface QuestionData {
  id: string;
  type: "mcq" | "fill_blank" | "true_false" | "matching" | "reorder";
  content: any;
  answer: any;
  explanation?: string;
}

export interface UserAnswerInput {
  questionId: string;
  value: any;
}

export interface GradedQuestionResult {
  questionId: string;
  isCorrect: boolean;
  score: number; // 0 to 1
  correctAnswer: any;
  explanation?: string;
}

/**
 * Normalizes text for comparison (trim, lowercase, strip trailing punctuation)
 */
export function normalizeAnswerText(text: string): string {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Grades a single question based on question type and answer definition
 */
export function gradeSingleQuestion(
  question: QuestionData,
  userAnswerValue: any
): { isCorrect: boolean; score: number } {
  const { type, answer } = question;

  if (userAnswerValue === undefined || userAnswerValue === null) {
    return { isCorrect: false, score: 0 };
  }

  switch (type) {
    case "mcq": {
      // answer: { correct: number }
      const isCorrect = Number(userAnswerValue) === Number(answer.correct);
      return { isCorrect, score: isCorrect ? 1 : 0 };
    }

    case "true_false": {
      // answer: { correct: boolean }
      const isCorrect = Boolean(userAnswerValue) === Boolean(answer.correct);
      return { isCorrect, score: isCorrect ? 1 : 0 };
    }

    case "fill_blank": {
      // answer: { blanks: string[][] }
      // user answers: string[]
      if (!Array.isArray(answer.blanks) || !Array.isArray(userAnswerValue)) {
        return { isCorrect: false, score: 0 };
      }

      let correctCount = 0;
      for (let i = 0; i < answer.blanks.length; i++) {
        const acceptableAnswers: string[] = answer.blanks[i] || [];
        const normalizedUser = normalizeAnswerText(userAnswerValue[i] || "");
        const matched = acceptableAnswers.some(
          (ans) => normalizeAnswerText(ans) === normalizedUser
        );
        if (matched) correctCount++;
      }

      const fraction = correctCount / answer.blanks.length;
      return {
        isCorrect: fraction === 1,
        score: fraction,
      };
    }

    case "matching": {
      // answer: { pairs: [leftIndex, rightIndex][] }
      // user answers: [leftIndex, rightIndex][]
      if (!Array.isArray(answer.pairs) || !Array.isArray(userAnswerValue)) {
        return { isCorrect: false, score: 0 };
      }

      let correctCount = 0;
      for (const pair of answer.pairs) {
        const found = userAnswerValue.some(
          (uPair: [number, number]) =>
            uPair[0] === pair[0] && uPair[1] === pair[1]
        );
        if (found) correctCount++;
      }

      const fraction = answer.pairs.length > 0 ? correctCount / answer.pairs.length : 0;
      return {
        isCorrect: fraction === 1,
        score: fraction,
      };
    }

    case "reorder": {
      // answer: { order: number[] }
      // user answers: number[]
      if (!Array.isArray(answer.order) || !Array.isArray(userAnswerValue)) {
        return { isCorrect: false, score: 0 };
      }

      const isCorrect =
        answer.order.length === userAnswerValue.length &&
        answer.order.every((val: number, idx: number) => val === userAnswerValue[idx]);

      return { isCorrect, score: isCorrect ? 1 : 0 };
    }

    default:
      return { isCorrect: false, score: 0 };
  }
}
