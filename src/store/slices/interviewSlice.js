import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentCandidate: null,
  phase: 'upload', // 'upload', 'details', 'interview', 'completed'
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 0,
  isTimerActive: false,
  score: null,
  summary: '',
  hasUnfinishedInterview: false,
  chatHistory: []
}

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentCandidate: (state, action) => {
      state.currentCandidate = action.payload
      state.hasUnfinishedInterview = true
    },
    setPhase: (state, action) => {
      state.phase = action.payload
    },
    setQuestions: (state, action) => {
      state.questions = action.payload
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
      }
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload)
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload
    },
    setIsTimerActive: (state, action) => {
      state.isTimerActive = action.payload
    },
    setScore: (state, action) => {
      state.score = action.payload
    },
    setSummary: (state, action) => {
      state.summary = action.payload
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload)
    },
    resetInterview: (state) => {
      return {
        ...initialState,
        hasUnfinishedInterview: false
      }
    },
    completeInterview: (state) => {
      state.phase = 'completed'
      state.hasUnfinishedInterview = false
    }
  }
})

export const {
  setCurrentCandidate,
  setPhase,
  setQuestions,
  nextQuestion,
  addAnswer,
  setTimeRemaining,
  setIsTimerActive,
  setScore,
  setSummary,
  addChatMessage,
  resetInterview,
  completeInterview
} = interviewSlice.actions

export default interviewSlice.reducer
