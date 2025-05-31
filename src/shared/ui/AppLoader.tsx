import { Box, CircularProgress, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

export const AppLoader = () => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        {t("common.loading")}
      </Typography>
    </Box>
  )
}
