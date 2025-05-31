import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { DiaryEntry, Meal, FoodEntry } from "@/shared/types"

interface CreateMealRequest {
  date: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  time: string
}

interface AddFoodToMealRequest {
  mealId: number
  foodId: number
  amount: number
}

export const diaryApi = createApi({
  reducerPath: "diaryApi",
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
  tagTypes: ["DiaryEntry", "Meal"],
  endpoints: (builder) => ({
    getDiaryEntry: builder.query<DiaryEntry, string>({
      query: (date) => `/diary/${date}`,
      providesTags: ["DiaryEntry"],
    }),
    createMeal: builder.mutation<Meal, CreateMealRequest>({
      query: (mealData) => ({
        url: "/diary/meals",
        method: "POST",
        body: mealData,
      }),
      invalidatesTags: ["DiaryEntry"],
    }),
    updateMeal: builder.mutation<Meal, Partial<Meal> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/diary/meals/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["DiaryEntry", "Meal"],
    }),
    deleteMeal: builder.mutation<void, number>({
      query: (mealId) => ({
        url: `/diary/meals/${mealId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DiaryEntry"],
    }),
    addFoodToMeal: builder.mutation<FoodEntry, AddFoodToMealRequest>({
      query: (data) => ({
        url: "/diary/meals/foods",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DiaryEntry", "Meal"],
    }),
    removeFoodFromMeal: builder.mutation<void, { mealId: number; foodEntryId: number }>({
      query: ({ mealId, foodEntryId }) => ({
        url: `/diary/meals/${mealId}/foods/${foodEntryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DiaryEntry", "Meal"],
    }),
  }),
})

export const {
  useGetDiaryEntryQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  useAddFoodToMealMutation,
  useRemoveFoodFromMealMutation,
} = diaryApi
