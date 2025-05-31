import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { User } from "@/shared/types"

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  user: User
  token: string
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/auth/me",
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi
