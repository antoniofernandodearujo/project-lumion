"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"

const lumiGreen = "#00E676"
const lumiGreenLight = "#66FFA6"
const lumiGreenDark = "#00B248"
const lumiBlack = "#212121"

type ThemeMode = "light" | "dark"

type ThemeContextType = {
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-mode") as ThemeMode | null
    if (savedTheme) {
      setMode(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light"
    setMode(newMode)
    localStorage.setItem("theme-mode", newMode)
  }

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: lumiGreen,
        light: lumiGreenLight,
        dark: lumiGreenDark,
        contrastText: lumiBlack,
      },
      secondary: {
        main: lumiGreenLight,
        light: "#B9F6CA",
        dark: lumiGreenDark,
        contrastText: lumiBlack,
      },
      background: {
        default: mode === "light" ? "#f8f9fa" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? lumiBlack : "#ffffff",
        secondary: mode === "light" ? "#757575" : "#b0b0b0",
      },
      divider: mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)",
      success: {
        main: lumiGreen,
        light: lumiGreenLight,
        dark: lumiGreenDark,
        contrastText: lumiBlack,
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 500,
        color: mode === "light" ? lumiBlack : "#ffffff",
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: mode === "light" ? "#f1f1f1" : "#333",
            },
            "&::-webkit-scrollbar-thumb": {
              background: lumiGreen,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: lumiGreenDark,
            },
            // Add subtle background pattern
            backgroundImage:
              mode === "light"
                ? `linear-gradient(to bottom, rgba(0, 230, 118, 0.03), rgba(0, 230, 118, 0.01)), 
                 radial-gradient(at 50% 0%, rgba(0, 230, 118, 0.05), transparent 70%)`
                : `linear-gradient(to bottom, rgba(0, 230, 118, 0.05), rgba(0, 0, 0, 0.95)), 
                 radial-gradient(at 50% 0%, rgba(0, 230, 118, 0.1), transparent 70%)`,
            backgroundAttachment: "fixed",
            transition: "background-color 0.5s ease, color 0.5s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            transition: "background-color 0.5s ease, box-shadow 0.3s ease",
            ...(mode === "dark" && {
              boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.5)",
            }),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
            transition: "background-color 0.3s ease, color 0.3s ease, transform 0.2s ease",
            "&:active": {
              transform: "scale(0.98)",
            },
          },
          containedPrimary: {
            color: lumiBlack,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            color: mode === "light" ? lumiBlack : "#ffffff",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: lumiGreen,
            color: lumiBlack,
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          colorPrimary: {
            color: lumiGreen,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            transition: "background-color 0.5s ease, width 0.2s ease",
            backgroundImage:
              mode === "light"
                ? `linear-gradient(135deg, ${lumiGreen} 0%, ${lumiGreenLight} 100%)`
                : `linear-gradient(135deg, ${lumiGreenDark} 0%, ${lumiGreen} 100%)`,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "background-color 0.3s ease, transform 0.2s ease",
            "&:active": {
              transform: "scale(0.9)",
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            transition: "background-color 0.3s ease, border-left 0.3s ease",
          },
        },
      },
    },
  })

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}