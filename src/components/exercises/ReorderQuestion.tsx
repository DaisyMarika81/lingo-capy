"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ReorderProps {
  id: string;
  content: {
    tokens: string[]; // ["plays", "piano", "the", "He", "everyday."]
  };
  value: number[] | undefined; // chosen indices in order
  onChange: (order: number[]) => void;
  result?: {
    isCorrect: boolean;
    correctAnswer: { order: number[] };
    explanation?: string;
  };
}

export function ReorderQuestion({ id, content, value = [], onChange, result }: ReorderProps) {
  const isSubmitted = !!result;

  const handleSelectToken = (idx: number) => {
    if (isSubmitted) return;
    if (value.includes(idx)) return;
    onChange([...value, idx]);
  };

  const handleRemoveToken = (position: number) => {
    if (isSubmitted) return;
    const updated = value.filter((_, i) => i !== position);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <p className="font-bold text-lg text-ink-900 leading-relaxed">
        Sắp xếp các từ thành câu hoàn chỉnh:
      </p>

      {/* Answer Slots Line */}
      <div className="min-h-[64px] p-3 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF]/40 flex flex-wrap gap-2 items-center">
        {value.length === 0 ? (
          <span className="text-sm font-semibold text-ink-500/60 select-none">
            Nhấn vào các từ bên dưới để ghép câu...
          </span>
        ) : (
          value.map((tokenIdx, pos) => (
            <button
              key={pos}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleRemoveToken(pos)}
              className="bg-white border-2 border-capy-primary text-capy-primary font-bold px-3.5 py-1.5 rounded-xl shadow-sm text-sm hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all cursor-pointer"
            >
              {content.tokens[tokenIdx]}
            </button>
          ))
        )}
      </div>

      {/* Available Tokens Pool */}
      <div className="flex flex-wrap gap-2.5 pt-2">
        {content.tokens.map((token, idx) => {
          const isChosen = value.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted || isChosen}
              onClick={() => handleSelectToken(idx)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all",
                isChosen
                  ? "border-gray-200 bg-gray-100 text-transparent select-none cursor-default"
                  : "border-capy-border bg-white text-ink-900 hover:border-capy-primary hover:bg-[#EEF2FF] shadow-sm cursor-pointer"
              )}
            >
              {token}
            </button>
          );
        })}
      </div>

      {result && (
        <div
          className={cn(
            "p-4 rounded-2xl text-sm leading-relaxed",
            result.isCorrect ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-red-50 text-red-900 border border-red-200"
          )}
        >
          <p className="font-bold mb-1">
            {result.isCorrect ? "🎉 Bạn sắp xếp chính xác!" : "❌ Chưa chính xác!"}
          </p>
          {!result.isCorrect && (
            <p className="mb-1 font-semibold">
              Câu đúng:{" "}
              <span className="underline">
                {result.correctAnswer.order.map((i) => content.tokens[i]).join(" ")}
              </span>
            </p>
          )}
          {result.explanation && <p>{result.explanation}</p>}
        </div>
      )}
    </div>
  );
}
