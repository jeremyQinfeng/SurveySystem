"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { MongoQuestion } from "../types/survey"

interface TextQuestionProps {
  question: MongoQuestion
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}

export function TextQuestion({ question, answer, onAnswer, onNext }: TextQuestionProps) {
  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
        {question.description && <p className="text-xl text-white/80 mb-8">{question.description}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Textarea
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 text-lg p-4 min-h-[120px] resize-none"
          autoFocus
        />

        <div className="flex justify-between items-center mt-4">
          <p className="text-white/60 text-sm">Press Enter to continue</p>
          <Button onClick={onNext} className="bg-orange-500 hover:bg-orange-600">
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
