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
  Skeleton,
} from "@mui/material"
import { Coffee, Sun, Sunset, Apple, Edit, Trash2, Plus, LocalFireDepartment, Clock } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

import type { Meal } from "@/shared/types"
import { useDeleteMealMutation } from "@/entities/diary/api/diaryApi"

interface MealsListProps {
  meals: Meal[]
  isLoading: boolean
  onAddMeal: () => void
}

const getMealTypeIcon = (type: string) => {
  const icons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Sunset,
    snack: Apple,
  }
  return icons[type as keyof typeof icons] || Sun
}

const getMealTypeColor = (type: string) => {
  const colors = {
    breakfast: "#FF9800",
    lunch: "#4CAF50",
    dinner: "#2196F3",
    snack: "#9C27B0",
  }
  return colors[type as keyof typeof colors] || "#757575"
}

export const MealsList = memo(({ meals, isLoading, onAddMeal }: MealsListProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [deleteMeal] = useDeleteMealMutation()

  const handleEditMeal = (mealId: number) => {
    navigate(`/diary/meal/${mealId}`)
  }

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await deleteMeal(mealId).unwrap()
    } catch (error) {
      console.error("Failed to delete meal:", error)
    }
  }

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h5" fontWeight="700">
            Приемы пищи
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={onAddMeal}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            Добавить прием пищи
          </Button>
        </Box>

        {meals.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sun sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="600">
                Нет записей за этот день
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>
                Добавьте первый прием пищи, чтобы начать отслеживание питания
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={onAddMeal}
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Добавить прием пищи
              </Button>
            </motion.div>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {meals.map((meal, index) => {
                const IconComponent = getMealTypeIcon(meal.type)

                return (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <ListItem
                      sx={{
                        mb: 3,
                        backgroundColor: "background.paper",
                        borderRadius: 3,
                        border: 1,
                        borderColor: "divider",
                        p: 3,
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: 3,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 3,
                            backgroundColor: getMealTypeColor(meal.type),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <IconComponent sx={{ fontSize: 28 }} />
                        </Box>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                              <Typography variant="h6" fontWeight="700">
                                {meal.name}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Clock sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography variant="body2" color="text.secondary" fontWeight="500">
                                  {meal.time}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              icon={<LocalFireDepartment />}
                              label={`${meal.totalCalories} ккал`}
                              size="medium"
                              color="error"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            {meal.foods.length > 0 ? (
                              <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                                  {meal.foods.length} продуктов:{" "}
                                  {meal.foods
                                    .slice(0, 3)
                                    .map((food) => food.food?.name || "Продукт")
                                    .join(", ")}
                                  {meal.foods.length > 3 && ` и еще ${meal.foods.length - 3}`}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 3 }}>
                                  <Typography variant="body2" color="primary.main" fontWeight="600">
                                    Б: {meal.totalProtein.toFixed(1)}г
                                  </Typography>
                                  <Typography variant="body2" color="warning.main" fontWeight="600">
                                    Ж: {meal.totalFat.toFixed(1)}г
                                  </Typography>
                                  <Typography variant="body2" color="success.main" fontWeight="600">
                                    У: {meal.totalCarbs.toFixed(1)}г
                                  </Typography>
                                </Box>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                Нет добавленных продуктов
                              </Typography>
                            )}
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton
                              edge="end"
                              onClick={() => handleEditMeal(meal.id)}
                              color="primary"
                              size="medium"
                              sx={{
                                backgroundColor: "primary.50",
                                "&:hover": {
                                  backgroundColor: "primary.100",
                                },
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteMeal(meal.id)}
                              size="medium"
                              sx={{
                                color: "text.secondary",
                                backgroundColor: "grey.50",
                                "&:hover": {
                                  backgroundColor: "error.50",
                                  color: "error.main",
                                },
                              }}
                            >
                              <Trash2 />
                            </IconButton>
                          </motion.div>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </List>
        )}
      </CardContent>
    </Card>
  )
})

MealsList.displayName = "MealsList"
