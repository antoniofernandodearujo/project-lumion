"use client"

import type React from "react"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import Sidebar from "./SideBar"
import Footer from "./Footer"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isDarkMode = theme.palette.mode === "dark"

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.7,
          backgroundImage: isDarkMode
            ? "radial-gradient(circle at 25% 25%, rgba(0, 230, 118, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 230, 118, 0.1) 0%, transparent 50%)"
            : "radial-gradient(circle at 25% 25%, rgba(0, 230, 118, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 230, 118, 0.15) 0%, transparent 50%)",
        },
      }}
    >
      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3 },
            width: "100%",
            marginLeft: isMobile ? 0 : "65px",
            transition: "margin-left 0.2s ease, background-color 0.5s ease",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            mt: isMobile ? "64px" : 0, // Add top margin for mobile to account for the AppBar
          }}
        >
          <Box
            sx={{
              flex: 1,
              position: "relative",
              zIndex: 1,
              mb: 4,
            }}
            className="fade-in"
          >
            {children}
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  )
}

