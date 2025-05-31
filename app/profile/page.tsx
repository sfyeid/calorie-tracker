"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
} from "@mui/material"
import {
  ArrowBack,
  Person,
  Email,
  Phone,
  Cake,
  Height,
  FitnessCenter,
  LocalFireDepartment,
  Notifications,
  Security,
  Palette,
  Language,
} from "@mui/icons-material"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    goals: {
      calories: 2000,
      protein: 150,
      fat: 67,
      carbs: 250,
    },
    settings: {
      notifications: true,
      darkMode: false,
      language: "ru",
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setProfileData({
        ...profileData,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      })
    }
  }, [])

  const handleSave = () => {
    // Сохранение данных профиля
    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    setShowSuccess(true)

    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setProfileData({
      ...profileData,
      settings: {
        ...profileData.settings,
        [setting]: value,
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
            Профиль пользователя
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
        {showSuccess && (
          <Alert severity="success" sx={{ marginBottom: 3 }}>
            Профиль успешно обновлен!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Основная информация */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <Typography variant="h6">Личная информация</Typography>
                <Button
                  variant={isEditing ? "contained" : "outlined"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                >
                  {isEditing ? "Сохранить" : "Редактировать"}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Имя"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    fullWidth
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Person sx={{ marginRight: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    fullWidth
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Email sx={{ marginRight: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Телефон"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    fullWidth
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Phone sx={{ marginRight: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Возраст"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                    fullWidth
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      startAdornment: <Cake sx={{ marginRight: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Рост (см)"
                    value={profileData.height}
                    onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                    fullWidth
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      startAdornment: <Height sx={{ marginRight: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Вес (кг)"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                    fullWidth
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      startAdornment: <FitnessCenter sx={{ marginRight: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ marginY: 3 }} />

              <Typography variant="h6" gutterBottom>
                Дневные цели
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Калории"
                    value={profileData.goals.calories}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        goals: { ...profileData.goals, calories: Number(e.target.value) },
                      })
                    }
                    fullWidth
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      startAdornment: <LocalFireDepartment sx={{ marginRight: 1, color: "action.active" }} />,
                      endAdornment: <Typography variant="body2">ккал</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Белки"
                    value={profileData.goals.protein}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        goals: { ...profileData.goals, protein: Number(e.target.value) },
                      })
                    }
                    fullWidth
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Жиры"
                    value={profileData.goals.fat}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        goals: { ...profileData.goals, fat: Number(e.target.value) },
                      })
                    }
                    fullWidth
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Углеводы"
                    value={profileData.goals.carbs}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        goals: { ...profileData.goals, carbs: Number(e.target.value) },
                      })
                    }
                    fullWidth
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      endAdornment: <Typography variant="body2">г</Typography>,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Боковая панель */}
          <Grid item xs={12} md={4}>
            {/* Аватар и основная информация */}
            <Card sx={{ marginBottom: 3, borderRadius: 2 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 16px",
                    backgroundColor: "primary.main",
                    fontSize: 32,
                  }}
                >
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {user?.name || "Пользователь"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ marginTop: 1 }}>
                  Роль: {user?.role === "user" ? "Пользователь" : "Администратор"}
                </Typography>
              </CardContent>
            </Card>

            {/* Настройки */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Настройки
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
                          checked={profileData.settings.notifications}
                          onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                        />
                      }
                      label=""
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Palette />
                    </ListItemIcon>
                    <ListItemText primary="Темная тема" secondary="Использовать темное оформление" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.settings.darkMode}
                          onChange={(e) => handleSettingChange("darkMode", e.target.checked)}
                        />
                      }
                      label=""
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText primary="Язык" secondary="Русский" />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText primary="Безопасность" secondary="Изменить пароль" />
                  </ListItem>
                </List>

                <Divider sx={{ marginY: 2 }} />

                <Button variant="outlined" color="error" fullWidth>
                  Удалить аккаунт
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
