import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for structured output validation
const ExtractedSchema = z.object({
  unit_title: z.string(),
  vocabulary: z.array(
    z.object({
      word: z.string(),
      pos: z.string(),
      meaning_vi: z.string(),
      example: z.string(),
    })
  ),
  grammar_points: z.array(
    z.object({
      title: z.string(),
      explanation_vi: z.string(),
      examples: z.array(z.string()),
    })
  ),
  exercises: z.array(
    z.object({
      title: z.string(),
      source: z.enum(["book", "ai"]),
      questions: z.array(
        z.object({
          type: z.enum(["mcq", "fill_blank", "true_false", "matching", "reorder"]),
          content: z.record(z.string(), z.any()),
          answer: z.record(z.string(), z.any()),
          explanation: z.string(),
          needs_review: z.boolean().default(true),
        })
      ),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if real Gemini API key is provided
    if (!apiKey || apiKey.includes("mock-gemini-key")) {
      // Return realistic mock extraction data for preview & testing
      const mockResult = {
        unit_title: "Unit 4: My Neighbourhood",
        vocabulary: [
          { word: "Suburbs", pos: "n", meaning: "Khu vực ngoại ô", example: "We live in the suburbs of Hanoi." },
          { word: "Convenient", pos: "adj", meaning: "Thuận tiện, tiện lợi", example: "Living in the city is very convenient." },
          { word: "Historic", pos: "adj", meaning: "Cổ kính, có giá trị lịch sử", example: "Hoi An is an ancient and historic town." },
        ],
        grammar_points: [
          {
            title: "Comparative Adjectives (Tính từ so sánh hơn)",
            explanation_vi: "Tính từ ngắn: adj + -er + than. Tính từ dài: more + adj + than.",
            examples: ["The city is noisier than the countryside.", "This building is more modern than that one."],
          },
        ],
        exercises: [
          {
            title: "Exercise 1: Choose the correct comparative form (Trích xuất SGK)",
            source: "book",
            questions: [
              {
                type: "mcq",
                content: {
                  prompt: "A city house is usually ______ than a country house.",
                  options: ["expensive", "more expensive", "expensiver", "most expensive"],
                },
                answer: { correct: 1 },
                explanation: "'Expensive' là tính từ dài có 3 âm tiết, nên so sánh hơn dùng 'more expensive than'.",
                needs_review: false,
              },
            ],
          },
          {
            title: "Exercise 2: Practice with Gemini AI (Sinh thêm tự động)",
            source: "ai",
            questions: [
              {
                type: "fill_blank",
                content: {
                  prompt: "Life in the countryside is [blank] than in the city. (peaceful)",
                },
                answer: {
                  blanks: [["more peaceful"]],
                },
                explanation: "'Peaceful' là tính từ dài, so sánh hơn là 'more peaceful'.",
                needs_review: true,
              },
            ],
          },
        ],
      };

      return NextResponse.json({
        success: true,
        source: "mock_simulation",
        data: mockResult,
      });
    }

    // Call Gemini API via Google GenAI REST or SDK
    const prompt = `Bạn là trợ lý số hóa sách tiếng Anh cho học sinh cấp 2 tại Việt Nam.
Từ nội dung được cung cấp:
1. Trích xuất NGUYÊN VĂN các bài tập có trong sách (source = "book").
2. Sinh thêm 5–10 câu luyện tập bổ sung bám sát từ vựng và ngữ pháp của unit (source = "ai").
3. Chỉ dùng các type: mcq, fill_blank, true_false, matching, reorder.
4. Mỗi câu có explanation ngắn gọn bằng tiếng Việt, dễ hiểu cho học sinh lớp 6–9.
Chỉ trả về JSON đúng theo schema.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawJson);

    // Validate with Zod
    const validated = ExtractedSchema.parse(parsed);

    return NextResponse.json({
      success: true,
      data: validated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi xử lý Gemini" },
      { status: 500 }
    );
  }
}
