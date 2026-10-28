"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FillBlankProps {
  id: string;
  content: {
    prompt: string; // e.g. "My brother [blank] swimming every afternoon. (love)"
  };
  value: string[] | undefined;
  onChange: (val: string[]) => void;
  result?: {
    isCorrect: boolean;
    correctAnswer: { blanks: string[][] };
    explanation?: string;
  };
}

export function FillBlankQuestion({ id, content, value = [""], onChange, result }: FillBlankProps) {
  const parts = content.prompt.split("[blank]");

  const handleInputChange = (idx: number, text: string) => {
    const updated = [...value];
    updated[idx] = text;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-bold text-ink-900 leading-relaxed flex flex-wrap items-center gap-2">
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            <span>{part}</span>
            {idx < parts.length - 1 && (
              <input
                type="text"
                disabled={!!result}
                value={value[idx] || ""}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                placeholder="Điền từ..."
                className={cn(
                  "min-w-[140px] px-3 py-1.5 rounded-xl border-2 font-bold text-base transition-colors",
                  result
                    ? result.isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-red-500 bg-red-50 text-red-900"
                    : "border-capy-border focus:border-capy-primary focus:outline-none bg-white text-ink-900"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {result && (
        <div
          className={cn(
            "p-4 rounded-2xl text-sm leading-relaxed",
            result.isCorrect ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-red-50 text-red-900 border border-red-200"
          )}
        >
          <p className="font-bold mb-1">
            {result.isCorrect ? "🎉 Bạn điền đúng rồi!" : "❌ Chưa đúng rồi!"}
          </p>
          {!result.isCorrect && (
            <p className="mb-1">
              Đáp án gợi ý:{" "}
              <span className="font-bold underline">
                {result.correctAnswer.blanks.map((b) => b[0]).join(", ")}
              </span>
            </p>
          )}
          {result.explanation && <p>{result.explanation}</p>}
        </div>
      )}
    </div>
  );
}
