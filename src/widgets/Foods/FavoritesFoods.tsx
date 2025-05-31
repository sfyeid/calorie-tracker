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
  Button,
} from "@mui/material"
import { Favorite, Add, FavoriteBorder } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { Food } from "@/shared/types"

interface FavoritesFoodsProps {
  favorites: Food[]
}

export const FavoritesFoods = memo(({ favorites }: FavoritesFoodsProps) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ borderRadius: 3, height: "fit-content" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {t("foods.favorites")}
        </Typography>

        {favorites.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <FavoriteBorder sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Нет избранных продуктов
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Добавьте продукты в избранное для быстрого доступа
            </Typography>
          </Box>
        ) : (
          <>
            <List dense sx={{ p: 0 }}>
              {favorites.slice(0, 8).map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      px: 0,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Favorite color="error" sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {food.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {food.calories} ккал
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small" color="primary">
                        <Add fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </motion.div>
              ))}
            </List>

            {favorites.length > 8 && (
              <Button size="small" fullWidth sx={{ mt: 2 }}>
                Показать все ({favorites.length})
              </Button>
            )}
          </>
        )}

        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" gutterBottom>
            Быстрые действия
          </Typography>
          <Button variant="outlined" fullWidth size="small" sx={{ mb: 1 }}>
            Создать рецепт
          </Button>
          <Button variant="outlined" fullWidth size="small">
            Добавить продукт
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
})

FavoritesFoods.displayName = "FavoritesFoods"
