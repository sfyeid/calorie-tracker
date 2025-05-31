import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UserProfile, NutritionGoals, NutritionStats } from "@/shared/types"

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["User", "Profile", "Goals", "Stats"],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (profileData) => ({
        url: "/user/profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Profile", "Goals"],
    }),
    getGoals: builder.query<NutritionGoals, void>({
      query: () => "/user/goals",
      providesTags: ["Goals"],
    }),
    updateGoals: builder.mutation<NutritionGoals, Partial<NutritionGoals>>({
      query: (goals) => ({
        url: "/user/goals",
        method: "PATCH",
        body: goals,
      }),
      invalidatesTags: ["Goals"],
    }),
    getStats: builder.query<NutritionStats, { period: "day" | "week" | "month" }>({
      query: ({ period }) => `/user/stats?period=${period}`,
      providesTags: ["Stats"],
    }),
    calculateGoals: builder.mutation<NutritionGoals, UserProfile>({
      query: (profile) => ({
        url: "/user/calculate-goals",
        method: "POST",
        body: profile,
      }),
    }),
  }),
})

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetGoalsQuery,
  useUpdateGoalsMutation,
  useGetStatsQuery,
  useCalculateGoalsMutation,
} = userApi
