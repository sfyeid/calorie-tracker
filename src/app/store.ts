import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { authApi } from "@/entities/auth/api/authApi"
import { foodsApi } from "@/entities/food/api/foodsApi"
import { diaryApi } from "@/entities/diary/api/diaryApi"
import { userApi } from "@/entities/user/api/userApi"

import { authSlice } from "@/entities/auth/model/authSlice"
import { themeSlice } from "@/entities/theme/model/themeSlice"
import { diarySlice } from "@/entities/diary/model/diarySlice"

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    theme: themeSlice.reducer,
    diary: diarySlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [foodsApi.reducerPath]: foodsApi.reducer,
    [diaryApi.reducerPath]: diaryApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, foodsApi.middleware, diaryApi.middleware, userApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
