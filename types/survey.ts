export interface Option {
  value: string
  label: string
  _id?: string
}

export type QuestionType =
  | "text"
  | "single-choice"
  | "multiple-choice"
  | "rating"
  | "textarea"
  | "welcome"
  | "thank-you"
  | "true-false";

export interface MongoQuestion {
  id: string
  type: QuestionType
  title: string
  description?: string
  placeholder?: string
  required: boolean
  options?: Option[]
  max?: number
  minLabel?: string
  maxLabel?: string
  _id?: string
}

export interface SurveySettings {
  allowAnonymous: boolean
  requireCaptcha: boolean
  maxSubmissions: number
  active: boolean
  allowEdit: boolean
  showProgress: boolean
}

export interface SurveyData {
  _id: string
  formId: string
  publisherId: string | null
  title: string
  description: string
  questions: MongoQuestion[]
  settings: SurveySettings
  createdAt: string
  updatedAt: string
  __v: number
}

export interface SurveyResponse {
  questionId: string
  answer: string | boolean | string[] | number
  timestamp: Date
}

export interface SurveyState {
  currentQuestion: number
  answers: Record<string, any>
  isCompleted: boolean
}
