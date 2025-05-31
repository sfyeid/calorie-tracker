"use client"

import { memo, useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import { Notifications, Brightness4, Language, Security, Download, Upload, DeleteForever } from "@mui/icons-material"
import { motion } from "framer-motion"

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux"
import { toggleTheme } from "@/entities/theme/model/themeSlice"

interface ProfileSettingsProps {
  onSuccess: (message: string) => void
}

export const ProfileSettings = memo(({ onSuccess }: ProfileSettingsProps) => {
  const dispatch = useAppDispatch()
  const { mode: themeMode } = useAppSelector((state) => state.theme)

  const [notifications, setNotifications] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const handleExportData = () => {
    // Имитация экспорта данных
    const data = {
      profile: "user data",
      diary: "diary entries",
      goals: "nutrition goals",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "calorie-tracker-data.json"
    a.click()
    URL.revokeObjectURL(url)

    onSuccess("Данные экспортированы")
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "УДАЛИТЬ") {
      // Здесь будет логика удаления аккаунта
      console.log("Account deletion confirmed")
      setDeleteDialogOpen(false)
      setDeleteConfirmText("")
    }
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Настройки приложения
        </Typography>

        <List sx={{ p: 0 }}>
          {/* Уведомления */}
          <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText primary="Уведомления" secondary="Получать напоминания о приемах пищи" />
              <FormControlLabel
                control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />}
                label=""
              />
            </ListItem>
          </motion.div>

          {/* Тема */}
          <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <Brightness4 />
              </ListItemIcon>
              <ListItemText primary="Темная тема" secondary="Использовать темное оформление" />
              <FormControlLabel
                control={<Switch checked={themeMode === "dark"} onChange={handleThemeToggle} />}
                label=""
              />
            </ListItem>
          </motion.div>

          {/* Язык */}
          <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText primary="Язык" secondary="Русский" />
            </ListItem>
          </motion.div>

          {/* Безопасность */}
          <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText primary="Изменить пароль" secondary="Обновить пароль для входа" />
            </ListItem>
          </motion.div>
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom fontWeight="bold">
          Данные
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="outlined" startIcon={<Download />} onClick={handleExportData} fullWidth>
            Экспорт данных
          </Button>

          <Button variant="outlined" startIcon={<Upload />} fullWidth>
            Импорт данных
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteForever />}
            onClick={() => setDeleteDialogOpen(true)}
            fullWidth
          >
            Удалить аккаунт
          </Button>
        </Box>

        {/* Диалог удаления аккаунта */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Удаление аккаунта</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Это действие нельзя отменить. Все ваши данные будут безвозвратно удалены.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Для подтверждения введите <strong>УДАЛИТЬ</strong>
            </Typography>
            <TextField
              fullWidth
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="УДАЛИТЬ"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleDeleteAccount} color="error" disabled={deleteConfirmText !== "УДАЛИТЬ"}>
              Удалить аккаунт
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
})

ProfileSettings.displayName = "ProfileSettings"
