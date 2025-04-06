"use client"
import { Box, Container, Typography, Stack, useTheme } from "@mui/material"

export default function Footer() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 230, 118, 0.2)",
        py: 3,
        mt: "auto",
        backgroundColor: isDarkMode ? "rgba(18, 18, 18, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          spacing={1} 
          alignItems={{ xs: "center", sm: "center" }}
        >
          <Typography 
            variant="body2" 
            color={isDarkMode ? "text.primary" : "text.secondary"}
          >
            © {new Date().getFullYear()} Lumi Energy. Todos os direitos reservados.
          </Typography>
          <Typography 
            variant="body2" 
            color={isDarkMode ? "text.primary" : "text.secondary"}
            sx={{ fontStyle: 'italic' }}
          >
            Projeto desenvolvido para processo seletivo da vaga de Desenvolvedor Front-end
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

