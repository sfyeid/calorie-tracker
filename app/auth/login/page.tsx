"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

// Схема валидации
const schema = yup.object({
  email: yup.string().email("Введите корректный email").required("Email обязателен"),
  password: yup.string().required("Пароль обязателен").min(6, "Пароль должен содержать минимум 6 символов"),
})

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)

    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Проверка тестовых данных
      if (data.email === "user@example.com" && data.password === "password123") {
        // Сохраняем токен в localStorage (в реальном приложении использовали бы более безопасный способ)
        localStorage.setItem("authToken", "fake-jwt-token")
        localStorage.setItem("user", JSON.stringify({ email: data.email, name: "Иван Иванов", role: "user" }))

        // Перенаправляем на дашборд
        router.push("/dashboard")
      } else {
        setError("Неверный email или пароль")
      }
    } catch (err) {
      setError("Произошла ошибка при входе. Попробуйте позже.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingY: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Вход в систему
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ marginBottom: 3 }}>
            Введите свои данные для доступа к приложению
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Пароль"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              )}
            />

            <Box sx={{ textAlign: "right", marginTop: 1, marginBottom: 2 }}>
              <Link href="/auth/forgot-password" style={{ color: "#2196f3", textDecoration: "none" }}>
                Забыли пароль?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ marginTop: 2, marginBottom: 2, paddingY: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Войти"}
            </Button>

            <Divider sx={{ marginY: 2 }}>
              <Typography variant="body2" color="text.secondary">
                или
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Typography variant="body2">
                Еще нет аккаунта?{" "}
                <Link href="/auth/register" style={{ color: "#2196f3", textDecoration: "none" }}>
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </form>

          <Box sx={{ marginTop: 3, padding: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="caption" display="block" align="center">
              Тестовые данные для входа:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Email: user@example.com
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Пароль: password123
            </Typography>
          </Box>
        </Paper>

        <Button variant="text" color="inherit" onClick={() => router.push("/")} sx={{ marginTop: 2 }}>
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  )
}
