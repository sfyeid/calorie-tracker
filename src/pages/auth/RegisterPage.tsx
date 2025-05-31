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
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock, Person } from "@mui/icons-material"
import { motion } from "framer-motion"

import { useRegisterMutation } from "@/entities/auth/api/authApi"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux"
import { setCredentials } from "@/entities/auth/model/authSlice"
import { useToggle } from "@/shared/hooks/useToggle"

const schema = yup.object({
  name: yup.string().required("auth.nameRequired").min(2, "auth.nameMinLength"),
  email: yup.string().email("auth.emailInvalid").required("auth.emailRequired"),
  password: yup.string().required("auth.passwordRequired").min(6, "auth.passwordMinLength"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "auth.passwordsNotMatch")
    .required("auth.confirmPasswordRequired"),
  agreeTerms: yup.boolean().oneOf([true], "auth.agreeTermsRequired"),
})

type FormData = yup.InferType<typeof schema>

const RegisterPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [showPassword, toggleShowPassword] = useToggle(false)
  const [showConfirmPassword, toggleShowConfirmPassword] = useToggle(false)

  const [register, { isLoading, error }] = useRegisterMutation()

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

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const { agreeTerms, confirmPassword, ...registerData } = data
        const result = await register(registerData).unwrap()
        dispatch(setCredentials(result))
      } catch (err) {
        console.error("Registration failed:", err)
      }
    },
    [register, dispatch],
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
                {t("auth.register")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Создайте аккаунт для начала работы
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Ошибка при регистрации. Попробуйте еще раз.
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("auth.name")}
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
                    disabled={isLoading}
                  />
                )}
              />

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

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={toggleShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={isLoading}
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
                        label={t("auth.confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
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
                                onClick={toggleShowConfirmPassword}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Controller
                  name="agreeTerms"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} color="primary" />}
                      label={
                        <Typography variant="body2">
                          Я согласен с{" "}
                          <Link to="/terms" style={{ color: "inherit" }}>
                            условиями использования
                          </Link>{" "}
                          и{" "}
                          <Link to="/privacy" style={{ color: "inherit" }}>
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
                {isLoading ? "Регистрация..." : t("auth.registerButton")}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  или
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  {t("auth.hasAccount")}{" "}
                  <Link
                    to="/auth/login"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    {t("auth.login")}
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  )
}

export default RegisterPage
