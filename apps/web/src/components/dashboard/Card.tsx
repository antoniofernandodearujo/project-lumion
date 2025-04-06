import { Paper, Box, Typography, Tooltip, IconButton } from "@mui/material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt"
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined"
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined"

interface CardProps {
  title: string
  value: string
  description: string
  type: "energy" | "money" | "savings"
}

export default function Card({ title, value, description, type }: CardProps) {
  // Map of icons based on type
  const getIcon = () => {
    switch (type) {
      case "energy":
        return <ElectricBoltIcon sx={{ fontSize: 40 }} />
      case "money":
        return <PaidOutlinedIcon sx={{ fontSize: 40 }} />
      case "savings":
        return <SavingsOutlinedIcon sx={{ fontSize: 40 }} />
      default:
        return <ElectricBoltIcon sx={{ fontSize: 40 }} />
    }
  }

  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case "energy":
        return "rgba(0, 230, 118, 0.05)"
      case "money":
        return "rgba(0, 230, 118, 0.08)"
      case "savings":
        return "rgba(0, 230, 118, 0.12)"
      default:
        return "rgba(0, 230, 118, 0.05)"
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        flex: 1,
        minWidth: 250,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0, 230, 118, 0.15)",
        },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0, 230, 118, 0.2)",
        bgcolor: getBackgroundColor(),
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "rgba(0, 230, 118, 0.15)",
            color: "primary.main",
          }}
        >
          {getIcon()}
        </Box>
        <Tooltip
          title={
            <Box sx={{ p: 1 }}>
              <Typography variant="body2">{description}</Typography>
            </Box>
          }
          arrow
          placement="top"
        >
          <IconButton size="small" sx={{ color: "primary.main" }}>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h5"
          component="div"
          fontWeight="bold"
          color="primary.main"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  )
}

