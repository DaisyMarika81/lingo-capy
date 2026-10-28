"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TrueFalseProps {
  id: string;
  content: {
    statement: string;
  };
  value: boolean | undefined;
  onChange: (val: boolean) => void;
  result?: {
    isCorrect: boolean;
    correctAnswer: { correct: boolean };
    explanation?: string;
  };
}

export function TrueFalseQuestion({ id, content, value, onChange, result }: TrueFalseProps) {
  const isSubmitted = !!result;

  return (
    <div className="space-y-4">
      <p className="font-bold text-lg text-ink-900 leading-relaxed">
        {content.statement}
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-[360px]">
        {[
          { label: "Đúng (True)", val: true },
          { label: "Sai (False)", val: false },
        ].map((item) => {
          const isSelected = value === item.val;
          const isThisCorrect = result?.correctAnswer.correct === item.val;
          const isThisWrongSelected = isSubmitted && isSelected && !result.isCorrect;

          let btnStyle = "border-capy-border bg-white text-ink-900 hover:border-capy-primary hover:bg-[#EEF2FF]/40";
          if (isSelected && !isSubmitted) {
            btnStyle = "border-capy-primary bg-indigo-50/70 text-capy-primary font-bold shadow-sm";
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
              key={String(item.val)}
              type="button"
              disabled={isSubmitted}
              onClick={() => onChange(item.val)}
              className={cn(
                "py-3.5 px-6 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2",
                btnStyle
              )}
            >
              {item.label}
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
