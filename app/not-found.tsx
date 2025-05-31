"use client"

import { Container, Paper, Typography, Button, Box } from "@mui/material"
import { SearchOff } from "@mui/icons-material"
import Link from "next/link"

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Box sx={{ marginBottom: 3 }}>
          <SearchOff color="primary" sx={{ fontSize: 64 }} />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          404 - Страница не найдена
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Запрашиваемая страница не существует или была перемещена.
        </Typography>

        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" component={Link} href="/">
            Вернуться на главную
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
