"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Add, ChevronLeft, ChevronRight, Delete, Restaurant, AccessTime, Search } from "@mui/icons-material"
import { useForm } from "react-hook-form"

interface FoodEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  amount: number
  unit: string
  time: string
  meal: string
}

interface AddFoodForm {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  amount: number
  unit: string
  meal: string
}

interface Product {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  isFavorite: boolean
  isCustom: boolean
}

export default function DiaryPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogTab, setDialogTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("breakfast")

  const [entries, setEntries] = useState<FoodEntry[]>([
    {
      id: "1",
      name: "Овсяная каша",
      calories: 350,
      protein: 12,
      carbs: 60,
      fat: 8,
      amount: 100,
      unit: "г",
      time: "08:30",
      meal: "breakfast",
    },
    {
      id: "2",
      name: "Куриная грудка",
      calories: 450,
      protein: 85,
      carbs: 0,
      fat: 10,
      amount: 200,
      unit: "г",
      time: "13:00",
      meal: "lunch",
    },
  ])

  // Mock products from database
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Куриная грудка",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      isFavorite: true,
      isCustom: false,
    },
    {
      id: "2",
      name: "Овсяная каша",
      calories: 389,
      protein: 16.9,
      carbs: 66.3,
      fat: 6.9,
      isFavorite: false,
      isCustom: false,
    },
    {
      id: "3",
      name: "Творог 5%",
      calories: 121,
      protein: 16.7,
      carbs: 1.3,
      fat: 5,
      isFavorite: true,
      isCustom: false,
    },
    {
      id: "4",
      name: "Банан",
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      isFavorite: false,
      isCustom: false,
    },
  ])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddFoodForm>()

  const formatDate = (date: Date) => {
    if (isMobile) {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    }
    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const onSubmit = (data: AddFoodForm) => {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      ...data,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    }
    setEntries([...entries, newEntry])
    setOpenDialog(false)
    reset()
    setDialogTab(0)
    setSearchTerm("")
  }

  const addProductFromDatabase = (product: Product, amount: number, unit: string) => {
    // Calculate nutritional values based on amount
    const multiplier = unit === "г" ? amount / 100 : amount

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: product.name,
      calories: Math.round(product.calories * multiplier),
      protein: Math.round(product.protein * multiplier * 10) / 10,
      carbs: Math.round(product.carbs * multiplier * 10) / 10,
      fat: Math.round(product.fat * multiplier * 10) / 10,
      amount,
      unit,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      meal: selectedMeal,
    }

    setEntries([...entries, newEntry])
    setOpenDialog(false)
    setDialogTab(0)
    setSearchTerm("")
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const getMealEntries = (meal: string) => {
    return entries.filter((entry) => entry.meal === meal)
  }

  const getMealTotals = (meal: string) => {
    const mealEntries = getMealEntries(meal)
    return mealEntries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        protein: totals.protein + entry.protein,
        carbs: totals.carbs + entry.carbs,
        fat: totals.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  const getDayTotals = () => {
    return entries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        protein: totals.protein + entry.protein,
        carbs: totals.carbs + entry.carbs,
        fat: totals.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  const meals = [
    { id: "breakfast", name: "Завтрак", color: "#4CAF50" },
    { id: "lunch", name: "Обед", color: "#2196F3" },
    { id: "dinner", name: "Ужин", color: "#FF9800" },
    { id: "snack", name: "Перекус", color: "#9C27B0" },
  ]

  const dayTotals = getDayTotals()

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const openAddDialog = (mealId: string) => {
    setSelectedMeal(mealId)
    setOpenDialog(true)
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        position: "relative",
      }}
    >
      {/* Date Navigation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 0, sm: 1 },
        }}
      >
        <IconButton onClick={() => changeDate(-1)} size={isMobile ? "medium" : "large"} sx={{ mr: { xs: 1, sm: 2 } }}>
          <ChevronLeft />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            mx: { xs: 1, sm: 2, md: 3 },
            minWidth: { xs: 150, sm: 250, md: 300 },
            textAlign: "center",
            fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem", lg: "1.5rem" },
            fontWeight: 500,
          }}
        >
          {formatDate(selectedDate)}
        </Typography>
        <IconButton onClick={() => changeDate(1)} size={isMobile ? "medium" : "large"} sx={{ ml: { xs: 1, sm: 2 } }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Day Summary */}
      <Card sx={{ mb: { xs: 2, sm: 3, md: 4 }, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <CardContent sx={{ color: "white", p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}>
            Итого за день
          </Typography>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" } }}>
                Калории
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>
                {dayTotals.calories}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" } }}>
                Белки
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>
                {Math.round(dayTotals.protein * 10) / 10}г
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" } }}>
                Углеводы
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>
                {Math.round(dayTotals.carbs * 10) / 10}г
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" } }}>
                Жиры
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>
                {Math.round(dayTotals.fat * 10) / 10}г
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Meals */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {meals.map((meal) => {
          const mealEntries = getMealEntries(meal.id)
          const mealTotals = getMealTotals(meal.id)

          return (
            <Grid item xs={12} lg={6} key={meal.id}>
              <Card sx={{ height: { xs: "auto", lg: "100%" } }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Restaurant sx={{ color: meal.color, mr: 1, fontSize: { xs: 20, sm: 24 } }} />
                      <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}>
                        {meal.name}
                      </Typography>
                    </Box>
                    {!isMobile && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => openAddDialog(meal.id)}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Добавить
                      </Button>
                    )}
                  </Box>

                  {mealEntries.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={{ xs: 0.5, sm: 1 }}>
                        <Grid item xs={6} sm={3}>
                          <Chip
                            label={`${mealTotals.calories} ккал`}
                            size="small"
                            sx={{
                              width: "100%",
                              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                              height: { xs: 24, sm: 32 },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Chip
                            label={`Б: ${Math.round(mealTotals.protein * 10) / 10}г`}
                            size="small"
                            sx={{
                              width: "100%",
                              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                              height: { xs: 24, sm: 32 },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Chip
                            label={`У: ${Math.round(mealTotals.carbs * 10) / 10}г`}
                            size="small"
                            sx={{
                              width: "100%",
                              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                              height: { xs: 24, sm: 32 },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Chip
                            label={`Ж: ${Math.round(mealTotals.fat * 10) / 10}г`}
                            size="small"
                            sx={{
                              width: "100%",
                              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                              height: { xs: 24, sm: 32 },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <List dense>
                    {mealEntries.map((entry) => (
                      <ListItem key={entry.id} divider sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>{entry.name}</Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                              >
                                {entry.amount}
                                {entry.unit} • {entry.calories} ккал
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                <AccessTime sx={{ fontSize: { xs: 12, sm: 14 }, mr: 0.5 }} />
                                <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                                  {entry.time}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" size="small" onClick={() => deleteEntry(entry.id)}>
                            <Delete sx={{ fontSize: { xs: 18, sm: 20 } }} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {mealEntries.length === 0 && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Нет записей</Typography>
                          }
                          secondary={
                            <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                              Добавьте продукты в этот прием пищи
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  </List>

                  {isMobile && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => openAddDialog(meal.id)}
                      sx={{
                        width: "100%",
                        mt: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      Добавить в {meal.name.toLowerCase()}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Add Food Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            m: { xs: 0, sm: 2 },
            height: { xs: "100%", sm: "auto" },
            maxHeight: { xs: "100%", sm: "90vh" },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>Добавить продукт</DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={dialogTab} onChange={(_, newValue) => setDialogTab(newValue)}>
              <Tab label="Из базы продуктов" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />
              <Tab label="Новый продукт" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />
            </Tabs>
          </Box>

          {dialogTab === 0 ? (
            // Products from database
            <Box>
              <TextField
                fullWidth
                placeholder="Поиск продуктов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} key={product.id}>
                    <Card sx={{ "&:hover": { boxShadow: 2 } }}>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: 2, sm: 1 },
                          }}
                        >
                          <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
                            <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                            >
                              {product.calories} ккал • Б: {product.protein}г • У: {product.carbs}г • Ж: {product.fat}г
                              (на 100г)
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              width: { xs: "100%", sm: "auto" },
                              flexDirection: { xs: "row", sm: "row" },
                            }}
                          >
                            <TextField
                              size="small"
                              label="Количество"
                              type="number"
                              defaultValue={100}
                              sx={{ width: { xs: "100px", sm: "100px" } }}
                              id={`amount-${product.id}`}
                            />
                            <FormControl size="small" sx={{ width: { xs: "80px", sm: "80px" } }}>
                              <InputLabel>Ед.</InputLabel>
                              <Select defaultValue="г" label="Ед." id={`unit-${product.id}`}>
                                <MenuItem value="г">г</MenuItem>
                                <MenuItem value="мл">мл</MenuItem>
                                <MenuItem value="шт">шт</MenuItem>
                              </Select>
                            </FormControl>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                minWidth: { xs: "80px", sm: "auto" },
                              }}
                              onClick={() => {
                                const amountInput = document.getElementById(`amount-${product.id}`) as HTMLInputElement
                                const unitSelect = document.getElementById(`unit-${product.id}`) as HTMLInputElement
                                const amount = Number.parseFloat(amountInput.value) || 100
                                const unit = unitSelect.value || "г"
                                addProductFromDatabase(product, amount, unit)
                              }}
                            >
                              Добавить
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {filteredProducts.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Продукты не найдены
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            // Manual product entry
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Название продукта"
                    size={isMobile ? "small" : "medium"}
                    {...register("name", { required: "Название обязательно" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Количество"
                    type="number"
                    size={isMobile ? "small" : "medium"}
                    {...register("amount", { required: "Количество обязательно" })}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Единица</InputLabel>
                    <Select
                      label="Единица"
                      {...register("unit", { required: "Единица обязательна" })}
                      error={!!errors.unit}
                    >
                      <MenuItem value="г">граммы</MenuItem>
                      <MenuItem value="мл">миллилитры</MenuItem>
                      <MenuItem value="шт">штуки</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Калории"
                    type="number"
                    size={isMobile ? "small" : "medium"}
                    {...register("calories", { required: "Калории обязательны" })}
                    error={!!errors.calories}
                    helperText={errors.calories?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Прием пищи</InputLabel>
                    <Select
                      label="Прием пищи"
                      value={selectedMeal}
                      {...register("meal", { required: "Прием пищи обязателен" })}
                      error={!!errors.meal}
                    >
                      {meals.map((meal) => (
                        <MenuItem key={meal.id} value={meal.id}>
                          {meal.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Белки (г)"
                    type="number"
                    size={isMobile ? "small" : "medium"}
                    {...register("protein", { required: "Белки обязательны" })}
                    error={!!errors.protein}
                    helperText={errors.protein?.message}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Углеводы (г)"
                    type="number"
                    size={isMobile ? "small" : "medium"}
                    {...register("carbs", { required: "Углеводы обязательны" })}
                    error={!!errors.carbs}
                    helperText={errors.carbs?.message}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Жиры (г)"
                    type="number"
                    size={isMobile ? "small" : "medium"}
                    {...register("fat", { required: "Жиры обязательны" })}
                    error={!!errors.fat}
                    helperText={errors.fat?.message}
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={() => setOpenDialog(false)} size={isMobile ? "small" : "medium"}>
            Отмена
          </Button>
          {dialogTab === 1 && (
            <Button onClick={handleSubmit(onSubmit)} variant="contained" size={isMobile ? "small" : "medium"}>
              Добавить
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  )
}
