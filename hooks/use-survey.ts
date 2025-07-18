"use client"

import { useState, useCallback, useEffect } from "react"
import type { SurveyData, MongoQuestion, SurveyState, SurveyResponse } from "../types/survey"
import { fetchFormStructure, submitSurvey as apiSubmitSurvey } from "../lib/api"

// Helper: always append a virtual thank-you question
const getSurveyQuestionsWithThankYou = (questions: MongoQuestion[]): MongoQuestion[] => [
  ...questions,
  {
    id: "thank-you",
    type: "thank-you",
    title: "感谢完成本次调查问卷！",
    description: "您的反馈对我们非常重要，感谢您的参与。",
    required: false,
    options: [],
  },
]

export function useSurvey(formId: string) {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (!formId) {
      setSurveyData(null)
      setError('未提供问卷ID')
      setLoading(false)
      return
    }
    setLoading(true)
    fetchFormStructure(formId)
      .then((data) => {
        setSurveyData(data)
        setError(null)
      })
      .catch((e) => {
        setError(e.message)
        setSurveyData(null)
      })
      .finally(() => setLoading(false))
  }, [formId])

  // Use questions with thank-you appended
  const questions = getSurveyQuestionsWithThankYou(surveyData?.questions || [])

  const [surveyState, setSurveyState] = useState<SurveyState>({
    currentQuestion: 0,
    answers: {},
    isCompleted: false,
  })

  const [responses, setResponses] = useState<SurveyResponse[]>([])

  const getCurrentQuestion = useCallback((): MongoQuestion | undefined => {
    return questions[surveyState.currentQuestion]
  }, [surveyState.currentQuestion, questions])

  const getTotalQuestions = useCallback((): number => {
    return questions.length - 1 // exclude thank-you for progress
  }, [questions])

  const getProgress = useCallback((): number => {
    if (surveyState.currentQuestion === 0) return 0
    if (surveyState.currentQuestion >= questions.length - 1) return 100
    return (surveyState.currentQuestion / (questions.length - 1)) * 100
  }, [surveyState.currentQuestion, questions])

  const canProceed = useCallback((): boolean => {
    const question = getCurrentQuestion()
    if (!question || !question.required) return true
    return surveyState.answers[question.id] !== undefined && surveyState.answers[question.id] !== ""
  }, [getCurrentQuestion, surveyState.answers])

  const nextQuestion = useCallback(() => {
    if (surveyState.currentQuestion < questions.length - 1) {
      setSurveyState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        isCompleted: prev.currentQuestion + 1 === questions.length - 1,
      }))
    }
  }, [surveyState.currentQuestion, questions])

  const previousQuestion = useCallback(() => {
    if (surveyState.currentQuestion > 0) {
      setSurveyState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        isCompleted: false,
      }))
    }
  }, [surveyState.currentQuestion])

  const setAnswer = useCallback((questionId: string, answer: any) => {
    setSurveyState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }))

    // Add to responses array for tracking
    const newResponse: SurveyResponse = {
      questionId,
      answer,
      timestamp: new Date(),
    }

    setResponses((prev) => {
      const filtered = prev.filter((r) => r.questionId !== questionId)
      return [...filtered, newResponse]
    })
  }, [])

  const resetSurvey = useCallback(() => {
    setSurveyState({
      currentQuestion: 0,
      answers: {},
      isCompleted: false,
    })
    setResponses([])
  }, [])

  const submitSurvey = useCallback(async (submitterInfo?: { name?: string; email?: string }) => {
    setSubmitLoading(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      if (!surveyData?.formId) throw new Error('表单ID缺失')
      const payload = {
        formId: surveyData.formId,
        submissionData: surveyState.answers,
        submitterInfo,
      }
      await apiSubmitSurvey(payload)
      setSubmitSuccess(true)
    } catch (e: any) {
      setSubmitError(e.message)
    } finally {
      setSubmitLoading(false)
    }
  }, [surveyData, surveyState.answers])

  return {
    surveyState,
    getCurrentQuestion,
    getTotalQuestions,
    getProgress,
    canProceed,
    nextQuestion,
    previousQuestion,
    setAnswer,
    resetSurvey,
    submitSurvey,
    responses,
    surveyInfo: surveyData,
    loading,
    error,
    submitLoading,
    submitError,
    submitSuccess,
  } 
}
