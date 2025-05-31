"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material"
import {
  ArrowBack,
  Brightness4,
  Brightness7,
  Language,
  Notifications,
  Security,
  LocalFireDepartment,
  FitnessCenter,
  Opacity,
  Grain,
  Save,
} from "@mui/icons-material"

export default function SettingsPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [settings, setSettings] = useState({
    theme: "light",
    language: "ru",
    notifications: true,
    goals: {
      calories: 2000,
      protein: 150,
      fat: 67,
      carbs: 250,
    },
  })

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    setSettings({
      ...settings,
      theme: isDarkMode ? "light" : "dark",
    })
  }

  const handleGoalChange = (field: string, value: number) => {
    setSettings({
      ...settings,
      goals: {
        ...settings.goals,
        [field]: value,
      },
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/dashboard")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Настройки
          </Typography>
          <IconButton color="inherit" onClick={handleToggleTheme}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
        {showSuccess && (
          <Alert severity="success" sx={{ marginBottom: 3 }}>
            Настройки успешно сохранены!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Основные настройки */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <Typography variant="h6">Общие настройки</Typography>
                <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                  Сохранить
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Тема"
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    fullWidth
                  >
                    <MenuItem value="light">Светлая</MenuItem>
                    <MenuItem value="dark">Темная</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Язык"
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    fullWidth
                  >
                    <MenuItem value="ru">Русский</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                      />
                    }
                    label="Уведомления"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ marginY: 3 }} />

              <Typography variant="h6" gutterBottom>
                Цели питания
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые калории"
                    type="number"
                    value={settings.goals.calories}
                    onChange={(e) => handleGoalChange("calories", Number(e.target.value))}
                    fullWidth
                    InputProps={{
                      startAdornment: <LocalFireDepartment sx={{ marginRight: 1, color: "error.main" }} />,
                      endAdornment: <Typography variant="body2">ккал</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые белки"
                    type="number"
                    value={settings.goals.protein}
                    onChange={(e) => handleGoalChange("protein", Number(e.target.value))}
                    fullWidth
                    InputProps={{
                      startAdornment: <FitnessCenter sx={{ marginRight: 1, color: "primary.main" }} />,
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые жиры"
                    type="number"
                    value={settings.goals.fat}
                    onChange={(e) => handleGoalChange("fat", Number(e.target.value))}
                    fullWidth
                    InputProps={{
                      startAdornment: <Opacity sx={{ marginRight: 1, color: "warning.main" }} />,
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Целевые углеводы"
                    type="number"
                    value={settings.goals.carbs}
                    onChange={(e) => handleGoalChange("carbs", Number(e.target.value))}
                    fullWidth
                    InputProps={{
                      startAdornment: <Grain sx={{ marginRight: 1, color: "success.main" }} />,
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Боковая панель */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, marginBottom: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Настройки приложения
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText primary="Уведомления" secondary="Получать push-уведомления" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications}
                          onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                        />
                      }
                      label=""
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Brightness4 />
                    </ListItemIcon>
                    <ListItemText primary="Темная тема" secondary="Использовать темное оформление" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.theme === "dark"}
                          onChange={(e) => setSettings({ ...settings, theme: e.target.checked ? "dark" : "light" })}
                        />
                      }
                      label=""
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText primary="Язык" secondary={settings.language === "ru" ? "Русский" : "English"} />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText primary="Безопасность" secondary="Изменить пароль" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Дополнительно
                </Typography>

                <Button variant="outlined" fullWidth sx={{ marginBottom: 1 }}>
                  Экспорт данных
                </Button>

                <Button variant="outlined" fullWidth sx={{ marginBottom: 1 }}>
                  Импорт данных
                </Button>

                <Button variant="outlined" color="error" fullWidth>
                  Очистить все данные
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
