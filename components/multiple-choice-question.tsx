"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { MongoQuestion, Option } from "../types/survey"

interface MultipleChoiceQuestionProps {
  question: MongoQuestion
  answer: string | string[]
  onAnswer: (answer: string | string[]) => void
  onNext: () => void
}

export function MultipleChoiceQuestion({ question, answer, onAnswer, onNext }: MultipleChoiceQuestionProps) {
  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
        {question.description && <p className="text-xl text-white/80 mb-8">{question.description}</p>}
      </motion.div>

      <div className="space-y-3">
        {question.options?.map((option: Option, index: number) => (
          <motion.button
            key={option._id || option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              (Array.isArray(answer) ? answer.includes(option.value) : answer === option.value)
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
            }`}
            onClick={() => {
              if (question.type === "multiple-choice") {
                if (Array.isArray(answer)) {
                  if (answer.includes(option.value)) {
                    onAnswer(answer.filter((v) => v !== option.value))
                  } else {
                    onAnswer([...answer, option.value])
                  }
                } else {
                  onAnswer([option.value])
                }
              } else {
                onAnswer(option.value)
                setTimeout(onNext, 300)
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">{option.label}</span>
              {(Array.isArray(answer) ? answer.includes(option.value) : answer === option.value) && <Check className="w-5 h-5" />}
            </div>
          </motion.button>
        ))}
      </div>
      {/* Add Next button for multiple-choice */}
      {question.type === "multiple-choice" && (
        <div className="mt-6 flex justify-end">
          <button
            className={`px-6 py-2 rounded bg-orange-500 text-white font-semibold shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
            disabled={!Array.isArray(answer) || answer.length === 0}
            onClick={onNext}
          >
            下一步
          </button>
        </div>
      )}
    </div>
  )
}
