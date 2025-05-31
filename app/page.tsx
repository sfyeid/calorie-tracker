"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Chip,
  LinearProgress,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Menu,
  Fade,
  Slide,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  ChevronLeft,
  ChevronRight,
  Today,
  Person as PersonIcon,
} from "@mui/icons-material"
import { styled, alpha } from "@mui/material/styles"
import { useTheme } from "@mui/material/styles"
import { format, addDays, subDays, isToday } from "date-fns"
import { ru } from "date-fns/locale"

// Типы данных
interface User {
  id: number
  email: string
  name: string
}

interface UserProfile {
  age: number
  height: number
  weight: number
  gender: "male" | "female"
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
}

interface NutritionGoals {
  calories: number
  protein: number
  fat: number
  carbs: number
}

interface Food {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  per: string
  favorite: boolean
}

interface FoodEntry {
  id: number
  foodId: number
  food: Food
  amount: number
  calories: number
  protein: number
  fat: number
  carbs: number
}

interface Meal {
  id: number
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  time: string
  foods: FoodEntry[]
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
}

interface DayData {
  date: string
  meals: Meal[]
}

// Стилизованные компоненты
const ModernCard = styled(Card)(({  }) => ({
  borderRadius: 20,
  border: "1px solid",
  borderColor: "rgba(0, 0, 0, 0.06)",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    borderColor: "rgba(0, 0, 0, 0.12)",
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
}))

const GlassCard = styled(Card)(({  }) => ({
  borderRadius: 24,
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.15)",
  },
}))

const StyledProgressBar = styled(LinearProgress)(({  }) => ({
  height: 12,
  borderRadius: 6,
  backgroundColor: "rgba(0, 0, 0, 0.06)",
  "& .MuiLinearProgress-bar": {
    borderRadius: 6,
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  },
}))

const GradientButton = styled(Button)(({  }) => ({
  borderRadius: 16,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  fontWeight: 600,
  textTransform: "none",
  padding: "12px 24px",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
  },
}))

// Начальные данные
const initialFoods: Food[] = [
  { id: 1, name: "Куриная грудка", calories: 165, protein: 31, carbs: 0, fat: 3.6, per: "100г", favorite: true },
  { id: 2, name: "Овсянка", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, per: "100г", favorite: false },
  { id: 3, name: "Банан", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, per: "100г", favorite: true },
  { id: 4, name: "Лосось", calories: 208, protein: 25.4, carbs: 0, fat: 12.4, per: "100г", favorite: false },
  { id: 5, name: "Творог 5%", calories: 121, protein: 18, carbs: 3, fat: 5, per: "100г", favorite: true },
  { id: 6, name: "Гречка", calories: 343, protein: 12.6, carbs: 62, fat: 3.3, per: "100г", favorite: false },
]

const initialProfile: UserProfile = {
  age: 25,
  height: 175,
  weight: 70,
  gender: "male",
  activityLevel: "moderate",
}

// Функция расчета калорий из БЖУ
const calculateCaloriesFromMacros = (protein: number, fat: number, carbs: number): number => {
  return protein * 4 + fat * 9 + carbs * 4
}

// Функция расчета целей питания
const calculateNutritionGoals = (profile: UserProfile): NutritionGoals => {
  let bmr: number
  if (profile.gender === "male") {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  const calories = Math.round(bmr * activityMultipliers[profile.activityLevel])
  const protein = Math.round(profile.weight * 2.2)
  const fat = Math.round((calories * 0.25) / 9)
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

  return { calories, protein, fat, carbs }
}

// Компонент авторизации
function AuthScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Имитация запроса
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Простая проверка для демо
    if (isLogin) {
      if (email === "demo@example.com" && password === "demo123") {
        onLogin({ id: 1, email, name: "Демо Пользователь" })
      } else {
        alert("Неверные данные. Используйте: demo@example.com / demo123")
      }
    } else {
      onLogin({ id: 1, email, name: name || "Новый пользователь" })
    }

    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <GlassCard sx={{ maxWidth: 400, width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                CalorieTracker
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {isLogin ? "Добро пожаловать!" : "Создайте аккаунт"}
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {!isLogin && (
                  <TextField
                    label="Имя"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />
                )}
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
                <TextField
                  label="Пароль"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
                <GradientButton type="submit" fullWidth size="large" disabled={loading}>
                  {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
                </GradientButton>
              </Stack>
            </form>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button onClick={() => setIsLogin(!isLogin)} sx={{ textTransform: "none" }}>
                {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
              </Button>
            </Box>

            {isLogin && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: alpha("#667eea", 0.1), borderRadius: 2 }}>
                <Typography variant="caption" display="block" align="center" color="text.secondary">
                  Демо данные:
                </Typography>
                <Typography variant="caption" display="block" align="center">
                  Email: demo@example.com
                </Typography>
                <Typography variant="caption" display="block" align="center">
                  Пароль: demo123
                </Typography>
              </Box>
            )}
          </CardContent>
        </GlassCard>
      </Slide>
    </Box>
  )
}

// Компонент навигации по дням
function DateNavigation({
  currentDate,
  onDateChange,
}: {
  currentDate: string
  onDateChange: (date: string) => void
}) {
  const date = new Date(currentDate)

  const handlePreviousDay = () => {
    const newDate = subDays(date, 1)
    onDateChange(newDate.toISOString().split("T")[0])
  }

  const handleNextDay = () => {
    const newDate = addDays(date, 1)
    onDateChange(newDate.toISOString().split("T")[0])
  }

  const handleToday = () => {
    const today = new Date()
    onDateChange(today.toISOString().split("T")[0])
  }

  return (
    <GlassCard sx={{ mb: 3 }}>
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <IconButton
            onClick={handlePreviousDay}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "scale(1.1)",
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {format(date, "d MMMM yyyy", { locale: ru })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(date, "EEEE", { locale: ru })}
              </Typography>
            </Box>

            {!isToday(date) && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Today />}
                onClick={handleToday}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Сегодня
              </Button>
            )}
          </Box>

          <IconButton
            onClick={handleNextDay}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "scale(1.1)",
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </CardContent>
    </GlassCard>
  )
}

// Компонент дневника
function DiaryTab({
  currentDate,
  onDateChange,
  dayData,
  foods,
  goals,
  onAddMeal,
  onDeleteMeal,
  onAddFoodToMeal,
  onRemoveFoodFromMeal,
}: {
  currentDate: string
  onDateChange: (date: string) => void
  dayData: DayData | null
  foods: Food[]
  goals: NutritionGoals
  onAddMeal: (date: string, meal: Omit<Meal, "id">) => void
  onDeleteMeal: (date: string, id: number) => void
  onAddFoodToMeal: (date: string, mealId: number, foodEntry: Omit<FoodEntry, "id">) => void
  onRemoveFoodFromMeal: (date: string, mealId: number, foodEntryId: number) => void
}) {
  const [openAddMealDialog, setOpenAddMealDialog] = useState(false)
  const [openAddFoodDialog, setOpenAddFoodDialog] = useState(false)
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [foodAmount, setFoodAmount] = useState("")
  const [newMeal, setNewMeal] = useState({
    name: "",
    type: "" as "breakfast" | "lunch" | "dinner" | "snack" | "",
    time: "",
  })

  const mealTypes = [
    { value: "breakfast", label: "Завтрак", defaultTime: "08:00", emoji: "🍳" },
    { value: "lunch", label: "Обед", defaultTime: "13:00", emoji: "🍽️" },
    { value: "dinner", label: "Ужин", defaultTime: "19:00", emoji: "🍖" },
    { value: "snack", label: "Перекус", defaultTime: "16:00", emoji: "🍎" },
  ]

  const meals = dayData?.meals || []
  const totalConsumed = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      fat: acc.fat + meal.totalFat,
      carbs: acc.carbs + meal.totalCarbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 },
  )

  const handleMealTypeChange = (type: string) => {
    const mealType = mealTypes.find((t) => t.value === type)
    if (mealType) {
      setNewMeal({
        type: type as "breakfast" | "lunch" | "dinner" | "snack",
        name: mealType.label,
        time: mealType.defaultTime,
      })
    }
  }

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.type && newMeal.time) {
      onAddMeal(currentDate, {
        name: newMeal.name,
        type: newMeal.type,
        time: newMeal.time,
        foods: [],
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
      })
      setNewMeal({ name: "", type: "", time: "" })
      setOpenAddMealDialog(false)
    }
  }

  const handleAddFoodToMeal = () => {
    if (selectedMealId && selectedFood && foodAmount) {
      const amount = Number(foodAmount)
      const multiplier = amount / 100
      const foodEntry: Omit<FoodEntry, "id"> = {
        foodId: selectedFood.id,
        food: selectedFood,
        amount,
        calories: Math.round(selectedFood.calories * multiplier),
        protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
        fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
        carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
      }
      onAddFoodToMeal(currentDate, selectedMealId, foodEntry)
      setSelectedFood(null)
      setFoodAmount("")
      setOpenAddFoodDialog(false)
    }
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Дневник питания
        </Typography>
        <GradientButton startIcon={<AddIcon />} onClick={() => setOpenAddMealDialog(true)}>
          Добавить прием пищи
        </GradientButton>
      </Box>

      <DateNavigation currentDate={currentDate} onDateChange={onDateChange} />

      {/* Прогресс по целям */}
      <GlassCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Прогресс за день
          </Typography>
          <Grid container spacing={3}>
            {[
              { label: "Калории", current: totalConsumed.calories, goal: goals.calories, color: "#f44336", unit: "" },
              { label: "Белки", current: totalConsumed.protein, goal: goals.protein, color: "#2196f3", unit: "г" },
              { label: "Жиры", current: totalConsumed.fat, goal: goals.fat, color: "#ff9800", unit: "г" },
              { label: "Углеводы", current: totalConsumed.carbs, goal: goals.carbs, color: "#4caf50", unit: "г" },
            ].map((macro) => (
              <Grid item xs={6} md={3} key={macro.label}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {macro.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {Math.round(macro.current)}/{macro.goal}
                      {macro.unit}
                    </Typography>
                  </Box>
                  <StyledProgressBar
                    variant="determinate"
                    value={Math.min((macro.current / macro.goal) * 100, 100)}
                    sx={{
                      "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${macro.color} 0%, ${macro.color}dd 100%)`,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    Осталось: {Math.max(0, macro.goal - macro.current).toFixed(0)}
                    {macro.unit}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </GlassCard>

      {/* Список приемов пищи */}
      <Stack spacing={3}>
        {meals.map((meal, index) => (
          <Fade in={true} timeout={300 + index * 100} key={meal.id}>
            <ModernCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {mealTypes.find((t) => t.value === meal.type)?.emoji} {meal.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={meal.time}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: "#667eea" }}>
                        {meal.totalCalories} ккал
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setSelectedMealId(meal.id)
                        setOpenAddFoodDialog(true)
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Добавить
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteMeal(currentDate, meal.id)}
                      sx={{
                        color: "#f44336",
                        "&:hover": { backgroundColor: alpha("#f44336", 0.1) },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {meal.foods.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
                    <Typography variant="body2">Нет добавленных продуктов</Typography>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    {meal.foods.map((foodEntry) => (
                      <Paper
                        key={foodEntry.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          backgroundColor: alpha("#667eea", 0.02),
                          border: "1px solid",
                          borderColor: alpha("#667eea", 0.1),
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {foodEntry.food.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {foodEntry.amount}г • {foodEntry.calories} ккал • Б: {foodEntry.protein}г Ж:{" "}
                              {foodEntry.fat}г У: {foodEntry.carbs}г
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => onRemoveFoodFromMeal(currentDate, meal.id, foodEntry.id)}
                            sx={{
                              color: "#f44336",
                              "&:hover": { backgroundColor: alpha("#f44336", 0.1) },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </ModernCard>
          </Fade>
        ))}

        {meals.length === 0 && (
          <GlassCard>
            <CardContent sx={{ p: 6, textAlign: "center" }}>
              <Typography variant="h1" sx={{ fontSize: "4rem", mb: 2 }}>
                🍽️
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Нет записей за этот день
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Добавьте первый прием пищи, чтобы начать отслеживание
              </Typography>
              <GradientButton startIcon={<AddIcon />} onClick={() => setOpenAddMealDialog(true)}>
                Добавить прием пищи
              </GradientButton>
            </CardContent>
          </GlassCard>
        )}
      </Stack>

      {/* Диалоги */}
      <Dialog open={openAddMealDialog} onClose={() => setOpenAddMealDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Добавить прием пищи
            </Typography>
            <IconButton onClick={() => setOpenAddMealDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Выберите тип приема пищи
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {mealTypes.map((type) => (
              <Grid item xs={6} key={type.value}>
                <Button
                  variant={newMeal.type === type.value ? "contained" : "outlined"}
                  onClick={() => handleMealTypeChange(type.value)}
                  fullWidth
                  sx={{
                    p: 2,
                    height: 80,
                    flexDirection: "column",
                    gap: 1,
                    borderRadius: 3,
                    background:
                      newMeal.type === type.value ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  <Box sx={{ fontSize: "1.5rem" }}>{type.emoji}</Box>
                  <Typography variant="body2">{type.label}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>

          <TextField
            label="Название"
            fullWidth
            margin="normal"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          <TextField
            label="Время"
            type="time"
            fullWidth
            margin="normal"
            value={newMeal.time}
            onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAddMealDialog(false)} sx={{ borderRadius: 2 }}>
            Отмена
          </Button>
          <GradientButton
            onClick={handleAddMeal}
            disabled={!newMeal.name || !newMeal.type || !newMeal.time}
            sx={{ px: 3 }}
          >
            Добавить
          </GradientButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddFoodDialog} onClose={() => setOpenAddFoodDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Добавить продукт
            </Typography>
            <IconButton onClick={() => setOpenAddFoodDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {!selectedFood ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Выберите продукт из списка
              </Typography>
              <Stack spacing={1} sx={{ maxHeight: 400, overflow: "auto" }}>
                {foods.map((food) => (
                  <Paper
                    key={food.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      borderRadius: 3,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: alpha("#667eea", 0.05),
                        borderColor: "#667eea",
                        transform: "translateY(-1px)",
                      },
                    }}
                    onClick={() => setSelectedFood(food)}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {food.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {food.calories} ккал • Б: {food.protein}г Ж: {food.fat}г У: {food.carbs}г на {food.per}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                {selectedFood.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedFood.calories} ккал • Б: {selectedFood.protein}г Ж: {selectedFood.fat}г У: {selectedFood.carbs}
                г на {selectedFood.per}
              </Typography>
              <TextField
                label="Количество"
                type="number"
                fullWidth
                value={foodAmount}
                onChange={(e) => setFoodAmount(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                }}
                helperText="Укажите количество в граммах"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAddFoodDialog(false)} sx={{ borderRadius: 2 }}>
            Отмена
          </Button>
          {selectedFood && (
            <Button onClick={() => setSelectedFood(null)} variant="outlined" sx={{ borderRadius: 2 }}>
              Назад
            </Button>
          )}
          <GradientButton onClick={handleAddFoodToMeal} disabled={!selectedFood || !foodAmount} sx={{ px: 3 }}>
            Добавить
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Компонент продуктов
function FoodsTab({
  foods,
  onAddFood,
  onToggleFavorite,
}: {
  foods: Food[]
  onAddFood: (food: Omit<Food, "id">) => void
  onToggleFavorite: (id: number) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [newFood, setNewFood] = useState({
    name: "",
    protein: "",
    carbs: "",
    fat: "",
    per: "100",
  })

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFavorites = showOnlyFavorites ? food.favorite : true
    return matchesSearch && matchesFavorites
  })

  const handleAddFood = () => {
    if (newFood.name && newFood.protein && newFood.carbs && newFood.fat) {
      const protein = Number(newFood.protein)
      const fat = Number(newFood.fat)
      const carbs = Number(newFood.carbs)
      const calories = calculateCaloriesFromMacros(protein, fat, carbs)

      onAddFood({
        name: newFood.name,
        calories,
        protein,
        carbs,
        fat,
        per: `${newFood.per}г`,
        favorite: false,
      })
      setNewFood({ name: "", protein: "", carbs: "", fat: "", per: "100" })
      setOpenAddDialog(false)
    }
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          База продуктов
        </Typography>
        <GradientButton startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
          Добавить продукт
        </GradientButton>
      </Box>

      <GlassCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Поиск продуктов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
            <Button
              variant={showOnlyFavorites ? "contained" : "outlined"}
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              startIcon={showOnlyFavorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                minWidth: 140,
                background: showOnlyFavorites ? "linear-gradient(135deg, #f44336 0%, #e91e63 100%)" : "transparent",
              }}
            >
              Избранное
            </Button>
          </Box>
        </CardContent>
      </GlassCard>

      <Grid container spacing={3}>
        {filteredFoods.map((food, index) => (
          <Grid item xs={12} sm={6} md={4} key={food.id}>
            <Fade in={true} timeout={300 + index * 50}>
              <ModernCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                      {food.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onToggleFavorite(food.id)}
                      sx={{
                        color: food.favorite ? "#f44336" : "text.secondary",
                        "&:hover": {
                          backgroundColor: food.favorite ? alpha("#f44336", 0.1) : alpha("#667eea", 0.1),
                        },
                      }}
                    >
                      {food.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    на {food.per}
                  </Typography>

                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">Калории:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#f44336" }}>
                        {food.calories} ккал
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">Белки:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#2196f3" }}>
                        {food.protein}г
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">Жиры:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#ff9800" }}>
                        {food.fat}г
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">Углеводы:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#4caf50" }}>
                        {food.carbs}г
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </ModernCard>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {filteredFoods.length === 0 && (
        <GlassCard>
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h1" sx={{ fontSize: "4rem", mb: 2 }}>
              🔍
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
              Продукты не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Попробуйте изменить параметры поиска или добавьте новый продукт
            </Typography>
            <GradientButton startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
              Добавить продукт
            </GradientButton>
          </CardContent>
        </GlassCard>
      )}

      {/* Диалог добавления продукта */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Добавить продукт
            </Typography>
            <IconButton onClick={() => setOpenAddDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Название продукта"
            fullWidth
            margin="normal"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Белки"
                type="number"
                fullWidth
                margin="normal"
                value={newFood.protein}
                onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Жиры"
                type="number"
                fullWidth
                margin="normal"
                value={newFood.fat}
                onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Углеводы"
                type="number"
                fullWidth
                margin="normal"
                value={newFood.carbs}
                onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Порция"
            type="number"
            fullWidth
            margin="normal"
            value={newFood.per}
            onChange={(e) => setNewFood({ ...newFood, per: e.target.value })}
            InputProps={{
              endAdornment: <InputAdornment position="end">г</InputAdornment>,
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
          {newFood.protein && newFood.fat && newFood.carbs && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                borderRadius: 3,
                border: "1px solid",
                borderColor: alpha("#667eea", 0.2),
              }}
            >
              <Typography variant="body2" color="text.secondary">
                💡 Калории будут рассчитаны автоматически:{" "}
                <strong>
                  {calculateCaloriesFromMacros(Number(newFood.protein), Number(newFood.fat), Number(newFood.carbs))}{" "}
                  ккал
                </strong>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAddDialog(false)} sx={{ borderRadius: 2 }}>
            Отмена
          </Button>
          <GradientButton
            onClick={handleAddFood}
            disabled={!newFood.name || !newFood.protein || !newFood.fat || !newFood.carbs}
            sx={{ px: 3 }}
          >
            Добавить
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Компонент аналитики
function AnalyticsTab({ daysData }: { daysData: DayData[] }) {
  // Получаем данные за последние 7 дней
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i)
    return date.toISOString().split("T")[0]
  })

  const weeklyStats = weekDays.map((date) => {
    const dayData = daysData.find((d) => d.date === date)
    const totalCalories = dayData?.meals.reduce((acc, meal) => acc + meal.totalCalories, 0) || 0
    return {
      day: format(new Date(date), "EEE", { locale: ru }),
      date,
      calories: totalCalories,
      goal: 2000,
    }
  })

  const avgCalories = Math.round(weeklyStats.reduce((acc, day) => acc + day.calories, 0) / weeklyStats.length)
  const daysOnTarget = weeklyStats.filter((day) => Math.abs(day.calories - day.goal) <= 200).length
  const totalDays = weeklyStats.filter((day) => day.calories > 0).length

  return (
    <Box sx={{ py: 3 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4,
        }}
      >
        Аналитика
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Недельная статистика
              </Typography>
              <Stack spacing={2}>
                {weeklyStats.map((stat, index) => (
                  <Fade in={true} timeout={300 + index * 100} key={stat.date}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body1" sx={{ width: 40, fontWeight: 700 }}>
                        {stat.day}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <StyledProgressBar
                          variant="determinate"
                          value={stat.goal > 0 ? (stat.calories / stat.goal) * 100 : 0}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100, textAlign: "right" }}>
                        {stat.calories > 0 ? `${stat.calories}/${stat.goal}` : "Нет данных"}
                      </Typography>
                    </Box>
                  </Fade>
                ))}
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Fade in={true} timeout={500}>
              <GlassCard>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                    Средние калории
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {avgCalories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ккал/день
                  </Typography>
                </CardContent>
              </GlassCard>
            </Fade>

            <Fade in={true} timeout={700}>
              <GlassCard>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                    Дней в цели
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: daysOnTarget >= 5 ? "#4caf50" : daysOnTarget >= 3 ? "#ff9800" : "#f44336",
                    }}
                  >
                    {daysOnTarget}/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    на этой неделе
                  </Typography>
                </CardContent>
              </GlassCard>
            </Fade>

            <Fade in={true} timeout={900}>
              <GlassCard>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                    Активных дней
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: totalDays >= 5 ? "#4caf50" : totalDays >= 3 ? "#ff9800" : "#f44336",
                    }}
                  >
                    {totalDays}/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    с записями
                  </Typography>
                </CardContent>
              </GlassCard>
            </Fade>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

// Компонент профиля в хеддере
function ProfileMenu({
  user,
  profile,
  goals,
  onUpdateProfile,
  onLogout,
}: {
  user: User
  profile: UserProfile
  goals: NutritionGoals
  onUpdateProfile: (profile: UserProfile) => void
  onLogout: () => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openProfileDialog, setOpenProfileDialog] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSave = () => {
    onUpdateProfile(editedProfile)
    setOpenProfileDialog(false)
  }

  const bmi = editedProfile.weight / Math.pow(editedProfile.height / 100, 2)
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: "Недостаток веса", color: "#2196f3" }
    if (bmi < 25) return { text: "Норма", color: "#4caf50" }
    if (bmi < 30) return { text: "Избыточный вес", color: "#ff9800" }
    return { text: "Ожирение", color: "#f44336" }
  }

  const bmiStatus = getBMIStatus(bmi)

  return (
    <>
      <IconButton onClick={handleClick} sx={{ p: 0 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontWeight: 700,
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 200,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            setOpenProfileDialog(true)
            handleClose()
          }}
          sx={{ py: 1.5 }}
        >
          <PersonIcon sx={{ mr: 2 }} />
          Профиль
        </MenuItem>
        <MenuItem onClick={onLogout} sx={{ py: 1.5, color: "#f44336" }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Выйти
        </MenuItem>
      </Menu>

      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Профиль пользователя
            </Typography>
            <IconButton onClick={() => setOpenProfileDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Личные данные
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Возраст"
                  type="number"
                  fullWidth
                  value={editedProfile.age}
                  onChange={(e) => setEditedProfile({ ...editedProfile, age: Number(e.target.value) })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="Рост"
                  type="number"
                  fullWidth
                  value={editedProfile.height}
                  onChange={(e) => setEditedProfile({ ...editedProfile, height: Number(e.target.value) })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">см</InputAdornment>,
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="Вес"
                  type="number"
                  fullWidth
                  value={editedProfile.weight}
                  onChange={(e) => setEditedProfile({ ...editedProfile, weight: Number(e.target.value) })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">кг</InputAdornment>,
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <FormControl fullWidth>
                  <InputLabel>Пол</InputLabel>
                  <Select
                    value={editedProfile.gender}
                    label="Пол"
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, gender: e.target.value as "male" | "female" })
                    }
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="male">Мужской</MenuItem>
                    <MenuItem value="female">Женский</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Уровень активности</InputLabel>
                  <Select
                    value={editedProfile.activityLevel}
                    label="Уровень активности"
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        activityLevel: e.target.value as UserProfile["activityLevel"],
                      })
                    }
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="sedentary">Малоподвижный</MenuItem>
                    <MenuItem value="light">Легкая активность</MenuItem>
                    <MenuItem value="moderate">Умеренная активность</MenuItem>
                    <MenuItem value="active">Высокая активность</MenuItem>
                    <MenuItem value="very_active">Очень высокая активность</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: alpha("#667eea", 0.2),
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ИМТ:
                  </Typography>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {bmi.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: bmiStatus.color, fontWeight: 600 }}>
                      {bmiStatus.text}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Цели питания
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Рассчитаны автоматически на основе ваших параметров
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1">Калории:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#f44336" }}>
                    {goals.calories} ккал
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1">Белки:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#2196f3" }}>
                    {goals.protein} г
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1">Жиры:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#ff9800" }}>
                    {goals.fat} г
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1">Углеводы:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#4caf50" }}>
                    {goals.carbs} г
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: alpha("#667eea", 0.2),
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  💡 Цели рассчитываются автоматически на основе формулы Миффлина-Сан Жеора с учетом вашего уровня
                  активности
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenProfileDialog(false)} sx={{ borderRadius: 2 }}>
            Отмена
          </Button>
          <GradientButton onClick={handleSave} sx={{ px: 3 }}>
            Сохранить изменения
          </GradientButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default function CalorieTracker() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0])
  const [daysData, setDaysData] = useState<DayData[]>([])
  const [foods, setFoods] = useState<Food[]>(initialFoods)
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [goals, setGoals] = useState<NutritionGoals>(calculateNutritionGoals(initialProfile))
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Обновление целей при изменении профиля
  useEffect(() => {
    setGoals(calculateNutritionGoals(profile))
  }, [profile])

  // Получение данных для текущего дня
  const currentDayData = daysData.find((day) => day.date === currentDate)

  // Функции для работы с приемами пищи
  const handleAddMeal = (date: string, newMeal: Omit<Meal, "id">) => {
    const meal: Meal = {
      ...newMeal,
      id: Date.now(),
    }

    setDaysData((prev) => {
      const existingDayIndex = prev.findIndex((day) => day.date === date)
      if (existingDayIndex >= 0) {
        const updatedDays = [...prev]
        updatedDays[existingDayIndex] = {
          ...updatedDays[existingDayIndex],
          meals: [...updatedDays[existingDayIndex].meals, meal],
        }
        return updatedDays
      } else {
        return [...prev, { date, meals: [meal] }]
      }
    })

    setSnackbarMessage(`Прием пищи "${meal.name}" добавлен`)
    setSnackbarOpen(true)
  }

  const handleDeleteMeal = (date: string, mealId: number) => {
    setDaysData((prev) =>
      prev.map((day) => {
        if (day.date === date) {
          return {
            ...day,
            meals: day.meals.filter((meal) => meal.id !== mealId),
          }
        }
        return day
      }),
    )
    setSnackbarMessage("Прием пищи удален")
    setSnackbarOpen(true)
  }

  const handleAddFoodToMeal = (date: string, mealId: number, foodEntry: Omit<FoodEntry, "id">) => {
    setDaysData((prev) =>
      prev.map((day) => {
        if (day.date === date) {
          return {
            ...day,
            meals: day.meals.map((meal) => {
              if (meal.id === mealId) {
                const newFoodEntry = { ...foodEntry, id: Date.now() }
                const updatedFoods = [...meal.foods, newFoodEntry]
                return {
                  ...meal,
                  foods: updatedFoods,
                  totalCalories: updatedFoods.reduce((acc, food) => acc + food.calories, 0),
                  totalProtein: updatedFoods.reduce((acc, food) => acc + food.protein, 0),
                  totalFat: updatedFoods.reduce((acc, food) => acc + food.fat, 0),
                  totalCarbs: updatedFoods.reduce((acc, food) => acc + food.carbs, 0),
                }
              }
              return meal
            }),
          }
        }
        return day
      }),
    )
    setSnackbarMessage("Продукт добавлен в прием пищи")
    setSnackbarOpen(true)
  }

  const handleRemoveFoodFromMeal = (date: string, mealId: number, foodEntryId: number) => {
    setDaysData((prev) =>
      prev.map((day) => {
        if (day.date === date) {
          return {
            ...day,
            meals: day.meals.map((meal) => {
              if (meal.id === mealId) {
                const updatedFoods = meal.foods.filter((food) => food.id !== foodEntryId)
                return {
                  ...meal,
                  foods: updatedFoods,
                  totalCalories: updatedFoods.reduce((acc, food) => acc + food.calories, 0),
                  totalProtein: updatedFoods.reduce((acc, food) => acc + food.protein, 0),
                  totalFat: updatedFoods.reduce((acc, food) => acc + food.fat, 0),
                  totalCarbs: updatedFoods.reduce((acc, food) => acc + food.carbs, 0),
                }
              }
              return meal
            }),
          }
        }
        return day
      }),
    )
    setSnackbarMessage("Продукт удален из приема пищи")
    setSnackbarOpen(true)
  }

  // Функции для работы с продуктами
  const handleAddFood = (newFood: Omit<Food, "id">) => {
    const food: Food = {
      ...newFood,
      id: Date.now(),
    }
    setFoods((prev) => [...prev, food])
    setSnackbarMessage(`Продукт "${food.name}" добавлен`)
    setSnackbarOpen(true)
  }

  const handleToggleFavorite = (id: number) => {
    setFoods((prev) => prev.map((food) => (food.id === id ? { ...food, favorite: !food.favorite } : food)))
    const food = foods.find((f) => f.id === id)
    setSnackbarMessage(food?.favorite ? "Продукт удален из избранного" : "Продукт добавлен в избранное")
    setSnackbarOpen(true)
  }

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    setSnackbarMessage("Профиль обновлен! Цели питания пересчитаны.")
    setSnackbarOpen(true)
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setDaysData([])
    setCurrentDate(new Date().toISOString().split("T")[0])
    setActiveTab(0)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Если пользователь не авторизован, показываем экран авторизации
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <DiaryTab
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            dayData={currentDayData}
            foods={foods}
            goals={goals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onAddFoodToMeal={handleAddFoodToMeal}
            onRemoveFoodFromMeal={handleRemoveFoodFromMeal}
          />
        )
      case 1:
        return <FoodsTab foods={foods} onAddFood={handleAddFood} onToggleFavorite={handleToggleFavorite} />
      case 2:
        return <AnalyticsTab daysData={daysData} />
      default:
        return (
          <DiaryTab
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            dayData={currentDayData}
            foods={foods}
            goals={goals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onAddFoodToMeal={handleAddFoodToMeal}
            onRemoveFoodFromMeal={handleRemoveFoodFromMeal}
          />
        )
    }
  }

  const menuItems = [
    { text: "Дневник", icon: <RestaurantIcon />, index: 0 },
    { text: "Продукты", icon: <SearchIcon />, index: 1 },
    { text: "Аналитика", icon: <TrendingUpIcon />, index: 2 },
  ]

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CalorieTracker
        </Typography>
      </Toolbar>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            onClick={() => {
              setActiveTab(item.index)
              if (isMobile) setMobileOpen(false)
            }}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 3,
              background:
                activeTab === item.index ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
              color: activeTab === item.index ? "white" : "inherit",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background:
                  activeTab === item.index
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : alpha("#667eea", 0.08),
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                pl: 2,
                color: activeTab === item.index ? "white" : "#667eea",
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: activeTab === item.index ? 700 : 500,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          color: "text.primary",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          borderBottom: "1px solid",
          borderColor: alpha("#667eea", 0.1),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CalorieTracker
          </Typography>
          <ProfileMenu
            user={user}
            profile={profile}
            goals={goals}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        </Toolbar>
        {isMobile && (
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="navigation tabs"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "& .MuiTab-root": { color: "rgba(255,255,255,0.7)", fontWeight: 600 },
              "& .Mui-selected": { color: "white !important" },
              "& .MuiTabs-indicator": { backgroundColor: "white" },
            }}
          >
            <Tab icon={<RestaurantIcon />} aria-label="diary" />
            <Tab icon={<SearchIcon />} aria-label="foods" />
            <Tab icon={<TrendingUpIcon />} aria-label="analytics" />
          </Tabs>
        )}
      </AppBar>

      <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 280px)` },
        }}
      >
        <Toolbar />
        {isMobile && <Toolbar />}
        <Container maxWidth="lg">{renderTabContent()}</Container>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
            color: "white",
            fontWeight: 600,
            "& .MuiAlert-icon": { color: "white" },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
