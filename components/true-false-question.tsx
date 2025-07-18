"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import type { MongoQuestion } from "../types/survey"

interface TrueFalseQuestionProps {
  question: MongoQuestion
  answer: boolean | undefined
  onAnswer: (answer: boolean) => void
  onNext: () => void
}

export function TrueFalseQuestion({ question, answer, onAnswer, onNext }: TrueFalseQuestionProps) {
  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
        {question.description && <p className="text-xl text-white/80 mb-8">{question.description}</p>}
      </motion.div>

      <div className="flex justify-center space-x-6">
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center justify-center w-32 h-32 rounded-full border-4 transition-all duration-200 ${
            answer === true
              ? "bg-green-500 border-green-500 text-white"
              : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
          }`}
          onClick={() => {
            onAnswer(true)
            setTimeout(onNext, 300)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <Check className="w-8 h-8 mx-auto mb-2" />
            <span className="text-lg font-semibold">True</span>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center justify-center w-32 h-32 rounded-full border-4 transition-all duration-200 ${
            answer === false
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
          }`}
          onClick={() => {
            onAnswer(false)
            setTimeout(onNext, 300)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <X className="w-8 h-8 mx-auto mb-2" />
            <span className="text-lg font-semibold">False</span>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
