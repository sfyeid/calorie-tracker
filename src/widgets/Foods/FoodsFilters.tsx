"use client"

import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, Tabs, Tab, Box } from "@mui/material"
import { motion } from "framer-motion"

interface FoodsFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { value: "all", label: "Все", emoji: "🍽️" },
  { value: "Мясо", label: "Мясо", emoji: "🥩" },
  { value: "Рыба", label: "Рыба", emoji: "🐟" },
  { value: "Молочные", label: "Молочные", emoji: "🥛" },
  { value: "Крупы", label: "Крупы", emoji: "🌾" },
  { value: "Овощи", label: "Овощи", emoji: "🥬" },
  { value: "Фрукты", label: "Фрукты", emoji: "🍎" },
  { value: "Орехи", label: "Орехи", emoji: "🥜" },
]

export const FoodsFilters = memo(({ selectedCategory, onCategoryChange }: FoodsFiltersProps) => {
  const { t } = useTranslation()

  return (
    <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => onCategoryChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
                mx: 0.5,
              },
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.value}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{category.emoji}</span>
                    <span>{category.label}</span>
                  </Box>
                }
                value={category.value}
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
})

FoodsFilters.displayName = "FoodsFilters"
