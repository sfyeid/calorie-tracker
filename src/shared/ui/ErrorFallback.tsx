"use client"

import { Box, Typography, Button, Paper } from "@mui/material"
import { ErrorOutline, Refresh } from "@mui/icons-material"
import { useTranslation } from "react-i18next"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 2,
      }}
    >
      <Paper
        sx={{
          padding: 4,
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <ErrorOutline
          sx={{
            fontSize: 64,
            color: "error.main",
            marginBottom: 2,
          }}
        />

        <Typography variant="h5" gutterBottom>
          {t("common.error")}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Произошла непредвиденная ошибка. Попробуйте обновить страницу.
        </Typography>

        <Button variant="contained" startIcon={<Refresh />} onClick={resetErrorBoundary} sx={{ marginTop: 2 }}>
          Попробовать снова
        </Button>

        {import.meta.env.DEV && (
          <Box
            sx={{
              marginTop: 3,
              padding: 2,
              backgroundColor: "grey.100",
              borderRadius: 1,
              textAlign: "left",
            }}
          >
            <Typography variant="caption" component="pre">
              {error.message}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
