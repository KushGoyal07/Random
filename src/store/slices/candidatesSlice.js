import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  candidates: [],
  searchTerm: '',
  sortBy: 'score',
  sortOrder: 'desc'
}

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      const existingIndex = state.candidates.findIndex(
        c => c.id === action.payload.id
      )
      if (existingIndex >= 0) {
        state.candidates[existingIndex] = action.payload
      } else {
        state.candidates.push(action.payload)
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    }
  }
})

export const {
  addCandidate,
  setSearchTerm,
  setSortBy,
  setSortOrder
} = candidatesSlice.actions

export default candidatesSlice.reducer
