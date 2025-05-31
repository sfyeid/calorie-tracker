"use client"

import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Grid, Typography, Box } from "@mui/material"
import { motion } from "framer-motion"

import { MainLayout } from "@/widgets/Layout/MainLayout"
import { FoodsSearch } from "@/widgets/Foods/FoodsSearch"
import { FoodsFilters } from "@/widgets/Foods/FoodsFilters"
import { FoodsList } from "@/widgets/Foods/FoodsList"
import { FavoritesFoods } from "@/widgets/Foods/FavoritesFoods"
import { useGetFoodsQuery, useGetFavoritesQuery } from "@/entities/food/api/foodsApi"

const FoodsPage = memo(() => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [page, setPage] = useState(1)

  const { data: foodsData, isLoading } = useGetFoodsQuery({
    query: searchQuery,
    category: selectedCategory === "all" ? "" : selectedCategory,
    page,
    limit: 20,
  })

  const { data: favorites } = useGetFavoritesQuery()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {t("foods.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Найдите продукты и добавьте их в свой дневник питания
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Поиск */}
          <Grid item xs={12}>
            <FoodsSearch searchQuery={searchQuery} onSearch={handleSearch} />
          </Grid>

          {/* Фильтры */}
          <Grid item xs={12}>
            <FoodsFilters selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
          </Grid>

          {/* Список продуктов */}
          <Grid item xs={12} md={8}>
            <FoodsList
              foods={foodsData?.foods || []}
              isLoading={isLoading}
              total={foodsData?.total || 0}
              page={page}
              onPageChange={handlePageChange}
            />
          </Grid>

          {/* Избранные продукты */}
          <Grid item xs={12} md={4}>
            <FavoritesFoods favorites={favorites || []} />
          </Grid>
        </Grid>
      </motion.div>
    </MainLayout>
  )
})

FoodsPage.displayName = "FoodsPage"

export default FoodsPage
