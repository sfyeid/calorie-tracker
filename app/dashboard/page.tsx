"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material"
import {
  TrendingUp,
  Restaurant,
  LocalFireDepartment,
  FitnessCenter,
  Opacity,
  Grain,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  AccountCircle,
  ExitToApp,
  Dashboard,
  MenuBook,
  Search,
  Person,
  Settings,
} from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

export default function DashboardPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [foodDialogOpen, setFoodDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [mealEditDialogOpen, setMealEditDialogOpen] = useState(false)
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null)
  const [selectedMealType, setSelectedMealType] = useState("")
  const [newMealName, setNewMealName] = useState("")
  const [newMealTime, setNewMealTime] = useState("")

  const mealTypes = [
    { value: "breakfast", label: "Завтрак", defaultTime: "08:00" },
    { value: "lunch", label: "Обед", defaultTime: "13:00" },
    { value: "dinner", label: "Ужин", defaultTime: "19:00" },
    { value: "snack", label: "Перекус", defaultTime: "16:00" },
  ]

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("user")

      if (!token) {
        router.push("/auth/login")
        return
      }

      if (userData) {
        setUser(JSON.parse(userData))
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleOpenFoodDialog = () => {
    setFoodDialogOpen(true)
  }

  const handleCloseFoodDialog = () => {
    setFoodDialogOpen(false)
  }

  const handleOpenSettingsDialog = () => {
    setSettingsDialogOpen(true)
  }

  const handleCloseSettingsDialog = () => {
    setSettingsDialogOpen(false)
  }

  const handleOpenMealEditDialog = (mealId: number) => {
    setSelectedMealId(mealId)
    setMealEditDialogOpen(true)
  }

  const handleCloseMealEditDialog = () => {
    setSelectedMealId(null)
    setMealEditDialogOpen(false)
  }

  const handleMealTypeChange = (type: string) => {
    setSelectedMealType(type)
    const mealTypeInfo = mealTypes.find((t) => t.value === type)
    if (mealTypeInfo) {
      setNewMealName(mealTypeInfo.label)
      setNewMealTime(mealTypeInfo.defaultTime)
    }
  }

  const handleAddMeal = () => {
    // Здесь будет логика добавления приема пищи
    handleCloseFoodDialog()
  }

  const customTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#2196f3",
      },
      secondary: {
        main: "#f50057",
      },
    },
  })

  // Данные для дашборда
  const nutritionData = {
    calories: {
      current: 1450,
      target: 2000,
      unit: "ккал",
    },
    protein: {
      current: 85,
      target: 150,
      unit: "г",
    },
    fat: {
      current: 45,
      target: 67,
      unit: "г",
    },
    carbs: {
      current: 180,
      target: 250,
      unit: "г",
    },
  }

  const recentMeals = [
    {
      id: 1,
      name: "Завтрак",
      time: "08:30",
      calories: 420,
      items: ["Овсянка с фруктами", "Греческий йогурт", "Кофе"],
    },
    {
      id: 2,
      name: "Обед",
      time: "13:00",
      calories: 650,
      items: ["Куриная грудка", "Рис с овощами", "Салат"],
    },
    {
      id: 3,
      name: "Полдник",
      time: "16:30",
      calories: 180,
      items: ["Яблоко", "Орехи"],
    },
  ]

  const menuItems = [
    { text: "Дашборд", icon: <Dashboard />, path: "/dashboard" },
    { text: "Дневник питания", icon: <MenuBook />, path: "/diary" },
    { text: "База продуктов", icon: <Search />, path: "/foods" },
    { text: "Аналитика", icon: <TrendingUp />, path: "/analytics" },
    { text: "Профиль", icon: <Person />, path: "/profile" },
    { text: "Настройки", icon: <Settings />, onClick: handleOpenSettingsDialog },
  ]

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Меню
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              if (item.onClick) {
                item.onClick()
              } else if (item.path) {
                router.push(item.path)
              }
              setMobileOpen(false)
            }}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Загрузка...</Typography>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ marginRight: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Calorie Tracker
            </Typography>
            <IconButton color="inherit" onClick={handleToggleTheme}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton color="inherit" onClick={() => router.push("/profile")}>
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, padding: 3, width: { sm: `calc(100% - 240px)` } }}>
          <Toolbar />

          <Container maxWidth="lg">
            <Box sx={{ marginBottom: 4 }}>
              <Typography variant="h4" gutterBottom>
                Добро пожаловать, {user?.name || "Пользователь"}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ваш дневной прогресс на сегодня
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Основные показатели */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ padding: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Дневные цели
                  </Typography>

                  <Box sx={{ marginBottom: 3 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocalFireDepartment color="error" sx={{ marginRight: 1 }} />
                        <Typography variant="body1">Калории</Typography>
                      </Box>
                      <Typography variant="body2">
                        {nutritionData.calories.current} / {nutritionData.calories.target} {nutritionData.calories.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(nutritionData.calories.current / nutritionData.calories.target) * 100}
                      color="error"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ marginBottom: 3 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FitnessCenter color="primary" sx={{ marginRight: 1 }} />
                        <Typography variant="body1">Белки</Typography>
                      </Box>
                      <Typography variant="body2">
                        {nutritionData.protein.current} / {nutritionData.protein.target} {nutritionData.protein.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(nutritionData.protein.current / nutritionData.protein.target) * 100}
                      color="primary"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ marginBottom: 3 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Opacity color="warning" sx={{ marginRight: 1 }} />
                        <Typography variant="body1">Жиры</Typography>
                      </Box>
                      <Typography variant="body2">
                        {nutritionData.fat.current} / {nutritionData.fat.target} {nutritionData.fat.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(nutritionData.fat.current / nutritionData.fat.target) * 100}
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Grain color="success" sx={{ marginRight: 1 }} />
                        <Typography variant="body1">Углеводы</Typography>
                      </Box>
                      <Typography variant="body2">
                        {nutritionData.carbs.current} / {nutritionData.carbs.target} {nutritionData.carbs.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(nutritionData.carbs.current / nutritionData.carbs.target) * 100}
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Сводка */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%", borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Сводка за сегодня
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                      <Avatar sx={{ backgroundColor: "primary.main", marginRight: 2 }}>
                        <TrendingUp />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Осталось калорий
                        </Typography>
                        <Typography variant="h5">
                          {nutritionData.calories.target - nutritionData.calories.current} ккал
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ backgroundColor: "secondary.main", marginRight: 2 }}>
                        <Restaurant />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Приемов пищи
                        </Typography>
                        <Typography variant="h5">{recentMeals.length}</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ marginY: 2 }} />

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleOpenFoodDialog}
                      sx={{ marginBottom: 1 }}
                    >
                      Добавить прием пищи
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => router.push("/foods")}>
                      Поиск продуктов
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Недавние приемы пищи */}
              <Grid item xs={12}>
                <Paper sx={{ padding: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Недавние приемы пищи
                  </Typography>

                  <List>
                    {recentMeals.map((meal) => (
                      <ListItem
                        key={meal.id}
                        sx={{
                          marginBottom: 1,
                          backgroundColor: "background.paper",
                          borderRadius: 1,
                          "&:hover": { backgroundColor: "action.hover" },
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenMealEditDialog(meal.id)}
                      >
                        <ListItemIcon>
                          <Avatar sx={{ backgroundColor: "primary.main" }}>
                            <Restaurant />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="subtitle1">{meal.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {meal.time} • {meal.calories} ккал
                              </Typography>
                            </Box>
                          }
                          secondary={meal.items.join(", ")}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <Button variant="text" onClick={() => router.push("/diary")}>
                      Показать все записи
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Быстрые действия */}
              <Grid item xs={12}>
                <Paper sx={{ padding: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Быстрые действия
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => router.push("/foods")}
                        sx={{ marginBottom: 1 }}
                      >
                        Добавить продукт
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button variant="outlined" fullWidth onClick={() => router.push("/diary")}>
                        Дневник
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button variant="outlined" fullWidth onClick={() => router.push("/analytics")}>
                        Аналитика
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button variant="outlined" fullWidth onClick={() => router.push("/settings")}>
                        Цели
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Диалог добавления приема пищи */}
        <Dialog open={foodDialogOpen} onClose={handleCloseFoodDialog} maxWidth="sm" fullWidth>
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
            <Button onClick={handleCloseFoodDialog}>Отмена</Button>
            <Button onClick={handleAddMeal} variant="contained">
              Добавить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог настроек */}
        <Dialog open={settingsDialogOpen} onClose={handleCloseSettingsDialog} maxWidth="md" fullWidth>
          <DialogTitle>Настройки</DialogTitle>
          <DialogContent>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Общие настройки
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Тема"
                    value={isDarkMode ? "dark" : "light"}
                    onChange={(e) => setIsDarkMode(e.target.value === "dark")}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="light">Светлая</MenuItem>
                    <MenuItem value="dark">Темная</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select label="Язык" value="ru" fullWidth margin="normal">
                    <MenuItem value="ru">Русский</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Цели питания
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые калории"
                    type="number"
                    defaultValue={2000}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography variant="body2">ккал</Typography>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые белки"
                    type="number"
                    defaultValue={150}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые жиры"
                    type="number"
                    defaultValue={67}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые углеводы"
                    type="number"
                    defaultValue={250}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSettingsDialog}>Отмена</Button>
            <Button onClick={handleCloseSettingsDialog} variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог редактирования приема пищи */}
        <Dialog open={mealEditDialogOpen} onClose={handleCloseMealEditDialog} maxWidth="md" fullWidth>
          <DialogTitle>Редактирование приема пищи</DialogTitle>
          <DialogContent>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                {recentMeals.find((meal) => meal.id === selectedMealId)?.name || "Прием пищи"}
              </Typography>

              <TextField
                label="Название"
                defaultValue={recentMeals.find((meal) => meal.id === selectedMealId)?.name}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Время"
                type="time"
                defaultValue={recentMeals.find((meal) => meal.id === selectedMealId)?.time}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Продукты
              </Typography>

              <List>
                {recentMeals
                  .find((meal) => meal.id === selectedMealId)
                  ?.items.map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        marginBottom: 1,
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
              </List>

              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Добавить продукт
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMealEditDialog}>Отмена</Button>
            <Button onClick={handleCloseMealEditDialog} variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}
