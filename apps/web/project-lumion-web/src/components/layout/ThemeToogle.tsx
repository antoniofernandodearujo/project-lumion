"use client"

import { IconButton, Tooltip, useTheme } from "@mui/material"
import { LightMode, DarkMode } from "@mui/icons-material"
import { useThemeContext } from "../theme/ThemeProvider"

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  return (
    <Tooltip title={mode === "light" ? "Modo Escuro" : "Modo Claro"} placement="left" arrow>
      <IconButton
        onClick={toggleTheme}
        sx={{
          p: 1.5,
          borderRadius: '12px',
          color: isDarkMode ? '#fff' : '#000',
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(100, 230, 118, 0.05)',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 230, 118, 0.1)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '& svg': {
            fontSize: 24,
            transition: 'transform 0.2s ease',
          },
          '&:hover svg': {
            transform: 'rotate(90deg)',
          }
        }}
      >
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  )
}