"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  ButtonGroup,
} from "@mui/material"
import {
  ArrowBack,
  X,
  Restaurant,
  LocalFireDepartment,
  FitnessCenter,
  Opacity,
  Grain,
  Save,
  Search,
  Plus,
} from "@mui/icons-material"
import { motion } from "framer-motion"

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

export default function MealEditPage() {
  const router = useRouter()
  const params = useParams()
  const mealId = params?.id ? Number(params.id) : null

  const [meal, setMeal] = useState<Meal | null>(null)
  const [mealName, setMealName] = useState("")
  const [mealTime, setMealTime] = useState("")
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Food[]>([])
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [foodAmount, setFoodAmount] = useState(100)

  // Загрузка данных о приеме пищи
  useEffect(() => {
    if (!mealId) return

    // Имитация загрузки данных
    const mockMeal: Meal = {
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
    }

    setMeal(mockMeal)
    setMealName(mockMeal.name)
    setMealTime(mockMeal.time)
  }, [mealId])

  const handleSave = () => {
    if (!meal) return

    const updatedMeal = {
      ...meal,
      name: mealName,
      time: mealTime,
    }

    console.log("Сохранено:", updatedMeal)
    router.push("/diary")
  }

  const handleRemoveFood = (foodId: number) => {
    if (!meal) return

    const updatedFoods = meal.foods.filter((food) => food.id !== foodId)
    const totalCalories = updatedFoods.reduce((sum, food) => sum + food.calories, 0)
    const totalProtein = updatedFoods.reduce((sum, food) => sum + food.protein, 0)
    const totalFat = updatedFoods.reduce((sum, food) => sum + food.fat, 0)
    const totalCarbs = updatedFoods.reduce((sum, food) => sum + food.carbs, 0)

    setMeal({
      ...meal,
      foods: updatedFoods,
      totalCalories,
      totalProtein,
      totalFat,
      totalCarbs,
    })
  }

  const handleOpenSearchDialog = () => {
    setSearchDialogOpen(true)
    setFoodAmount(100)

    // Имитация поиска продуктов
    const mockFoods: Food[] = [
      {
        id: 3,
        name: "Куриная грудка",
        amount: 100,
        calories: 165,
        protein: 31,
        fat: 3.6,
        carbs: 0,
      },
      {
        id: 4,
        name: "Рис белый",
        amount: 100,
        calories: 130,
        protein: 2.7,
        fat: 0.3,
        carbs: 28,
      },
      {
        id: 5,
        name: "Яблоко",
        amount: 100,
        calories: 52,
        protein: 0.3,
        fat: 0.2,
        carbs: 14,
      },
    ]
    setSearchResults(mockFoods)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      const filteredResults = searchResults.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(filteredResults)
    }
  }

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food)
  }

  const handleAmountChange = (newAmount: number) => {
    setFoodAmount(Math.max(1, newAmount))
  }

  const handleAddFood = () => {
    if (!meal || !selectedFood) return

    const multiplier = foodAmount / 100
    const newFood: Food = {
      ...selectedFood,
      id: Date.now(),
      amount: foodAmount,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
    }

    const updatedFoods = [...meal.foods, newFood]
    const totalCalories = updatedFoods.reduce((sum, food) => sum + food.calories, 0)
    const totalProtein = updatedFoods.reduce((sum, food) => sum + food.protein, 0)
    const totalFat = updatedFoods.reduce((sum, food) => sum + food.fat, 0)
    const totalCarbs = updatedFoods.reduce((sum, food) => sum + food.carbs, 0)

    setMeal({
      ...meal,
      foods: updatedFoods,
      totalCalories,
      totalProtein,
      totalFat,
      totalCarbs,
    })

    setSearchDialogOpen(false)
    setSelectedFood(null)
    setFoodAmount(100)
  }

  if (!meal) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">Загрузка...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/diary")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Редактирование приема пищи
          </Typography>
          <Button
            color="inherit"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{ fontWeight: 600, textTransform: "none" }}
          >
            Сохранить
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Основная информация */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="700">
                Информация о приеме пищи
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Название"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Время"
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Продукты
                </Typography>

                {meal.foods.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      backgroundColor: "grey.50",
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Restaurant sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Нет добавленных продуктов
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Добавьте продукты, чтобы отслеживать питание
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ mb: 3 }}>
                    {meal.foods.map((food) => (
                      <motion.div
                        key={food.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <ListItem
                          sx={{
                            mb: 2,
                            backgroundColor: "background.paper",
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                            p: 3,
                          }}
                        >
                          <ListItemIcon>
                            <Restaurant color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                <Typography variant="h6" fontWeight="600">
                                  {food.name}
                                </Typography>
                                <Chip label={`${food.amount} г`} size="small" variant="outlined" color="primary" />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <LocalFireDepartment sx={{ fontSize: 16, color: "error.main" }} />
                                  <Typography variant="body2" fontWeight="600">
                                    {food.calories} ккал
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="primary.main" fontWeight="600">
                                  Б: {food.protein}г
                                </Typography>
                                <Typography variant="body2" color="warning.main" fontWeight="600">
                                  Ж: {food.fat}г
                                </Typography>
                                <Typography variant="body2" color="success.main" fontWeight="600">
                                  У: {food.carbs}г
                                </Typography>
                              </Box>
                            }
                          />
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveFood(food.id)}
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                backgroundColor: "error.50",
                                color: "error.main",
                              },
                            }}
                          >
                            <X />
                          </IconButton>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                )}

                <Button
                  variant="outlined"
                  startIcon={<Plus />}
                  onClick={handleOpenSearchDialog}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Добавить продукт
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Сводка */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, borderRadius: 3, position: "sticky", top: 24 }}>
              <Typography variant="h5" gutterBottom fontWeight="700">
                Сводка
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocalFireDepartment color="error" sx={{ mr: 1 }} />
                  <Typography variant="body1" fontWeight="600">
                    Калории
                  </Typography>
                </Box>
                <Typography variant="h4" color="error.main" fontWeight="700">
                  {meal.totalCalories} ккал
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <FitnessCenter color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Белки
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="700">
                      {meal.totalProtein.toFixed(1)}г
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Opacity color="warning" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Жиры
                    </Typography>
                    <Typography variant="h6" color="warning.main" fontWeight="700">
                      {meal.totalFat.toFixed(1)}г
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Grain color="success" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Углеводы
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight="700">
                      {meal.totalCarbs.toFixed(1)}г
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Диалог поиска продуктов */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="700">
            Поиск продуктов
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Поиск продуктов"
            type="text"
            fullWidth
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {selectedFood && (
            <Paper sx={{ p: 3, mb: 3, backgroundColor: "primary.50", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                {selectedFood.name}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom fontWeight="600">
                  Количество (грамм):
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    type="number"
                    value={foodAmount}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <ButtonGroup size="small">
                    <Button onClick={() => handleAmountChange(foodAmount + 10)}>+10</Button>
                    <Button onClick={() => handleAmountChange(foodAmount + 100)}>+100</Button>
                    <Button onClick={() => handleAmountChange(150)}>Порция</Button>
                  </ButtonGroup>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3 }}>
                <Typography variant="body2">
                  <strong>{Math.round((selectedFood.calories * foodAmount) / 100)} ккал</strong>
                </Typography>
                <Typography variant="body2">Б: {((selectedFood.protein * foodAmount) / 100).toFixed(1)}г</Typography>
                <Typography variant="body2">Ж: {((selectedFood.fat * foodAmount) / 100).toFixed(1)}г</Typography>
                <Typography variant="body2">У: {((selectedFood.carbs * foodAmount) / 100).toFixed(1)}г</Typography>
              </Box>
            </Paper>
          )}

          <List>
            {searchResults.map((food) => (
              <ListItem
                key={food.id}
                onClick={() => handleSelectFood(food)}
                sx={{
                  mb: 1,
                  backgroundColor: selectedFood?.id === food.id ? "primary.50" : "background.paper",
                  borderRadius: 2,
                  border: 1,
                  borderColor: selectedFood?.id === food.id ? "primary.main" : "divider",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    borderColor: "primary.main",
                  },
                }}
              >
                <ListItemIcon>
                  <Restaurant />
                </ListItemIcon>
                <ListItemText
                  primary={food.name}
                  secondary={
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Typography variant="caption">{food.calories} ккал</Typography>
                      <Typography variant="caption">Б: {food.protein}г</Typography>
                      <Typography variant="caption">Ж: {food.fat}г</Typography>
                      <Typography variant="caption">У: {food.carbs}г</Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSearchDialogOpen(false)} sx={{ textTransform: "none", fontWeight: 600 }}>
            Отмена
          </Button>
          <Button
            onClick={handleAddFood}
            variant="contained"
            disabled={!selectedFood}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: 2 },
            }}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
