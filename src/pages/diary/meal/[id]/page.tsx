"use client"

import { memo, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Grid, Typography, Box, Fab } from "@mui/material"
import { Add } from "@mui/icons-material"
import { motion } from "framer-motion"

import { MainLayout } from "@/widgets/Layout/MainLayout"
import { MealHeader } from "@/widgets/MealEdit/MealHeader"
import { MealInfo } from "@/widgets/MealEdit/MealInfo"
import { FoodsList as MealFoodsList } from "@/widgets/MealEdit/FoodsList"
import { MealSummary } from "@/widgets/MealEdit/MealSummary"
import { AddFoodDialog } from "@/widgets/MealEdit/AddFoodDialog"

const MealEditPage = memo(() => {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const mealId = params?.id ? Number(params.id) : null

  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)
  const [meal, setMeal] = useState<any>(null)

  // Для демо используем статические данные
  useEffect(() => {
    if (mealId) {
      // Имитация загрузки данных о приеме пищи
      const mockMeal = {
        id: mealId,
        type: "breakfast",
        name: "Завтрак",
        time: "08:30",
        date: "2024-01-15",
        foods: [
          {
            id: 1,
            foodId: 9,
            food: {
              id: 9,
              name: "Овсянка на воде",
              category: "Крупы",
              calories: 88,
              protein: 3,
              fat: 1.7,
              carbs: 15,
            },
            amount: 200,
            calories: 176,
            protein: 6,
            fat: 3.4,
            carbs: 30,
          },
          {
            id: 2,
            foodId: 10,
            food: {
              id: 10,
              name: "Греческий йогурт",
              category: "Молочные",
              calories: 59,
              protein: 10,
              fat: 0.4,
              carbs: 3.6,
            },
            amount: 150,
            calories: 89,
            protein: 15,
            fat: 0.6,
            carbs: 5.4,
          },
        ],
        totalCalories: 265,
        totalProtein: 21,
        totalFat: 4,
        totalCarbs: 35.4,
      }
      setMeal(mockMeal)
    }
  }, [mealId])

  const handleSave = async (updatedMeal: any) => {
    try {
      // Здесь будет вызов API для сохранения
      console.log("Saving meal:", updatedMeal)
      router.push("/diary")
    } catch (error) {
      console.error("Failed to save meal:", error)
    }
  }

  const handleAddFood = () => {
    setAddFoodDialogOpen(true)
  }

  const handleFoodAdded = (food: any, amount: number) => {
    if (!meal) return

    const newFoodEntry = {
      id: Date.now(),
      foodId: food.id,
      food,
      amount,
      calories: (food.calories * amount) / 100,
      protein: (food.protein * amount) / 100,
      fat: (food.fat * amount) / 100,
      carbs: (food.carbs * amount) / 100,
    }

    const updatedFoods = [...meal.foods, newFoodEntry]
    const updatedMeal = {
      ...meal,
      foods: updatedFoods,
      totalCalories: updatedFoods.reduce((sum, f) => sum + f.calories, 0),
      totalProtein: updatedFoods.reduce((sum, f) => sum + f.protein, 0),
      totalFat: updatedFoods.reduce((sum, f) => sum + f.fat, 0),
      totalCarbs: updatedFoods.reduce((sum, f) => sum + f.carbs, 0),
    }

    setMeal(updatedMeal)
    setAddFoodDialogOpen(false)
  }

  const handleRemoveFood = (foodEntryId: number) => {
    if (!meal) return

    const updatedFoods = meal.foods.filter((f: any) => f.id !== foodEntryId)
    const updatedMeal = {
      ...meal,
      foods: updatedFoods,
      totalCalories: updatedFoods.reduce((sum: number, f: any) => sum + f.calories, 0),
      totalProtein: updatedFoods.reduce((sum: number, f: any) => sum + f.protein, 0),
      totalFat: updatedFoods.reduce((sum: number, f: any) => sum + f.fat, 0),
      totalCarbs: updatedFoods.reduce((sum: number, f: any) => sum + f.carbs, 0),
    }

    setMeal(updatedMeal)
  }

  if (!meal) {
    return (
      <MainLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <Typography variant="h6">Загрузка...</Typography>
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <MealHeader meal={meal} onSave={handleSave} />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Информация о приеме пищи */}
          <Grid item xs={12} md={8}>
            <MealInfo meal={meal} onUpdate={setMeal} />
          </Grid>

          {/* Сводка */}
          <Grid item xs={12} md={4}>
            <MealSummary meal={meal} />
          </Grid>

          {/* Список продуктов */}
          <Grid item xs={12}>
            <MealFoodsList foods={meal.foods} onRemoveFood={handleRemoveFood} onAddFood={handleAddFood} />
          </Grid>
        </Grid>

        {/* FAB для добавления продукта */}
        <Fab
          color="primary"
          aria-label="add food"
          onClick={handleAddFood}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
          }}
        >
          <Add />
        </Fab>

        {/* Диалог добавления продукта */}
        <AddFoodDialog
          open={addFoodDialogOpen}
          onClose={() => setAddFoodDialogOpen(false)}
          onFoodAdded={handleFoodAdded}
        />
      </motion.div>
    </MainLayout>
  )
})

MealEditPage.displayName = "MealEditPage"

export default MealEditPage
