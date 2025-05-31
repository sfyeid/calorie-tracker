import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type ThemeMode = "light" | "dark" | "system"

interface ThemeState {
  mode: ThemeMode
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme") as ThemeMode
  return saved || "system"
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
      localStorage.setItem("theme", action.payload)
    },
    toggleTheme: (state) => {
      const newMode = state.mode === "light" ? "dark" : "light"
      state.mode = newMode
      localStorage.setItem("theme", newMode)
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions
