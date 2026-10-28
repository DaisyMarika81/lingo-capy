"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface MatchingProps {
  id: string;
  content: {
    left: string[];
    right: string[];
  };
  value: [number, number][] | undefined; // array of pairs [leftIdx, rightIdx]
  onChange: (pairs: [number, number][]) => void;
  result?: {
    isCorrect: boolean;
    correctAnswer: { pairs: [number, number][] };
    explanation?: string;
  };
}

export function MatchingQuestion({ id, content, value = [], onChange, result }: MatchingProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const isSubmitted = !!result;

  const handleLeftClick = (lIdx: number) => {
    if (isSubmitted) return;
    setSelectedLeft(lIdx === selectedLeft ? null : lIdx);
  };

  const handleRightClick = (rIdx: number) => {
    if (isSubmitted || selectedLeft === null) return;

    // Check if pair already exists or if left/right was mapped
    const newPairs = value.filter(
      (p) => p[0] !== selectedLeft && p[1] !== rIdx
    );
    newPairs.push([selectedLeft, rIdx]);
    onChange(newPairs);
    setSelectedLeft(null);
  };

  const removePair = (pairIndex: number) => {
    if (isSubmitted) return;
    const newPairs = value.filter((_, idx) => idx !== pairIndex);
    onChange(newPairs);
  };

  // Pair colors
  const pairColors = [
    "bg-indigo-100 text-indigo-800 border-indigo-300",
    "bg-amber-100 text-amber-800 border-amber-300",
    "bg-emerald-100 text-emerald-800 border-emerald-300",
    "bg-purple-100 text-purple-800 border-purple-300",
  ];

  return (
    <div className="space-y-4">
      <p className="font-bold text-lg text-ink-900 leading-relaxed">
        Ghép các cụm từ tương ứng ở 2 cột:
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2">Cột A</p>
          {content.left.map((item, lIdx) => {
            const pairIdx = value.findIndex((p) => p[0] === lIdx);
            const isPaired = pairIdx !== -1;
            const isSelected = selectedLeft === lIdx;

            return (
              <button
                key={lIdx}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleLeftClick(lIdx)}
                className={cn(
                  "w-full p-3.5 rounded-2xl border-2 text-left font-semibold text-sm transition-all flex items-center justify-between",
                  isSelected
                    ? "border-capy-primary bg-indigo-50 text-capy-primary ring-2 ring-indigo-200"
                    : isPaired
                    ? pairColors[pairIdx % pairColors.length]
                    : "border-capy-border bg-white text-ink-900 hover:border-capy-primary"
                )}
              >
                <span>{item}</span>
                {isPaired && <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/70">#{pairIdx + 1}</span>}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2">Cột B</p>
          {content.right.map((item, rIdx) => {
            const pairIdx = value.findIndex((p) => p[1] === rIdx);
            const isPaired = pairIdx !== -1;

            return (
              <button
                key={rIdx}
                type="button"
                disabled={isSubmitted || (selectedLeft === null && !isPaired)}
                onClick={() => handleRightClick(rIdx)}
                className={cn(
                  "w-full p-3.5 rounded-2xl border-2 text-left font-semibold text-sm transition-all flex items-center justify-between",
                  isPaired
                    ? pairColors[pairIdx % pairColors.length]
                    : selectedLeft !== null
                    ? "border-dashed border-capy-primary bg-indigo-50/50 text-ink-900 hover:bg-indigo-100/50 cursor-pointer"
                    : "border-capy-border bg-gray-50 text-ink-500"
                )}
              >
                <span>{item}</span>
                {isPaired && <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/70">#{pairIdx + 1}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear pairs / status */}
      {!isSubmitted && value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          Xóa các cặp đã ghép
        </button>
      )}

      {result && (
        <div
          className={cn(
            "p-4 rounded-2xl text-sm leading-relaxed",
            result.isCorrect ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-red-50 text-red-900 border border-red-200"
          )}
        >
          <p className="font-bold mb-1">
            {result.isCorrect ? "🎉 Bạn đã ghép chính xác toàn bộ!" : "❌ Có cặp ghép chưa chính xác!"}
          </p>
          {result.explanation && <p>{result.explanation}</p>}
        </div>
      )}
    </div>
  );
}
