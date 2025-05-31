"use client"

import { memo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Card, CardContent, Typography, Box, TextField, Button, Grid, MenuItem, Skeleton } from "@mui/material"
import { Save, Edit } from "@mui/icons-material"

import type { UserProfile } from "@/shared/types"
import { useUpdateProfileMutation } from "@/entities/user/api/userApi"

interface PersonalInfoProps {
  profile: UserProfile | undefined
  isLoading: boolean
  onSuccess: (message: string) => void
}

const schema = yup.object({
  age: yup.number().min(10, "Минимальный возраст 10 лет").max(120, "Максимальный возраст 120 лет"),
  height: yup.number().min(100, "Минимальный рост 100 см").max(250, "Максимальный рост 250 см"),
  weight: yup.number().min(30, "Минимальный вес 30 кг").max(300, "Максимальный вес 300 кг"),
  gender: yup.string().oneOf(["male", "female"], "Выберите пол"),
  activityLevel: yup
    .string()
    .oneOf(["sedentary", "light", "moderate", "active", "very_active"], "Выберите уровень активности"),
})

type FormData = yup.InferType<typeof schema>

const activityLevels = [
  { value: "sedentary", label: "Малоподвижный (офисная работа)" },
  { value: "light", label: "Легкая активность (1-3 тренировки в неделю)" },
  { value: "moderate", label: "Умеренная активность (3-5 тренировок в неделю)" },
  { value: "active", label: "Активный (6-7 тренировок в неделю)" },
  { value: "very_active", label: "Очень активный (2+ тренировки в день)" },
]

export const PersonalInfo = memo(({ profile, isLoading, onSuccess }: PersonalInfoProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      age: profile?.age || undefined,
      height: profile?.height || undefined,
      weight: profile?.weight || undefined,
      gender: profile?.gender || undefined,
      activityLevel: profile?.activityLevel || undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data).unwrap()
      setIsEditing(false)
      onSuccess("Личная информация обновлена")
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
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
            Личная информация
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Возраст"
                    type="number"
                    fullWidth
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    disabled={!isEditing || updating}
                    InputProps={{
                      endAdornment: <Typography variant="body2">лет</Typography>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Пол"
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                    disabled={!isEditing || updating}
                  >
                    <MenuItem value="male">Мужской</MenuItem>
                    <MenuItem value="female">Женский</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Рост"
                    type="number"
                    fullWidth
                    error={!!errors.height}
                    helperText={errors.height?.message}
                    disabled={!isEditing || updating}
                    InputProps={{
                      endAdornment: <Typography variant="body2">см</Typography>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Вес"
                    type="number"
                    fullWidth
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                    disabled={!isEditing || updating}
                    InputProps={{
                      endAdornment: <Typography variant="body2">кг</Typography>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="activityLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Уровень активности"
                    fullWidth
                    error={!!errors.activityLevel}
                    helperText={errors.activityLevel?.message}
                    disabled={!isEditing || updating}
                  >
                    {activityLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
})

PersonalInfo.displayName = "PersonalInfo"
