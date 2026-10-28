"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface McqProps {
  id: string;
  content: {
    prompt: string;
    options: string[];
  };
  value: number | undefined;
  onChange: (val: number) => void;
  result?: {
    isCorrect: boolean;
    correctAnswer: { correct: number };
    explanation?: string;
  };
}

export function McqQuestion({ id, content, value, onChange, result }: McqProps) {
  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div className="space-y-4">
      <p className="font-bold text-lg text-ink-900 leading-relaxed">
        {content.prompt}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {content.options.map((opt, idx) => {
          const isSelected = value === idx;
          const isSubmitted = !!result;
          const isThisCorrect = result?.correctAnswer.correct === idx;
          const isThisWrongSelected = isSubmitted && isSelected && !result.isCorrect;

          let btnStyle = "border-capy-border bg-white text-ink-900 hover:border-capy-primary hover:bg-[#EEF2FF]/40";
          if (isSelected && !isSubmitted) {
            btnStyle = "border-capy-primary bg-indigo-50/70 text-capy-primary shadow-sm";
          }
          if (isSubmitted) {
            if (isThisCorrect) {
              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
            } else if (isThisWrongSelected) {
              btnStyle = "border-red-500 bg-red-50 text-red-800 font-bold";
            } else {
              btnStyle = "border-gray-200 bg-gray-50 text-gray-400 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => onChange(idx)}
              className={cn(
                "p-4 rounded-2xl border-2 text-left font-medium transition-all flex items-center gap-3",
                btnStyle
              )}
            >
              <span
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                  isSelected
                    ? "bg-capy-primary text-white"
                    : "bg-gray-100 text-ink-700"
                )}
              >
                {letters[idx]}
              </span>
              <span className="flex-1">{opt}</span>
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
            {result.isCorrect ? "🎉 Chính xác!" : "❌ Chưa chính xác!"}
          </p>
          {result.explanation && <p>{result.explanation}</p>}
        </div>
      )}
    </div>
  );
}
