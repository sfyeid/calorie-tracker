import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/shared/types"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: Boolean(localStorage.getItem("token")),
  isLoading: false,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions
