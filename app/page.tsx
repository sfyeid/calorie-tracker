"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Fab,
} from "@mui/material"
import { Search, Add, Favorite, FavoriteBorder, Edit, Delete } from "@mui/icons-material"
import { useForm } from "react-hook-form"

interface Product {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  isFavorite: boolean
  isCustom: boolean
  createdAt: string
}

interface ProductForm {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

export default function ProductsPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [searchTerm, setSearchTerm] = useState("")
  const [tabValue, setTabValue] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [success, setSuccess] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Куриная грудка",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      isFavorite: true,
      isCustom: false,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Овсяная каша",
      calories: 389,
      protein: 16.9,
      carbs: 66.3,
      fat: 6.9,
      fiber: 10.6,
      sugar: 0,
      isFavorite: false,
      isCustom: false,
      createdAt: "2024-01-01",
    },
    {
      id: "3",
      name: "Творог 5%",
      calories: 121,
      protein: 16.7,
      carbs: 1.3,
      fat: 5,
      fiber: 0,
      sugar: 1.3,
      isFavorite: true,
      isCustom: false,
      createdAt: "2024-01-01",
    },
    {
      id: "4",
      name: "Банан",
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12.2,
      isFavorite: false,
      isCustom: false,
      createdAt: "2024-01-01",
    },
  ])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>()

  // Check authentication only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      if (!token) {
        router.push("/auth/login")
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
  }, [router])

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by tab (all, favorites, custom)
    if (tabValue === 1) {
      filtered = filtered.filter((product) => product.isFavorite)
    } else if (tabValue === 2) {
      filtered = filtered.filter((product) => product.isCustom)
    }

    return filtered
  }, [products, searchTerm, tabValue])

  const toggleFavorite = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product)),
    )
  }

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId))
    setSuccess("Продукт удален")
    setTimeout(() => setSuccess(""), 3000)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setValue("name", product.name)
    setValue("calories", product.calories)
    setValue("protein", product.protein)
    setValue("carbs", product.carbs)
    setValue("fat", product.fat)
    setValue("fiber", product.fiber || 0)
    setValue("sugar", product.sugar || 0)
    setOpenDialog(true)
  }

  const onSubmit = (data: ProductForm) => {
    if (editingProduct) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...data,
              }
            : product,
        ),
      )
      setSuccess("Продукт обновлен")
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...data,
        isFavorite: false,
        isCustom: true,
        createdAt: new Date().toISOString(),
      }
      setProducts((prev) => [...prev, newProduct])
      setSuccess("Продукт добавлен")
    }

    setOpenDialog(false)
    setEditingProduct(null)
    reset()
    setTimeout(() => setSuccess(""), 3000)
  }

  // Show loading or nothing during SSR
  if (isLoading) {
    return null
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: { xs: 2, sm: 3, md: 4 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.125rem",
            },
          }}
        >
          База продуктов
        </Typography>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              width: { xs: "100%", sm: "auto" },
              py: { xs: 1.5, sm: 1 },
              px: { sm: 2, md: 3 },
              fontSize: { sm: "0.875rem", md: "1rem" },
            }}
          >
            Добавить продукт
          </Button>
        )}
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 } }}>
          {success}
        </Alert>
      )}

      {/* Search */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextField
            fullWidth
            placeholder="Поиск продуктов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: { xs: 2, sm: 3 } }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              minWidth: { xs: 80, sm: 120, md: 160 },
              py: { xs: 1, sm: 1.5 },
            },
          }}
        >
          <Tab label={`Все (${products.length})`} />
          <Tab label={`Избранные (${products.filter((p) => p.isFavorite).length})`} />
          <Tab label={`Мои (${products.filter((p) => p.isCustom).length})`} />
        </Tabs>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={product.id}>
            <Card
              sx={{
                height: "100%",
                position: "relative",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: { xs: 2, sm: 4 },
                  transform: { xs: "none", sm: "translateY(-2px)" },
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                      fontWeight: 600,
                      lineHeight: 1.3,
                      flex: 1,
                      mr: 1,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <IconButton
                    size={isMobile ? "small" : "medium"}
                    onClick={() => toggleFavorite(product.id)}
                    sx={{ mt: -0.5 }}
                  >
                    {product.isFavorite ? (
                      <Favorite sx={{ color: "#f44336", fontSize: { xs: 20, sm: 24 } }} />
                    ) : (
                      <FavoriteBorder sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    )}
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" },
                    }}
                  >
                    {product.calories}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" } }}
                    >
                      {" "}
                      ккал/100г
                    </Typography>
                  </Typography>
                </Box>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" } }}
                    >
                      Белки
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
                    >
                      {product.protein}г
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" } }}
                    >
                      Углеводы
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
                    >
                      {product.carbs}г
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" } }}
                    >
                      Жиры
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
                    >
                      {product.fat}г
                    </Typography>
                  </Grid>
                </Grid>

                {product.isCustom && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 0.5, sm: 1 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => openEditDialog(product)}
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                        py: { xs: 0.5, sm: 1 },
                      }}
                    >
                      Изменить
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => deleteProduct(product.id)}
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                        py: { xs: 0.5, sm: 1 },
                      }}
                    >
                      Удалить
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: "center", py: { xs: 6, sm: 8 } }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            Продукты не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            Попробуйте изменить параметры поиска или добавьте новый продукт
          </Typography>
        </Box>
      )}

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenDialog(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            m: { xs: 0, sm: 2 },
            width: { xs: "100%", sm: "100%" },
            height: { xs: "100%", sm: "auto" },
            maxHeight: { xs: "100%", sm: "90vh" },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          {editingProduct ? "Редактировать продукт" : "Добавить продукт"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Название продукта"
                  size={isMobile ? "small" : "medium"}
                  {...register("name", { required: "Название обязательно" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Калории (на 100г)"
                  type="number"
                  size={isMobile ? "small" : "medium"}
                  {...register("calories", { required: "Калории обязательны" })}
                  error={!!errors.calories}
                  helperText={errors.calories?.message}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Белки (г)"
                  type="number"
                  step="0.1"
                  size={isMobile ? "small" : "medium"}
                  {...register("protein", { required: "Белки обязательны" })}
                  error={!!errors.protein}
                  helperText={errors.protein?.message}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Углеводы (г)"
                  type="number"
                  step="0.1"
                  size={isMobile ? "small" : "medium"}
                  {...register("carbs", { required: "Углеводы обязательны" })}
                  error={!!errors.carbs}
                  helperText={errors.carbs?.message}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Жиры (г)"
                  type="number"
                  step="0.1"
                  size={isMobile ? "small" : "medium"}
                  {...register("fat", { required: "Жиры обязательны" })}
                  error={!!errors.fat}
                  helperText={errors.fat?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Клетчатка (г)"
                  type="number"
                  step="0.1"
                  size={isMobile ? "small" : "medium"}
                  {...register("fiber")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Сахар (г)"
                  type="number"
                  step="0.1"
                  size={isMobile ? "small" : "medium"}
                  {...register("sugar")}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <Button onClick={() => setOpenDialog(false)} size={isMobile ? "small" : "medium"}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" size={isMobile ? "small" : "medium"}>
              {editingProduct ? "Сохранить" : "Добавить"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}
