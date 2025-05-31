"use client"

import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
} from "@mui/material"
import { Restaurant, Edit, Add, LocalFireDepartment } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { Meal } from "@/shared/types"

interface RecentMealsProps {
  meals: Meal[]
}

const getMealTypeIcon = (type: string) => {
  const icons = {
    breakfast: "🍳",
    lunch: "🍽️",
    dinner: "🍖",
    snack: "🍎",
  }
  return icons[type as keyof typeof icons] || "🍽️"
}

const getMealTypeLabel = (type: string) => {
  const labels = {
    breakfast: "Завтрак",
    lunch: "Обед",
    dinner: "Ужин",
    snack: "Перекус",
  }
  return labels[type as keyof typeof labels] || type
}

export const RecentMeals = memo(({ meals }: RecentMealsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleEditMeal = (mealId: number) => {
    navigate(`/diary/meal/${mealId}`)
  }

  const handleAddMeal = () => {
    navigate("/diary")
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            {t("dashboard.recentMeals")}
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddMeal} size="small">
            Добавить
          </Button>
        </Box>

        {meals.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Restaurant sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Нет записей за сегодня
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Добавьте первый прием пищи
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddMeal}>
              Добавить прием пищи
            </Button>
          </Box>
        ) : (
          <List>
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    mb: 1,
                    backgroundColor: "action.hover",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      {getMealTypeIcon(meal.type)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {meal.name}
                        </Typography>
                        <Chip
                          icon={<LocalFireDepartment />}
                          label={`${meal.totalCalories} ккал`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {meal.time} • {meal.foods.length} продуктов
                        </Typography>
                        {meal.foods.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {meal.foods
                              .slice(0, 2)
                              .map((food) => food.food?.name || "Продукт")
                              .join(", ")}
                            {meal.foods.length > 2 && ` и еще ${meal.foods.length - 2}`}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditMeal(meal.id)} size="small">
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
})

RecentMeals.displayName = "RecentMeals"
