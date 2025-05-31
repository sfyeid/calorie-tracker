"use client"

import { useCallback } from "react"
import { Link, Navigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
import { motion } from "framer-motion"

import { useLoginMutation } from "@/entities/auth/api/authApi"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux"
import { setCredentials } from "@/entities/auth/model/authSlice"
import { useToggle } from "@/shared/hooks/useToggle"

const schema = yup.object({
  email: yup.string().email("auth.emailInvalid").required("auth.emailRequired"),
  password: yup.string().required("auth.passwordRequired").min(6, "auth.passwordMinLength"),
})

type FormData = yup.InferType<typeof schema>

const LoginPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [showPassword, toggleShowPassword] = useToggle(false)

  const [login, { isLoading, error }] = useLoginMutation()

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

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const result = await login(data).unwrap()
        dispatch(setCredentials(result))
      } catch (err) {
        console.error("Login failed:", err)
      }
    },
    [login, dispatch],
  )

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                {t("auth.login")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Добро пожаловать в Calorie Tracker
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Неверный email или пароль
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("auth.email")}
                    type="email"
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
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("auth.password")}
                    type={showPassword ? "text" : "password"}
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
                          <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    disabled={isLoading}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                {isLoading ? "Вход..." : t("auth.loginButton")}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  или
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  {t("auth.noAccount")}{" "}
                  <Link
                    to="/auth/register"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    {t("auth.register")}
                  </Link>
                </Typography>
              </Box>
            </form>

            {/* Тестовые данные */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                backgroundColor: "action.hover",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" display="block" gutterBottom>
                Тестовые данные для входа:
              </Typography>
              <Typography variant="caption" display="block">
                Email: user@example.com
              </Typography>
              <Typography variant="caption" display="block">
                Пароль: password123
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  )
}

export default LoginPage
