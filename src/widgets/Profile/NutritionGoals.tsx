"use client"

import { memo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Card, CardContent, Typography, Box, TextField, Button, Grid, Skeleton, Alert } from "@mui/material"
import { Save, Edit, Calculate, LocalFireDepartment, FitnessCenter, Opacity, Grain } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { NutritionGoals } from "@/shared/types"
import { useUpdateGoalsMutation, useCalculateGoalsMutation, useGetProfileQuery } from "@/entities/user/api/userApi"

interface NutritionGoalsProps {
  goals: NutritionGoals | undefined
  isLoading: boolean
  onSuccess: (message: string) => void
}

const schema = yup.object({
  calories: yup.number().min(800, "Минимум 800 ккал").max(5000, "Максимум 5000 ккал").required("Обязательно"),
  protein: yup.number().min(30, "Минимум 30г").max(300, "Максимум 300г").required("Обязательно"),
  fat: yup.number().min(20, "Минимум 20г").max(200, "Максимум 200г").required("Обязательно"),
  carbs: yup.number().min(50, "Минимум 50г").max(500, "Максимум 500г").required("Обязательно"),
})

type FormData = yup.InferType<typeof schema>

const NutritionGoalsComponent = ({ goals, isLoading, onSuccess }: NutritionGoalsProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showCalculated, setShowCalculated] = useState(false)

  const { data: profile } = useGetProfileQuery()
  const [updateGoals, { isLoading: updating }] = useUpdateGoalsMutation()
  const [calculateGoals, { isLoading: calculating }] = useCalculateGoalsMutation()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      calories: goals?.calories || 2000,
      protein: goals?.protein || 150,
      fat: goals?.fat || 67,
      carbs: goals?.carbs || 250,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await updateGoals(data).unwrap()
      setIsEditing(false)
      setShowCalculated(false)
      onSuccess("Цели питания обновлены")
    } catch (error) {
      console.error("Failed to update goals:", error)
    }
  }

  const handleCalculate = async () => {
    if (!profile) return

    try {
      const calculatedGoals = await calculateGoals(profile).unwrap()
      setValue("calories", calculatedGoals.calories)
      setValue("protein", calculatedGoals.protein)
      setValue("fat", calculatedGoals.fat)
      setValue("carbs", calculatedGoals.carbs)
      setShowCalculated(true)
    } catch (error) {
      console.error("Failed to calculate goals:", error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
    setShowCalculated(false)
  }

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Цели питания
          </Typography>
          {!isEditing ? (
            <Button variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button onClick={handleCancel} disabled={updating}>
                Отмена
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty || updating}
              >
                {updating ? "Сохранение..." : "Сохранить"}
              </Button>
            </Box>
          )}
        </Box>

        {showCalculated && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Цели рассчитаны автоматически на основе ваших параметров. Вы можете их скорректировать.
          </Alert>
        )}

        {isEditing && profile && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Calculate />}
              onClick={handleCalculate}
              disabled={calculating}
              fullWidth
            >
              {calculating ? "Расчет..." : "Рассчитать автоматически"}
            </Button>
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="calories"
                control={control}
                render={({ field }) => (
                  <motion.div whileHover={isEditing ? { scale: 1.02 } : {}}>
                    <TextField
                      {...field}
                      label="Калории"
                      type="number"
                      fullWidth
                      error={!!errors.calories}
                      helperText={errors.calories?.message}
                      disabled={!isEditing || updating}
                      InputProps={{
                        startAdornment: <LocalFireDepartment sx={{ mr: 1, color: "error.main" }} />,
                        endAdornment: <Typography variant="body2">ккал</Typography>,
                      }}
                    />
                  </motion.div>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="protein"
                control={control}
                render={({ field }) => (
                  <motion.div whileHover={isEditing ? { scale: 1.02 } : {}}>
                    <TextField
                      {...field}
                      label="Белки"
                      type="number"
                      fullWidth
                      error={!!errors.protein}
                      helperText={errors.protein?.message}
                      disabled={!isEditing || updating}
                      InputProps={{
                        startAdornment: <FitnessCenter sx={{ mr: 1, color: "primary.main" }} />,
                        endAdornment: <Typography variant="body2">г</Typography>,
                      }}
                    />
                  </motion.div>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="fat"
                control={control}
                render={({ field }) => (
                  <motion.div whileHover={isEditing ? { scale: 1.02 } : {}}>
                    <TextField
                      {...field}
                      label="Жиры"
                      type="number"
                      fullWidth
                      error={!!errors.fat}
                      helperText={errors.fat?.message}
                      disabled={!isEditing || updating}
                      InputProps={{
                        startAdornment: <Opacity sx={{ mr: 1, color: "warning.main" }} />,
                        endAdornment: <Typography variant="body2">г</Typography>,
                      }}
                    />
                  </motion.div>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="carbs"
                control={control}
                render={({ field }) => (
                  <motion.div whileHover={isEditing ? { scale: 1.02 } : {}}>
                    <TextField
                      {...field}
                      label="Углеводы"
                      type="number"
                      fullWidth
                      error={!!errors.carbs}
                      helperText={errors.carbs?.message}
                      disabled={!isEditing || updating}
                      InputProps={{
                        startAdornment: <Grain sx={{ mr: 1, color: "success.main" }} />,
                        endAdornment: <Typography variant="body2">г</Typography>,
                      }}
                    />
                  </motion.div>
                )}
              />
            </Grid>
          </Grid>
        </form>

        {!isEditing && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: "action.hover", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              💡 Цели рассчитываются на основе вашего возраста, пола, роста, веса и уровня активности. Для более точных
              рекомендаций обратитесь к специалисту.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

NutritionGoalsComponent.displayName = "NutritionGoalsComponent"

export const NutritionGoals = memo(NutritionGoalsComponent)
