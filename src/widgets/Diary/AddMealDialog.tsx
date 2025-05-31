"use client"

import { memo } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import { motion } from "framer-motion"

import { useCreateMealMutation } from "@/entities/diary/api/diaryApi"

interface AddMealDialogProps {
  open: boolean
  onClose: () => void
  date: string
}

const schema = yup.object({
  type: yup.string().required("Выберите тип приема пищи"),
  name: yup.string().required("Введите название"),
  time: yup.string().required("Укажите время"),
})

type FormData = yup.InferType<typeof schema>

const mealTypes = [
  { value: "breakfast", label: "Завтрак", defaultTime: "08:00", color: "#FF9800" },
  { value: "lunch", label: "Обед", defaultTime: "13:00", color: "#4CAF50" },
  { value: "dinner", label: "Ужин", defaultTime: "19:00", color: "#2196F3" },
  { value: "snack", label: "Перекус", defaultTime: "16:00", color: "#9C27B0" },
]

export const AddMealDialog = memo(({ open, onClose, date }: AddMealDialogProps) => {
  const [createMeal, { isLoading }] = useCreateMealMutation()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "",
      name: "",
      time: "",
    },
  })

  const selectedType = watch("type")

  const handleTypeChange = (type: string) => {
    const mealType = mealTypes.find((t) => t.value === type)
    if (mealType) {
      setValue("type", type)
      setValue("name", mealType.label)
      setValue("time", mealType.defaultTime)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      await createMeal({
        date,
        type: data.type as "breakfast" | "lunch" | "dinner" | "snack",
        name: data.name,
        time: data.time,
      }).unwrap()
      reset()
      onClose()
    } catch (error) {
      console.error("Failed to create meal:", error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="700">Добавить прием пищи</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Выберите тип приема пищи и укажите время
          </Typography>

          {/* Выбор типа приема пищи */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">Тип приема пищи</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
              {mealTypes.map((type) => {
                const isSelected = selectedType === type.value

                return (
                  <motion.div key={type.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      onClick={() => handleTypeChange(type.value)}
                      sx={{
                        cursor: "pointer",
                        border: 2,
                        borderColor: isSelected ? type.color : "divider",
                        backgroundColor: isSelected ? `${type.color}10` : "background.paper",
                        "&:hover": {
                          borderColor: type.color,
                          backgroundColor: `${type.color}05`,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <Typography
                          variant="body1"
                          fontWeight="600"
                          color={isSelected ? type.color : "text.primary"}
                        >
                          {type.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </Box>
          </Box>

          {/* Название и время */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Название"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  sx={{ flex: 2 }}
                />
              )}
            />

            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Время"
                  type="time"
                  error={!!errors.time}
                  helperText={errors.time?.message}
                  InputLabelProps={{ shrink: true }}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: 2,
              px: 4,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: 2 },
            }}
          >
            {isLoading ? "Создание..." : "Создать"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})

AddMealDialog.displayName = "AddMealDialog"
