"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Avatar,
  FitnessCenter,
  Grain,
  Restaurant,
  Add,
  Favorite,
  FavoriteBorder,
  LocalFireDepartment,
  Opacity,
} from "@mui/material"

interface Food {
  id: number
  name: string
  category: string
  calories: number
  protein: number
  fat: number
  carbs: number
  per100g: boolean
  isFavorite?: boolean
}

export default function FoodsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [foods, setFoods] = useState<Food[]>([])
  const [favorites, setFavorites] = useState<Food[]>([])

  const categories = [
    { value: "all", label: "Все" },
    { value: "Мясо", label: "Мясо" },
    { value: "Крупы", label: "Крупы" },
    { value: "Фрукты", label: "Фрукты" },
    { value: "Овощи", label: "Овощи" },
    { value: "Молочные", label: "Молочные" },
    { value: "Рыба", label: "Рыба" },
  ]

  // Загрузка данных о продуктах
  useEffect(() => {
    const loadFoods = () => {
      const mockFoods: Food[] = [
        {
          id: 1,
          name: "Куриная грудка",
          category: "Мясо",
          calories: 165,
          protein: 31,
          fat: 3.6,
          carbs: 0,
          per100g: true,
        },
        {
          id: 2,
          name: "Рис белый",
          category: "Крупы",
          calories: 130,
          protein: 2.7,
          fat: 0.3,
          carbs: 28,
          per100g: true,
        },
        {
          id: 3,
          name: "Яблоко",
          category: "Фрукты",
          calories: 52,
          protein: 0.3,
          fat: 0.2,
          carbs: 14,
          per100g: true,
        },
        {
          id: 4,
          name: "Гречка",
          category: "Крупы",
          calories: 343,
          protein: 13.3,
          fat: 3.4,
          carbs: 62,
          per100g: true,
        },
        {
          id: 5,
          name: "Лосось",
          category: "Рыба",
          calories: 208,
          protein: 20,
          fat: 13,
          carbs: 0,
          per100g: true,
        },
        {
          id: 6,
          name: "Творог 5%",
          category: "Молочные",
          calories: 121,
          protein: 17.2,
          fat: 5,
          carbs: 1.8,
          per100g: true,
        },
        {
          id: 7,
          name: "Банан",
          category: "Фрукты",
          calories: 89,
          protein: 1.1,
          fat: 0.3,
          carbs: 23,
          per100g: true,
        },
        {
          id: 8,
          name: "Брокколи",
          category: "Овощи",
          calories: 34,
          protein: 2.8,
          fat: 0.4,
          carbs: 7,
          per100g: true,
        },
      ]
      setFoods(mockFoods)
    }

    loadFoods()
  }, [])

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (foodId: number) => {
    const food = foods.find((f) => f.id === foodId)
    if (!food) return

    if (favorites.some((f) => f.id === foodId)) {
      setFavorites(favorites.filter((f) => f.id !== foodId))
    } else {
      setFavorites([...favorites, food])
    }
  }

  const isFavorite = (foodId: number) => {
    return favorites.some((f) => f.id === foodId)
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: JSX.Element } = {
      Мясо: <FitnessCenter />,
      Крупы: <Grain />,
      Фрукты: <Restaurant />,
      Овощи: <Restaurant />,
      Молочные: <Opacity />,
      Рыба: <Restaurant />,
    }
    return icons[category] || <Restaurant />
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/dashboard")}>
            <FitnessCenter />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            База продуктов
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
        {/* Поиск */}
        <Paper sx={{ padding: 2, marginBottom: 3, borderRadius: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск продуктов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Grain />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Категории */}
        <Paper sx={{ marginBottom: 3, borderRadius: 2 }}>
          <Tabs
            value={selectedCategory}
            onChange={(e, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category) => (
              <Tab key={category.value} label={category.label} value={category.value} />
            ))}
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {/* Список продуктов */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: 2 }}>
              <Box sx={{ padding: 2, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="h6">Найдено продуктов: {filteredFoods.length}</Typography>
              </Box>

              <List>
                {filteredFoods.map((food) => (
                  <ListItem
                    key={food.id}
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ backgroundColor: "primary.main" }}>{getCategoryIcon(food.category)}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="subtitle1" component="span">
                            {food.name}
                          </Typography>
                          <Chip label={food.category} size="small" variant="outlined" />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ marginTop: 1 }}>
                          <Box sx={{ display: "flex", gap: 2, marginBottom: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <LocalFireDepartment sx={{ fontSize: 16 }} color="error" />
                              <Typography variant="caption" component="span">
                                {food.calories} ккал
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <FitnessCenter sx={{ fontSize: 16 }} color="primary" />
                              <Typography variant="caption" component="span">
                                Б: {food.protein}г
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Opacity sx={{ fontSize: 16 }} color="warning" />
                              <Typography variant="caption" component="span">
                                Ж: {food.fat}г
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Grain sx={{ fontSize: 16 }} color="success" />
                              <Typography variant="caption" component="span">
                                У: {food.carbs}г
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary" component="div">
                            на 100г продукта
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => toggleFavorite(food.id)}
                          color={isFavorite(food.id) ? "error" : "default"}
                        >
                          {isFavorite(food.id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <IconButton edge="end" color="primary" onClick={() => router.push(`/foods/${food.id}/add`)}>
                          <Add />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {filteredFoods.length === 0 && (
                <Box sx={{ textAlign: "center", paddingY: 4 }}>
                  <Grain sx={{ fontSize: 64, color: "text.secondary", marginBottom: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Продукты не найдены
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Попробуйте изменить поисковый запрос или выбрать другую категорию
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Избранные продукты */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Избранные продукты
                </Typography>

                {favorites.length === 0 ? (
                  <Box sx={{ textAlign: "center", paddingY: 2 }}>
                    <FavoriteBorder sx={{ fontSize: 48, color: "text.secondary", marginBottom: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Нет избранных продуктов
                    </Typography>
                  </Box>
                ) : (
                  <List dense>
                    {favorites.slice(0, 5).map((food) => (
                      <ListItem key={food.id} sx={{ paddingX: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Favorite color="error" sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2">{food.name}</Typography>}
                          secondary={<Typography variant="caption">{food.calories} ккал</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {favorites.length > 5 && (
                  <Button size="small" fullWidth>
                    Показать все ({favorites.length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Быстрые действия */}
            <Card sx={{ marginTop: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Быстрые действия
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Add />}
                  sx={{ marginBottom: 1 }}
                  onClick={() => router.push("/foods/add")}
                >
                  Добавить продукт
                </Button>

                <Button variant="outlined" fullWidth startIcon={<Restaurant />} onClick={() => router.push("/recipes")}>
                  Создать рецепт
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
