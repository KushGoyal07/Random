import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTab: 'interviewee',
  showWelcomeModal: false,
  isLoading: false,
  selectedCandidate: null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setShowWelcomeModal: (state, action) => {
      state.showWelcomeModal = action.payload
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload
    }
  }
})

export const { 
  setActiveTab, 
  setShowWelcomeModal, 
  setIsLoading, 
  setSelectedCandidate 
} = uiSlice.actions

export default uiSlice.reducer
