"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { MongoQuestion } from "../types/survey"

interface RatingQuestionProps {
  question: MongoQuestion
  answer: number
  onAnswer: (answer: number) => void
  onNext: () => void
}

export function RatingQuestion({ question, answer, onAnswer, onNext }: RatingQuestionProps) {
  const max = question.max || 5
  return (
    <div className="text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
      {question.description && <p className="text-xl text-white/80 mb-8">{question.description}</p>}
      <div className="flex space-x-4 my-6">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i + 1}
            className={`w-12 h-12 rounded-full border-2 text-xl font-bold transition-all ${
              answer === i + 1
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
            }`}
            onClick={() => onAnswer(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          disabled={!answer}
          onClick={onNext}
        >
          下一步
        </Button>
      </div>
      <div className="flex justify-between mt-2 text-sm text-white/60">
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>
    </div>
  )
}
