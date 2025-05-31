"use client"

import type React from "react"

import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, TextField, InputAdornment, IconButton } from "@mui/material"
import { Search, Clear } from "@mui/icons-material"
import { motion } from "framer-motion"

interface FoodsSearchProps {
  searchQuery: string
  onSearch: (query: string) => void
}

export const FoodsSearch = memo(({ searchQuery, onSearch }: FoodsSearchProps) => {
  const { t } = useTranslation()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(localQuery)
  }

  const handleClear = () => {
    setLocalQuery("")
    onSearch("")
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder={t("foods.searchPlaceholder")}
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: localQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClear} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
})

FoodsSearch.displayName = "FoodsSearch"
