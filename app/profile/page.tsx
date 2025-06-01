"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Person, Edit, Save, Calculate } from "@mui/icons-material"
import { useForm } from "react-hook-form"

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  age: number
  gender: string
  height: number
  weight: number
  activityLevel: string
  goal: string
}

export default function ProfilePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [editMode, setEditMode] = useState(false)
  const [success, setSuccess] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: "Иван",
      lastName: "Петров",
      email: "user@example.com",
      age: 30,
      gender: "male",
      height: 180,
      weight: 75,
      activityLevel: "moderate",
      goal: "maintain",
    },
  })

  const watchedValues = watch()

  // Расчет базового метаболизма по формуле Миффлина-Сан Жеора
  const calculateBMR = () => {
    const { weight, height, age, gender } = watchedValues
    if (!weight || !height || !age) return 0

    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  // Расчет общего расхода калорий
  const calculateTDEE = () => {
    const bmr = calculateBMR()
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }
    return Math.round(bmr * activityMultipliers[watchedValues.activityLevel as keyof typeof activityMultipliers])
  }

  // Расчет целевых калорий в зависимости от цели
  const calculateTargetCalories = () => {
    const tdee = calculateTDEE()
    const goalAdjustments = {
      lose: -500, // дефицит 500 ккал для похудения
      maintain: 0, // поддержание веса
      gain: 300, // профицит 300 ккал для набора массы
    }
    return tdee + goalAdjustments[watchedValues.goal as keyof typeof goalAdjustments]
  }

  // Расчет макронутриентов
  const calculateMacros = () => {
    const targetCalories = calculateTargetCalories()
    return {
      protein: Math.round((targetCalories * 0.25) / 4), // 25% от калорий
      carbs: Math.round((targetCalories * 0.45) / 4), // 45% от калорий
      fat: Math.round((targetCalories * 0.3) / 9), // 30% от калорий
    }
  }

  const onSubmit = (data: ProfileForm) => {
    console.log("Profile updated:", data)
    setEditMode(false)
    setSuccess("Профиль успешно обновлен!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const targetCalories = calculateTargetCalories()
  const macros = calculateMacros()

  const activityLevels = {
    sedentary: "Малоподвижный",
    light: "Легкая активность",
    moderate: "Умеренная активность",
    active: "Высокая активность",
    very_active: "Очень высокая активность",
  }

  const goals = {
    lose: "Похудение",
    maintain: "Поддержание веса",
    gain: "Набор массы",
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          fontWeight: 600,
          fontSize: {
            xs: "1.5rem",
            sm: "1.75rem",
            md: "2rem",
            lg: "2.125rem",
          },
        }}
      >
        Профиль пользователя
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 } }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Personal Information */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: { xs: 2, sm: 3 },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}>
                  Личная информация
                </Typography>
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  startIcon={editMode ? <Save /> : <Edit />}
                  onClick={() => {
                    if (editMode) {
                      handleSubmit(onSubmit)()
                    } else {
                      setEditMode(true)
                    }
                  }}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  {editMode ? "Сохранить" : "Редактировать"}
                </Button>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Имя"
                      disabled={!editMode}
                      size={isMobile ? "small" : "medium"}
                      {...register("firstName", { required: "Имя обязательно" })}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Фамилия"
                      disabled={!editMode}
                      size={isMobile ? "small" : "medium"}
                      {...register("lastName", { required: "Фамилия обязательна" })}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      disabled={!editMode}
                      size={isMobile ? "small" : "medium"}
                      {...register("email", { required: "Email обязателен" })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Возраст"
                      type="number"
                      disabled={!editMode}
                      size={isMobile ? "small" : "medium"}
                      {...register("age", { required: "Возраст обязателен" })}
                      error={!!errors.age}
                      helperText={errors.age?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth disabled={!editMode} size={isMobile ? "small" : "medium"}>
                      <InputLabel>Пол</InputLabel>
                      <Select
                        label="Пол"
                        {...register("gender", { required: "Пол обязателен" })}
                        error={!!errors.gender}
                      >
                        <MenuItem value="male">Мужской</MenuItem>
                        <MenuItem value="female">Женский</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Рост (см)"
                      type="number"
                      disabled={!editMode}
                      size={isMobile ? "small" : "medium"}
                      {...register("height", { required: "Рост обязателен" })}
                      error={!!errors.height}
                      helperText={errors.height?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Вес (кг)"
                      type="number"
                      disabled={!editMode}
                      size={isMobile ? "small" : "medium"}
                      {...register("weight", { required: "Вес обязателен" })}
                      error={!!errors.weight}
                      helperText={errors.weight?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!editMode} size={isMobile ? "small" : "medium"}>
                      <InputLabel>Уровень активности</InputLabel>
                      <Select
                        label="Уровень активности"
                        {...register("activityLevel", { required: "Уровень активности обязателен" })}
                        error={!!errors.activityLevel}
                      >
                        {Object.entries(activityLevels).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!editMode} size={isMobile ? "small" : "medium"}>
                      <InputLabel>Цель</InputLabel>
                      <Select
                        label="Цель"
                        {...register("goal", { required: "Цель обязательна" })}
                        error={!!errors.goal}
                      >
                        {Object.entries(goals).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: { xs: 2, sm: 3 } }}>
            <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3, md: 4 } }}>
              <Avatar
                sx={{
                  width: { xs: 60, sm: 80, md: 100 },
                  height: { xs: 60, sm: 80, md: 100 },
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                }}
              >
                <Person sx={{ fontSize: { xs: 30, sm: 40, md: 50 } }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  mb: 1,
                }}
              >
                {watchedValues.firstName} {watchedValues.lastName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  wordBreak: "break-word",
                  mb: 2,
                }}
              >
                {watchedValues.email}
              </Typography>
              <Chip
                label={goals[watchedValues.goal as keyof typeof goals]}
                color="primary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  height: { xs: 28, sm: 32 },
                }}
              />
            </CardContent>
          </Card>

          {/* Calculated Goals */}
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 3 } }}>
                <Calculate sx={{ mr: 1, color: "primary.main", fontSize: { xs: 20, sm: 24 } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}>
                  Рассчитанные цели
                </Typography>
              </Box>

              <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Базовый метаболизм (BMR)
                </Typography>
                <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}>
                  {Math.round(calculateBMR())} ккал
                </Typography>
              </Box>

              <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

              <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Общий расход калорий (TDEE)
                </Typography>
                <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}>
                  {calculateTDEE()} ккал
                </Typography>
              </Box>

              <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

              <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Целевые калории
                </Typography>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
                >
                  {targetCalories} ккал
                </Typography>
              </Box>

              <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Макронутриенты:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.5, sm: 1 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Белки:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    {macros.protein}г
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Углеводы:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    {macros.carbs}г
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Жиры:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    {macros.fat}г
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
