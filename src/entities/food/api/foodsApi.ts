import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Food } from "@/shared/types"

interface FoodsResponse {
  foods: Food[]
  total: number
  page: number
  limit: number
}

interface SearchFoodsParams {
  query?: string
  category?: string
  page?: number
  limit?: number
}

export const foodsApi = createApi({
  reducerPath: "foodsApi",
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
  tagTypes: ["Food", "Favorites"],
  endpoints: (builder) => ({
    getFoods: builder.query<FoodsResponse, SearchFoodsParams>({
      query: ({ query = "", category = "", page = 1, limit = 20 }) => ({
        url: "/foods",
        params: { query, category, page, limit },
      }),
      providesTags: ["Food"],
    }),
    getFoodById: builder.query<Food, number>({
      query: (id) => `/foods/${id}`,
      providesTags: ["Food"],
    }),
    getFavorites: builder.query<Food[], void>({
      query: () => "/foods/favorites",
      providesTags: ["Favorites"],
    }),
    addToFavorites: builder.mutation<void, number>({
      query: (foodId) => ({
        url: `/foods/${foodId}/favorite`,
        method: "POST",
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFromFavorites: builder.mutation<void, number>({
      query: (foodId) => ({
        url: `/foods/${foodId}/favorite`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
})

export const {
  useGetFoodsQuery,
  useGetFoodByIdQuery,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = foodsApi
