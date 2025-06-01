"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Restaurant } from "@mui/icons-material"
import Link from "next/link"
import { useForm } from "react-hook-form"

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  age: number
  gender: string
  height: number
  weight: number
  activityLevel: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch("password")

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError("")

    try {
      // Mock registration
      console.log("Registration data:", data)
      localStorage.setItem("authToken", "mock-jwt-token")
      router.push("/")
    } catch (err) {
      setError("Произошла ошибка при регистрации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Restaurant sx={{ fontSize: 40, color: "primary.main", mr: 1 }} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
              CalorieTracker
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" sx={{ mb: 3, textAlign: "center" }}>
            Регистрация
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Имя"
                  autoFocus
                  {...register("firstName", { required: "Имя обязательно" })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Фамилия"
                  {...register("lastName", { required: "Фамилия обязательна" })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  {...register("email", {
                    required: "Email обязателен",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Неверный формат email",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Пароль"
                  type="password"
                  {...register("password", {
                    required: "Пароль обязателен",
                    minLength: {
                      value: 6,
                      message: "Пароль должен содержать минимум 6 символов",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Подтвердите пароль"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Подтверждение пароля обязательно",
                    validate: (value) => value === password || "Пароли не совпадают",
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Возраст"
                  type="number"
                  {...register("age", {
                    required: "Возраст обязателен",
                    min: { value: 16, message: "Минимальный возраст 16 лет" },
                    max: { value: 100, message: "Максимальный возраст 100 лет" },
                  })}
                  error={!!errors.age}
                  helperText={errors.age?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Пол</InputLabel>
                  <Select label="Пол" {...register("gender", { required: "Пол обязателен" })} error={!!errors.gender}>
                    <MenuItem value="male">Мужской</MenuItem>
                    <MenuItem value="female">Женский</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Рост (см)"
                  type="number"
                  {...register("height", {
                    required: "Рост обязателен",
                    min: { value: 100, message: "Минимальный рост 100 см" },
                    max: { value: 250, message: "Максимальный рост 250 см" },
                  })}
                  error={!!errors.height}
                  helperText={errors.height?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Вес (кг)"
                  type="number"
                  {...register("weight", {
                    required: "Вес обязателен",
                    min: { value: 30, message: "Минимальный вес 30 кг" },
                    max: { value: 300, message: "Максимальный вес 300 кг" },
                  })}
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Уровень активности</InputLabel>
                  <Select
                    label="Уровень активности"
                    {...register("activityLevel", { required: "Уровень активности обязателен" })}
                    error={!!errors.activityLevel}
                  >
                    <MenuItem value="sedentary">Малоподвижный</MenuItem>
                    <MenuItem value="light">Легкая активность</MenuItem>
                    <MenuItem value="moderate">Умеренная активность</MenuItem>
                    <MenuItem value="active">Высокая активность</MenuItem>
                    <MenuItem value="very_active">Очень высокая активность</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Уже есть аккаунт?{" "}
                <MuiLink component={Link} href="/auth/login" underline="hover">
                  Войти
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
