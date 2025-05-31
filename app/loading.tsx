"use client"

import { Container, Box, CircularProgress, Typography } from "@mui/material"

export default function Loading() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <CircularProgress size={60} sx={{ marginBottom: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Загрузка...
        </Typography>
      </Box>
    </Container>
  )
}
