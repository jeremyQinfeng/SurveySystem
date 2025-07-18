"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Question {
  id: number
  type: "welcome" | "multiple-choice" | "text" | "email" | "rating" | "thank-you"
  title: string
  subtitle?: string
  options?: string[]
  required?: boolean
}

const questions: Question[] = [
  {
    id: 0,
    type: "welcome",
    title: "Welcome to our survey",
    subtitle: "We'd love to hear your thoughts and feedback",
  },
  {
    id: 1,
    type: "multiple-choice",
    title: "How did you hear about us?",
    subtitle: "Select one option",
    options: ["Social Media", "Friend Referral", "Google Search", "Advertisement", "Other"],
    required: true,
  },
  {
    id: 2,
    type: "rating",
    title: "How would you rate your experience?",
    subtitle: "Rate from 1 to 5",
    required: true,
  },
  {
    id: 3,
    type: "multiple-choice",
    title: "Which features do you find most valuable?",
    subtitle: "Choose all that apply",
    options: ["User Interface", "Performance", "Customer Support", "Pricing", "Features"],
    required: true,
  },
  {
    id: 4,
    type: "text",
    title: "What could we improve?",
    subtitle: "Your feedback helps us grow",
    required: false,
  },
  {
    id: 5,
    type: "email",
    title: "Stay in touch",
    subtitle: "Enter your email to receive updates",
    required: false,
  },
  {
    id: 6,
    type: "thank-you",
    title: "Thank you!",
    subtitle: "Your feedback has been submitted successfully",
  },
]

export default function SurveyForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [direction, setDirection] = useState(1)

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1)
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (canProceed()) {
        handleNext()
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentQuestion, answers])

  const canProceed = () => {
    const question = questions[currentQuestion]
    if (!question.required) return true
    return answers[question.id] !== undefined && answers[question.id] !== ""
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "welcome":
        return <WelcomeScreen title={question.title} subtitle={question.subtitle} onNext={handleNext} />

      case "multiple-choice":
        return (
          <MultipleChoice
            question={question}
            answer={answers[question.id]}
            onAnswer={(answer) => handleAnswer(question.id, answer)}
            onNext={handleNext}
          />
        )

      case "rating":
        return (
          <RatingQuestion
            question={question}
            answer={answers[question.id]}
            onAnswer={(answer) => handleAnswer(question.id, answer)}
            onNext={handleNext}
          />
        )

      case "text":
        return (
          <TextQuestion
            question={question}
            answer={answers[question.id] || ""}
            onAnswer={(answer) => handleAnswer(question.id, answer)}
            onNext={handleNext}
          />
        )

      case "email":
        return (
          <EmailQuestion
            question={question}
            answer={answers[question.id] || ""}
            onAnswer={(answer) => handleAnswer(question.id, answer)}
            onNext={handleNext}
          />
        )

      case "thank-you":
        return <ThankYouScreen title={question.title} subtitle={question.subtitle} />

      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url(/hexagonal-background.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${(currentQuestion / (questions.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Navigation */}
      {currentQuestion > 0 && currentQuestion < questions.length - 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}

      {/* Question content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {renderQuestion(questions[currentQuestion])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Question counter */}
      {currentQuestion > 0 && currentQuestion < questions.length - 1 && (
        <div className="absolute bottom-4 right-4 text-white/70 text-sm">
          {currentQuestion} of {questions.length - 2}
        </div>
      )}
    </div>
  )
}

function WelcomeScreen({ title, subtitle, onNext }: { title: string; subtitle?: string; onNext: () => void }) {
  return (
    <motion.div
      className="text-center text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
      {subtitle && <p className="text-xl md:text-2xl mb-12 text-white/80">{subtitle}</p>}
      <Button
        size="lg"
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full"
        onClick={onNext}
      >
        Get Started
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
      <p className="text-white/60 mt-4">Press Enter ↵</p>
    </motion.div>
  )
}

function MultipleChoice({
  question,
  answer,
  onAnswer,
  onNext,
}: {
  question: Question
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}) {
  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
        {question.subtitle && <p className="text-xl text-white/80 mb-8">{question.subtitle}</p>}
      </motion.div>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              answer === option
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
            }`}
            onClick={() => {
              onAnswer(option)
              setTimeout(onNext, 300)
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">{option}</span>
              {answer === option && <Check className="w-5 h-5" />}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function RatingQuestion({
  question,
  answer,
  onAnswer,
  onNext,
}: {
  question: Question
  answer: number
  onAnswer: (answer: number) => void
  onNext: () => void
}) {
  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
        {question.subtitle && <p className="text-xl text-white/80 mb-8">{question.subtitle}</p>}
      </motion.div>

      <div className="flex justify-center space-x-4 mb-8">
        {[1, 2, 3, 4, 5].map((rating) => (
          <motion.button
            key={rating}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + rating * 0.1 }}
            className={`w-16 h-16 rounded-full border-2 text-xl font-bold transition-all duration-200 ${
              answer === rating
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
            }`}
            onClick={() => {
              onAnswer(rating)
              setTimeout(onNext, 300)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {rating}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between text-white/60 text-sm">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  )
}

function TextQuestion({
  question,
  answer,
  onAnswer,
  onNext,
}: {
  question: Question
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}) {
  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
        {question.subtitle && <p className="text-xl text-white/80 mb-8">{question.subtitle}</p>}
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

function EmailQuestion({
  question,
  answer,
  onAnswer,
  onNext,
}: {
  question: Question
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}) {
  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{question.title}</h2>
        {question.subtitle && <p className="text-xl text-white/80 mb-8">{question.subtitle}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Input
          type="email"
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="your@email.com"
          className="w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 text-lg p-4 h-14"
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

function ThankYouScreen({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      className="text-center text-white"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
      {subtitle && <p className="text-xl md:text-2xl text-white/80">{subtitle}</p>}
    </motion.div>
  )
}
