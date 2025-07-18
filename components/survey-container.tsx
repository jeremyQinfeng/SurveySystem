"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSurvey } from "../hooks/use-survey"
import { MultipleChoiceQuestion } from "./multiple-choice-question"
import { TrueFalseQuestion } from "./true-false-question"
import { TextQuestion } from "./text-question"
import { ThankYouScreen } from "./thank-you-screen"
import { RatingQuestion } from "./rating-question"

export function SurveyContainer() {
  // 这里填写实际的 formId
  const formId = "f0204bf3-4565-4afb-8029-6c6fbfb29fab"
  const {
    surveyState,
    getCurrentQuestion,
    getTotalQuestions,
    getProgress,
    canProceed,
    nextQuestion,
    previousQuestion,
    setAnswer,
    loading,
    error,
    submitSurvey,
    submitLoading,
    submitError,
    submitSuccess,
  } = useSurvey(formId)

  const [hasSubmitted, setHasSubmitted] = useState(false)
  const currentQuestion = getCurrentQuestion() // MongoQuestion

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (canProceed()) {
        nextQuestion()
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [surveyState.currentQuestion, surveyState.answers])

  useEffect(() => {
    // 问卷完成时自动提交
    if (surveyState.isCompleted && !hasSubmitted) {
      submitSurvey()
      setHasSubmitted(true)
    }
  }, [surveyState.isCompleted, hasSubmitted, submitSurvey])

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

  const renderQuestion = () => {
    if (!currentQuestion) {
      return <div className="text-white text-center py-20">加载中...</div>;
    }
    if (currentQuestion.type === "thank-you") {
      // 感谢页，显示提交结果
      if (submitLoading) {
        return <div className="text-white text-center py-20">提交中...</div>
      }
      if (submitError) {
        return <div className="text-red-500 text-center py-20">提交失败：{submitError}</div>
      }
      if (submitSuccess) {
        return <ThankYouScreen title={currentQuestion.title} subtitle={currentQuestion.description} />
      }
      // 默认感谢页
      return <div className="text-white text-center py-20">感谢您的填写！</div>
    }
    switch (currentQuestion.type) {
      case "single-choice":
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            answer={surveyState.answers[currentQuestion.id]}
            onAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
            onNext={nextQuestion}
          />
        )
      case "true-false":
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            answer={surveyState.answers[currentQuestion.id]}
            onAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
            onNext={nextQuestion}
          />
        )
      case "text":
      case "textarea":
        return (
          <TextQuestion
            question={currentQuestion}
            answer={surveyState.answers[currentQuestion.id] || ""}
            onAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
            onNext={nextQuestion}
          />
        )
      case "rating":
        return (
          <RatingQuestion
            question={currentQuestion}
            answer={surveyState.answers[currentQuestion.id] || 0}
            onAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
            onNext={nextQuestion}
          />
        )
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
      <div className="absolute inset-0 bg-black/50" />

      {/* Loading/Error 状态优先渲染 */}
      {loading ? (
        <div className="z-10 text-white text-xl">问卷加载中...</div>
      ) : error ? (
        <div className="z-10 text-red-500 text-xl">加载失败：{error}</div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
            <motion.div
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Navigation */}
          {surveyState.currentQuestion > 0 && !surveyState.isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 text-white hover:bg-white/20"
              onClick={previousQuestion}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}

          {/* Question content */}
          <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
            <AnimatePresence mode="wait" custom={1}>
              <motion.div
                key={surveyState.currentQuestion}
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {renderQuestion()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Question counter */}
          {surveyState.currentQuestion > 0 && !surveyState.isCompleted && (
            <div className="absolute bottom-4 right-4 text-white/70 text-sm">
              {surveyState.currentQuestion} of {getTotalQuestions()}
            </div>
          )}
        </>
      )}
    </div>
  )
}
