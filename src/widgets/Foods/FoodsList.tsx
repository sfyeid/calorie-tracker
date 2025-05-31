"use client"

import { memo } from "react"
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
  Avatar,
  Pagination,
  Skeleton,
} from "@mui/material"
import { Restaurant, Add, FavoriteBorder, LocalFireDepartment } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

import type { Food } from "@/shared/types"
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from "@/entities/food/api/foodsApi"

interface FoodsListProps {
  foods: Food[]
  isLoading: boolean
  total: number
  page: number
  onPageChange: (page: number) => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    Мясо: "#F44336",
    Рыба: "#2196F3",
    Молочные: "#FF9800",
    Крупы: "#8BC34A",
    Овощи: "#4CAF50",
    Фрукты: "#E91E63",
    Орехи: "#795548",
  }
  return colors[category as keyof typeof colors] || "#757575"
}

const getCategoryIcon = (category: string) => {
  const icons = {
    Мясо: "🥩",
    Рыба: "🐟",
    Молочные: "🥛",
    Крупы: "🌾",
    Овощи: "🥬",
    Фрукты: "🍎",
    Орехи: "🥜",
  }
  return icons[category as keyof typeof icons] || "🍽️"
}

export const FoodsList = memo(({ foods, isLoading, total, page, onPageChange }: FoodsListProps) => {
  const { t } = useTranslation()
  const [addToFavorites] = useAddToFavoritesMutation()
  const [removeFromFavorites] = useRemoveFromFavoritesMutation()

  const handleToggleFavorite = async (foodId: number, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await removeFromFavorites(foodId).unwrap()
      } else {
        await addToFavorites(foodId).unwrap()
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const totalPages = Math.ceil(total / 20)

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Найдено продуктов: {total}
          </Typography>
        </Box>

        {foods.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Restaurant sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Продукты не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {foods.map((food, index) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <ListItem
                      sx={{
                        mb: 2,
                        backgroundColor: "background.paper",
                        borderRadius: 3,
                        border: 1,
                        borderColor: "divider",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: 2,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            backgroundColor: getCategoryColor(food.category),
                            width: 50,
                            height: 50,
                            fontSize: "1.5rem",
                          }}
                        >
                          {getCategoryIcon(food.category)}
                        </Avatar>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {food.name}
                            </Typography>
                            <Chip label={food.category} size="small" variant="outlined" />
                            {food.brand && <Chip label={food.brand} size="small" color="primary" variant="outlined" />}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LocalFireDepartment sx={{ fontSize: 16, color: "error.main" }} />
                                <Typography variant="body2" fontWeight="bold">
                                  {food.calories} ккал
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="primary.main">
                                Б: {food.protein}г
                              </Typography>
                              <Typography variant="body2" color="warning.main">
                                Ж: {food.fat}г
                              </Typography>
                              <Typography variant="body2" color="success.main">
                                У: {food.carbs}г
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              на 100г продукта
                            </Typography>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton
                              edge="end"
                              onClick={() => handleToggleFavorite(food.id, false)} // TODO: check if in favorites
                              color="error"
                              size="small"
                            >
                              <FavoriteBorder />
                            </IconButton>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton edge="end" color="primary" size="small">
                              <Add />
                            </IconButton>
                          </motion.div>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => onPageChange(newPage)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
})

FoodsList.displayName = "FoodsList"
