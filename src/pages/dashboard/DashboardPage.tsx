"use client"

import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Grid, Typography, Box } from "@mui/material"
import { motion } from "framer-motion"

import { MainLayout } from "@/widgets/Layout/MainLayout"
import { useAppSelector } from "@/shared/hooks/redux"
import { useGetGoalsQuery } from "@/entities/user/api/userApi"
import { useGetDiaryEntryQuery } from "@/entities/diary/api/diaryApi"
import { NutritionOverview } from "@/widgets/Dashboard/NutritionOverview"
import { CaloriesChart } from "@/widgets/Dashboard/CaloriesChart"
import { MacrosChart } from "@/widgets/Dashboard/MacrosChart"
import { RecentMeals } from "@/widgets/Dashboard/RecentMeals"
import { QuickActions } from "@/widgets/Dashboard/QuickActions"
import { WelcomeCard } from "@/widgets/Dashboard/WelcomeCard"

const DashboardPage = memo(() => {
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const { currentDate } = useAppSelector((state) => state.diary)

  const { data: goals } = useGetGoalsQuery()
  const { data: todayEntry } = useGetDiaryEntryQuery(currentDate)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <MainLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Box sx={{ mb: 4 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {t("dashboard.welcome", { name: user?.name || "Пользователь" })}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("dashboard.dailyProgress")}
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {/* Приветственная карточка */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <WelcomeCard user={user} todayEntry={todayEntry} />
            </motion.div>
          </Grid>

          {/* Обзор питания */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <NutritionOverview goals={goals} todayEntry={todayEntry} />
            </motion.div>
          </Grid>

          {/* Быстрые действия */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <QuickActions />
            </motion.div>
          </Grid>

          {/* График калорий */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <CaloriesChart />
            </motion.div>
          </Grid>

          {/* График макронутриентов */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <MacrosChart todayEntry={todayEntry} goals={goals} />
            </motion.div>
          </Grid>

          {/* Недавние приемы пищи */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <RecentMeals meals={todayEntry?.meals || []} />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </MainLayout>
  )
})

DashboardPage.displayName = "DashboardPage"

export default DashboardPage
