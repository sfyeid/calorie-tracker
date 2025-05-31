"use client"

import { memo } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material"
import { ArrowBack, Save } from "@mui/icons-material"
import { motion } from "framer-motion"

interface MealHeaderProps {
  meal: any
  onSave: (meal: any) => void
}

export const MealHeader = memo(({ meal, onSave }: MealHeaderProps) => {
  const router = useRouter()

  const handleBack = () => {
    router.push("/diary")
  }

  const handleSave = () => {
    onSave(meal)
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={handleBack}
          sx={{ textDecoration: "none", color: "text.secondary" }}
        >
          Дневник питания
        </Link>
        <Typography variant="body2" color="text.primary">
          {meal.name}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Редактирование приема пищи
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {meal.name} • {meal.time} • {meal.totalCalories} ккал
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack}>
              Назад
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
              Сохранить
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  )
})

MealHeader.displayName = "MealHeader"
