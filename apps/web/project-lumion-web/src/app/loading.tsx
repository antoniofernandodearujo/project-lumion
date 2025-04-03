import { CircularProgress, Box, Typography } from "@mui/material"

export default function Loading() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 9999,
        animation: "fadeIn 0.3s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: "scale(1)",
          animation: "scaleIn 0.3s ease-in-out",
          "@keyframes scaleIn": {
            from: { transform: "scale(0.95)" },
            to: { transform: "scale(1)" },
          },
        }}
      >
        <CircularProgress
          color="primary"
          size={60}
          thickness={4}
          sx={{
            color: "#00E676",
            mb: 2,
          }}
        />
        <Typography 
          variant="h6" 
          color="#212121" 
          sx={{ 
            fontWeight: 500,
            opacity: 0.9
          }}
        >
          Carregando...
        </Typography>
      </Box>
    </Box>
  )
}

