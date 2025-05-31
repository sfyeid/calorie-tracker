"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material"
import {
  Restaurant,
  Add,
  Edit,
  Delete,
  ArrowBack,
  CalendarToday,
  LocalFireDepartment,
  FitnessCenter,
  Opacity,
  Grain,
} from "@mui/icons-material"
import { format, addDays, subDays } from "date-fns"
import { ru } from "date-fns/locale"

interface Food {
  id: number
  name: string
  amount: number
  calories: number
  protein: number
  fat: number
  carbs: number
}

interface Meal {
  id: number
  type: string
  name: string
  time: string
  foods: Food[]
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
}

export default function DiaryPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [meals, setMeals] = useState<Meal[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState("")
  const [newMealName, setNewMealName] = useState("")
  const [newMealTime, setNewMealTime] = useState("")

  const mealTypes = [
    { value: "breakfast", label: "Завтрак", defaultTime: "08:00" },
    { value: "lunch", label: "Обед", defaultTime: "13:00" },
    { value: "dinner", label: "Ужин", defaultTime: "19:00" },
    { value: "snack", label: "Перекус", defaultTime: "16:00" },
  ]

  // Загрузка данных дневника
  useEffect(() => {
    const loadDiaryData = () => {
      // Имитация загрузки данных
      const mockMeals: Meal[] = [
        {
          id: 1,
          type: "breakfast",
          name: "Завтрак",
          time: "08:30",
          foods: [
            {
              id: 1,
              name: "Овсянка с фруктами",
              amount: 200,
              calories: 320,
              protein: 12,
              fat: 6,
              carbs: 58,
            },
            {
              id: 2,
              name: "Греческий йогурт",
              amount: 150,
              calories: 100,
              protein: 15,
              fat: 0,
              carbs: 6,
            },
          ],
          totalCalories: 420,
          totalProtein: 27,
          totalFat: 6,
          totalCarbs: 64,
        },
        {
          id: 2,
          type: "lunch",
          name: "Обед",
          time: "13:00",
          foods: [
            {
              id: 3,
              name: "Куриная грудка",
              amount: 150,
              calories: 248,
              protein: 46,
              fat: 5,
              carbs: 0,
            },
            {
              id: 4,
              name: "Рис с овощами",
              amount: 200,
              calories: 260,
              protein: 6,
              fat: 1,
              carbs: 54,
            },
            {
              id: 5,
              name: "Салат овощной",
              amount: 100,
              calories: 25,
              protein: 1,
              fat: 0,
              carbs: 5,
            },
          ],
          totalCalories: 533,
          totalProtein: 53,
          totalFat: 6,
          totalCarbs: 59,
        },
      ]
      setMeals(mockMeals)
    }

    loadDiaryData()
  }, [currentDate])

  const handleAddMeal = () => {
    if (!selectedMealType || !newMealName || !newMealTime) return

    const mealTypeInfo = mealTypes.find((type) => type.value === selectedMealType)
    const newMeal: Meal = {
      id: Date.now(),
      type: selectedMealType,
      name: newMealName,
      time: newMealTime,
      foods: [],
      totalCalories: 0,
      totalProtein: 0,
      totalFat: 0,
      totalCarbs: 0,
    }

    setMeals([...meals, newMeal])
    setOpenDialog(false)
    setSelectedMealType("")
    setNewMealName("")
    setNewMealTime("")
  }

  const handleMealTypeChange = (type: string) => {
    setSelectedMealType(type)
    const mealTypeInfo = mealTypes.find((t) => t.value === type)
    if (mealTypeInfo) {
      setNewMealName(mealTypeInfo.label)
      setNewMealTime(mealTypeInfo.defaultTime)
    }
  }

  const getTotalNutrition = () => {
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.totalCalories,
        protein: total.protein + meal.totalProtein,
        fat: total.fat + meal.totalFat,
        carbs: total.carbs + meal.totalCarbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 },
    )
  }

  const totalNutrition = getTotalNutrition()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/dashboard")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Дневник питания
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
        {/* Навигация по датам */}
        <Paper sx={{ padding: 2, marginBottom: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => setCurrentDate(subDays(currentDate, 1))} sx={{ minWidth: 100 }}>
              Назад
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday color="primary" />
              <Typography variant="h6">{format(currentDate, "d MMMM yyyy", { locale: ru })}</Typography>
            </Box>

            <Button variant="outlined" onClick={() => setCurrentDate(addDays(currentDate, 1))} sx={{ minWidth: 100 }}>
              Вперед
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Сводка за день */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "fit-content", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Сводка за день
                </Typography>

                <Box sx={{ marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <LocalFireDepartment color="error" sx={{ marginRight: 1 }} />
                    <Typography variant="body2">Калории</Typography>
                  </Box>
                  <Typography variant="h5" color="error.main">
                    {totalNutrition.calories} ккал
                  </Typography>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <FitnessCenter color="primary" sx={{ marginRight: 1 }} />
                    <Typography variant="body2">Белки</Typography>
                  </Box>
                  <Typography variant="h6" color="primary.main">
                    {totalNutrition.protein.toFixed(1)} г
                  </Typography>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <Opacity color="warning" sx={{ marginRight: 1 }} />
                    <Typography variant="body2">Жиры</Typography>
                  </Box>
                  <Typography variant="h6" color="warning.main">
                    {totalNutrition.fat.toFixed(1)} г
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <Grain color="success" sx={{ marginRight: 1 }} />
                    <Typography variant="body2">Углеводы</Typography>
                  </Box>
                  <Typography variant="h6" color="success.main">
                    {totalNutrition.carbs.toFixed(1)} г
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Список приемов пищи */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Приемы пищи
              </Typography>

              {meals.length === 0 ? (
                <Box sx={{ textAlign: "center", paddingY: 4 }}>
                  <Restaurant sx={{ fontSize: 64, color: "text.secondary", marginBottom: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Нет записей за этот день
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Добавьте первый прием пищи
                  </Typography>
                </Box>
              ) : (
                <List>
                  {meals.map((meal) => (
                    <ListItem
                      key={meal.id}
                      sx={{
                        marginBottom: 2,
                        backgroundColor: "background.paper",
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <ListItemIcon>
                        <Restaurant color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" component="span">
                              {meal.name}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={`${meal.totalCalories} ккал`}
                                color="error"
                                variant="outlined"
                                size="small"
                              />
                              <Typography variant="body2" color="text.secondary" component="span">
                                {meal.time}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ marginTop: 1 }}>
                            {meal.foods.length > 0 ? (
                              <Box>
                                <Typography variant="body2" color="text.secondary" component="div">
                                  {meal.foods.map((food) => food.name).join(", ")}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
                                  <Typography variant="caption" component="span">
                                    Б: {meal.totalProtein.toFixed(1)}г
                                  </Typography>
                                  <Typography variant="caption" component="span">
                                    Ж: {meal.totalFat.toFixed(1)}г
                                  </Typography>
                                  <Typography variant="caption" component="span">
                                    У: {meal.totalCarbs.toFixed(1)}г
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary" component="div">
                                Нет продуктов
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton size="small" onClick={() => router.push(`/diary/meal/${meal.id}`)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setMeals(meals.filter((m) => m.id !== meal.id))
                          }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Кнопка добавления приема пищи */}
        <Fab
          color="primary"
          aria-label="add meal"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
          onClick={() => setOpenDialog(true)}
        >
          <Add />
        </Fab>

        {/* Диалог добавления приема пищи */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Добавить прием пищи</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Тип приема пищи"
              value={selectedMealType}
              onChange={(e) => handleMealTypeChange(e.target.value)}
              fullWidth
              margin="normal"
            >
              {mealTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Название"
              value={newMealName}
              onChange={(e) => setNewMealName(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Время"
              type="time"
              value={newMealTime}
              onChange={(e) => setNewMealTime(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
            <Button onClick={handleAddMeal} variant="contained">
              Добавить
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
