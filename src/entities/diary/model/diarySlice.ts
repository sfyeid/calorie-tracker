import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DiaryEntry } from "@/shared/types"

interface DiaryState {
  currentDate: string
  entries: Record<string, DiaryEntry>
  isLoading: boolean
}

const initialState: DiaryState = {
  currentDate: new Date().toISOString().split("T")[0],
  entries: {},
  isLoading: false,
}

export const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload
    },
    setDiaryEntry: (state, action: PayloadAction<DiaryEntry>) => {
      state.entries[action.payload.date] = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCurrentDate, setDiaryEntry, setLoading } = diarySlice.actions
