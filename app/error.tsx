"use client"

import { useEffect } from "react"
import { Container, Paper, Typography, Button, Box } from "@mui/material"
import { ErrorOutline } from "@mui/icons-material"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Box sx={{ marginBottom: 3 }}>
          <ErrorOutline color="error" sx={{ fontSize: 64 }} />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom color="error">
          Что-то пошло не так!
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернуться позже.
        </Typography>

        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" onClick={reset} sx={{ marginRight: 2 }}>
            Попробовать снова
          </Button>
          <Button variant="outlined" onClick={() => (window.location.href = "/")}>
            На главную
          </Button>
        </Box>

        {process.env.NODE_ENV === "development" && (
          <Box
            sx={{
              marginTop: 3,
              padding: 2,
              backgroundColor: "grey.100",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
              {error.message}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  )
}
