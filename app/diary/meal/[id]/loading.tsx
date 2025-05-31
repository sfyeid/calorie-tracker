"use client"

import { Box, CircularProgress, Typography } from "@mui/material"

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={60} sx={{ marginBottom: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Загрузка данных о приеме пищи...
      </Typography>
    </Box>
  )
}
