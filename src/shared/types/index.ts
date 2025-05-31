export interface User {
  id: number
  email: string
  name: string
  role: "user" | "admin"
  profile?: UserProfile
  goals?: NutritionGoals
  settings?: UserSettings
}

export interface UserProfile {
  age?: number
  height?: number
  weight?: number
  gender?: "male" | "female"
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active"
}

export interface NutritionGoals {
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface UserSettings {
  theme: "light" | "dark" | "system"
  language: "ru" | "en"
  notifications: boolean
  timezone: string
}

export interface Food {
  id: number
  name: string
  category: string
  calories: number
  protein: number
  fat: number
  carbs: number
  fiber?: number
  sugar?: number
  sodium?: number
  per100g: boolean
  barcode?: string
  brand?: string
}

export interface FoodEntry {
  id: number
  foodId: number
  food: Food
  amount: number
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface Meal {
  id: number
  type: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  time: string
  foods: FoodEntry[]
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
}

export interface DiaryEntry {
  id: number
  userId: number
  date: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
  water?: number
  notes?: string
}

export interface NutritionStats {
  period: "day" | "week" | "month"
  avgCalories: number
  avgProtein: number
  avgFat: number
  avgCarbs: number
  goalAchievement: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
}
