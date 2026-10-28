"use client";

import React from "react";
import { McqQuestion } from "./McqQuestion";
import { FillBlankQuestion } from "./FillBlankQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { MatchingQuestion } from "./MatchingQuestion";
import { ReorderQuestion } from "./ReorderQuestion";

export interface QuestionProps {
  question: {
    id: string;
    type: "mcq" | "fill_blank" | "true_false" | "matching" | "reorder";
    content: any;
  };
  value: any;
  onChange: (val: any) => void;
  result?: {
    isCorrect: boolean;
    correctAnswer: any;
    explanation?: string;
  };
}

export function QuestionRenderer({ question, value, onChange, result }: QuestionProps) {
  switch (question.type) {
    case "mcq":
      return (
        <McqQuestion
          id={question.id}
          content={question.content}
          value={value}
          onChange={onChange}
          result={result}
        />
      );
    case "fill_blank":
      return (
        <FillBlankQuestion
          id={question.id}
          content={question.content}
          value={value}
          onChange={onChange}
          result={result}
        />
      );
    case "true_false":
      return (
        <TrueFalseQuestion
          id={question.id}
          content={question.content}
          value={value}
          onChange={onChange}
          result={result}
        />
      );
    case "matching":
      return (
        <MatchingQuestion
          id={question.id}
          content={question.content}
          value={value}
          onChange={onChange}
          result={result}
        />
      );
    case "reorder":
      return (
        <ReorderQuestion
          id={question.id}
          content={question.content}
          value={value}
          onChange={onChange}
          result={result}
        />
      );
    default:
      return <div>Dạng câu hỏi chưa được hỗ trợ.</div>;
  }
}
