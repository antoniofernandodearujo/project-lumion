"use client"

import { useState, useEffect } from "react"
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
  Box,
  AppBar,
  Toolbar,
  Container,
  SwipeableDrawer,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeToggle from "./ThemeToogle"

const drawerWidth = 240

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}))

const Logo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "0 16px",
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProjectBadge = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "20px",
  left: "0",
  width: "100%",
  padding: "8px 16px",
  textAlign: "center",
  fontSize: "0.75rem",
  color: "#212121",
}))

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isDarkMode = theme.palette.mode === "dark"

  // Close drawer on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [isMobile])

  // Close drawer when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    }
  }, [pathname, isMobile])

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Faturas", icon: <AssessmentIcon />, path: "/invoices" },
  ]

  const handleToggleDrawer = () => {
    setOpen(!open)
  }

  const drawerContent = (
    <>
      <DrawerHeader>
        {open ? (
          <Logo>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "#fff" }}>
              Menu
            </Typography>
          </Logo>
        ) : (
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          </Box>
        )}
        <IconButton
          onClick={handleToggleDrawer}
          sx={{
            color: "primary.main",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
            width: 32,
            height: 32,
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ backgroundColor: "#fff" }} />

      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path

          return (
            <Tooltip key={item.text} title={open ? "" : item.text} placement="right" arrow>
              <ListItem
                component={Link}
                href={item.path}
                onClick={() => isMobile && setOpen(false)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                  borderLeft: isActive ? "4px solid #212121" : "4px solid transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    transform: "translateX(4px)",
                  },
                  mb: 0.5,
                  borderRadius: "0 8px 8px 0",
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    minWidth: 40,
                    "& svg": {
                      transition: "transform 0.2s ease",
                    },
                    "&:hover svg": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: "#fff",
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.2s",
                    "& .MuiTypography-root": {
                      fontWeight: isActive ? "bold" : "normal",
                    },
                  }}
                />
              </ListItem>
            </Tooltip>
          )
        })}
      </List>

      <Box
        sx={{
          position: "absolute",
          bottom: open ? "80px" : "20px",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          p: 1,
        }}
      >
        <ThemeToggle />
      </Box>

      {open && (
        <ProjectBadge>
          <Typography variant="caption" display="block" sx={{ color: '#fff', fontWeight: 800 }}>
            Lumi Energy Project v1.0
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: '#fff', fontWeight: 800 }}>
            © 2025
          </Typography>
        </ProjectBadge>
      )}
    </>
  )

  // Mobile header with menu button
  const mobileHeader = isMobile && (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: isDarkMode ? "rgba(18, 18, 18, 0.8)" : "rgba(255, 255, 255, 0.8)",
        borderBottom: "1px solid",
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 230, 118, 0.2)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: "64px",
            px: 2, // Added padding
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleToggleDrawer}
              sx={{
                mr: 3, // Increased margin
                backgroundColor: "primary.main",
                color: "#fff", // White icon
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                width: 40,
                height: 40,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: "bold",
                  color: isDarkMode ? "text.primary" : "primary.main", // Primary color in light mode
                  transition: "color 0.2s ease"
                }}
              >
                Project Energy
              </Typography>
            </Box>
          </Box>
          <ThemeToggle />
        </Toolbar>
      </Container>
    </AppBar>
  )

  return (
    <>
      {mobileHeader}

      {isMobile ? (
        <SwipeableDrawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          disableBackdropTransition={false}
          disableDiscovery={true}
          swipeAreaWidth={0}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundImage: isDarkMode
                ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
              paddingTop: "64px", // Space for the AppBar
            },
          }}
        >
          {drawerContent}
        </SwipeableDrawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? drawerWidth : 65,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : 65,
              transition: "width 0.2s",
              overflowX: "hidden",
              color: "#212121",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
              backgroundImage: isDarkMode
                ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  )
}

