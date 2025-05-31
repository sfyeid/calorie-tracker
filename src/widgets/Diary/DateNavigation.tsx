"use client"

import { memo } from "react"
import { Card, CardContent, Box, IconButton, Typography, Button } from "@mui/material"
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material"
import { format, addDays, subDays, isToday } from "date-fns"
import { ru } from "date-fns/locale"
import { motion } from "framer-motion"

interface DateNavigationProps {
  currentDate: string
  onDateChange: (date: string) => void
}

export const DateNavigation = memo(({ currentDate, onDateChange }: DateNavigationProps) => {
  const date = new Date(currentDate)

  const handlePreviousDay = () => {
    const newDate = subDays(date, 1)
    onDateChange(newDate.toISOString().split("T")[0])
  }

  const handleNextDay = () => {
    const newDate = addDays(date, 1)
    onDateChange(newDate.toISOString().split("T")[0])
  }

  const handleToday = () => {
    const today = new Date()
    onDateChange(today.toISOString().split("T")[0])
  }

  return (
    <Card sx={{ borderRadius: 3, position: "relative" }}>
      <CardContent sx={{ py: 3, px: 4 }}>
        {/* Кнопка "Сегодня" в правом верхнем углу */}
        {!isToday(date) && (
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="text"
                size="small"
                startIcon={<Today />}
                onClick={handleToday}
                sx={{
                  borderRadius: 2,
                  color: "primary.main",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Сегодня
              </Button>
            </motion.div>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={handlePreviousDay}
              size="large"
              sx={{
                backgroundColor: "background.paper",
                border: 1,
                borderColor: "divider",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  borderColor: "primary.main",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          </motion.div>

          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
              {format(date, "d MMMM", { locale: ru })}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="500">
              {format(date, "EEEE, yyyy", { locale: ru })}
            </Typography>
          </Box>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={handleNextDay}
              size="large"
              sx={{
                backgroundColor: "background.paper",
                border: 1,
                borderColor: "divider",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  borderColor: "primary.main",
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  )
})

DateNavigation.displayName = "DateNavigation"
