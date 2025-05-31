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
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock, Person } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

// Схема валидации
const schema = yup.object({
  name: yup.string().required("Имя обязательно"),
  email: yup.string().email("Введите корректный email").required("Email обязателен"),
  password: yup.string().required("Пароль обязателен").min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли должны совпадать")
    .required("Подтверждение пароля обязательно"),
  agreeTerms: yup.boolean().oneOf([true], "Необходимо согласиться с условиями"),
})

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)

    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Сохраняем токен в localStorage (в реальном приложении использовали бы более безопасный способ)
      localStorage.setItem("authToken", "fake-jwt-token")
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          name: data.name,
          role: "user",
        }),
      )

      // Перенаправляем на дашборд
      router.push("/dashboard")
    } catch (err) {
      setError("Произошла ошибка при регистрации. Попробуйте позже.")
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
            Регистрация
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ marginBottom: 3 }}>
            Создайте аккаунт для доступа к приложению
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Имя"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              )}
            />

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

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Подтвердите пароль"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box sx={{ marginTop: 2 }}>
              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} color="primary" />}
                    label={
                      <Typography variant="body2">
                        Я согласен с{" "}
                        <Link href="/terms" style={{ color: "#2196f3" }}>
                          условиями использования
                        </Link>{" "}
                        и{" "}
                        <Link href="/privacy" style={{ color: "#2196f3" }}>
                          политикой конфиденциальности
                        </Link>
                      </Typography>
                    }
                  />
                )}
              />
              {errors.agreeTerms && (
                <Typography variant="caption" color="error">
                  {errors.agreeTerms.message}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ marginTop: 3, marginBottom: 2, paddingY: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Зарегистрироваться"}
            </Button>

            <Divider sx={{ marginY: 2 }}>
              <Typography variant="body2" color="text.secondary">
                или
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Typography variant="body2">
                Уже есть аккаунт?{" "}
                <Link href="/auth/login" style={{ color: "#2196f3", textDecoration: "none" }}>
                  Войти
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>

        <Button variant="text" color="inherit" onClick={() => router.push("/")} sx={{ marginTop: 2 }}>
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  )
}
