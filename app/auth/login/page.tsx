"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container, Paper, TextField, Button, Typography, Box, Alert, Link as MuiLink, Divider } from "@mui/material"
import { Restaurant, Visibility, VisibilityOff } from "@mui/icons-material"
import Link from "next/link"
import { useForm } from "react-hook-form"

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError("")

    try {
      // Mock authentication
      if (data.email === "user@example.com" && data.password === "password") {
        localStorage.setItem("authToken", "mock-jwt-token")
        router.push("/")
      } else {
        setError("Неверный email или пароль")
      }
    } catch (err) {
      setError("Произошла ошибка при входе")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="sm">
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
            Вход в систему
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
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

            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              {...register("password", {
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setShowPassword(!showPassword)} sx={{ minWidth: "auto", p: 1 }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?{" "}
                <MuiLink component={Link} href="/auth/register" underline="hover">
                  Зарегистрироваться
                </MuiLink>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 2, width: "100%" }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              <strong>Демо-доступ:</strong>
              <br />
              Email: user@example.com
              <br />
              Пароль: password
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
