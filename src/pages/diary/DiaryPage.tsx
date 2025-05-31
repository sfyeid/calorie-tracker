"use client"

import { useState, useEffect } from "react"
import { Container, Grid } from "@mui/material"
import { motion } from "framer-motion"

import { DateNavigation } from "@/widgets/Diary/DateNavigation"
import { DaySummary } from "@/widgets/Diary/DaySummary"
import { MealsList } from "@/widgets/Diary/MealsList"
import { AddMealDialog } from "@/widgets/Diary/AddMealDialog"
import { useGetMealsByDateQuery, useCreateMealMutation } from "@/entities/diary/api/diaryApi"

export default function DiaryPage() {
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date().toISOString().split("T")[0]
  })
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false)

  const { data: meals = [], isLoading } = useGetMealsByDateQuery(currentDate)
  const [createMeal] = useCreateMealMutation()

  // Автоматическое создание основных приемов пищи
  useEffect(() => {
    const createDefaultMeals = async () => {
      if (isLoading || meals.length > 0) return

      const defaultMeals = [
        { type: "breakfast", name: "Завтрак", time: "08:00" },
        { type: "lunch", name: "Обед", time: "13:00" },
        { type: "dinner", name: "Ужин", time: "19:00" },
      ]

      try {
        for (const meal of defaultMeals) {
          await createMeal({
            date: currentDate,
            type: meal.type as "breakfast" | "lunch" | "dinner",
            name: meal.name,
            time: meal.time,
          }).unwrap()
        }
      } catch (error) {
        console.error("Failed to create default meals:", error)
      }
    }

    createDefaultMeals()
  }, [currentDate, meals.length, isLoading, createMeal])

  const handleDateChange = (date: string) => {
    setCurrentDate(date)
  }

  const handleAddMeal = () => {
    setAddMealDialogOpen(true)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Grid container spacing={4}>
          {/* Навигация по датам */}
          <Grid item xs={12}>
            <DateNavigation currentDate={currentDate} onDateChange={handleDateChange} />
          </Grid>

          {/* Сводка дня */}
          <Grid item xs={12} lg={4}>
            <DaySummary meals={meals} isLoading={isLoading} />
          </Grid>

          {/* Список приемов пищи */}
          <Grid item xs={12} lg={8}>
            <MealsList meals={meals} isLoading={isLoading} onAddMeal={handleAddMeal} />
          </Grid>
        </Grid>
      </motion.div>

      {/* Диалог добавления приема пищи */}
      <AddMealDialog open={addMealDialogOpen} onClose={() => setAddMealDialogOpen(false)} date={currentDate} />
    </Container>
  )
}
