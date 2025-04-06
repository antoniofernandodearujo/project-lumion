"use client"

import { useState } from "react"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  type SelectChangeEvent,
  InputAdornment,
  Paper,
} from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import FilterListIcon from "@mui/icons-material/FilterList"

interface MonthYearFilterProps {
  months: string[]
  value: string
  onChange: (month: string) => void
}

export default function MonthYearFilter({ months, value, onChange }: MonthYearFilterProps) {
  const [loading, setLoading] = useState(false)

  const handleChange = (event: SelectChangeEvent) => {
    const month = event.target.value
    setLoading(true)

    try {
      onChange(month)
    } catch (error) {
      console.error("Erro ao filtrar mês:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: "background.paper",
        borderColor: "rgba(0, 230, 118, 0.2)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <FilterListIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="body2" fontWeight={500}>
          Selecione o Mês/Ano
        </Typography>
      </Box>

      <FormControl fullWidth size="small">
        <InputLabel id="month-label">Mês/Ano</InputLabel>
        <Select
          labelId="month-label"
          id="month-select"
          value={value}
          label="Mês/Ano"
          onChange={handleChange}
          disabled={loading}
          startAdornment={!value ? (
            <InputAdornment position="start">
              <CalendarMonthIcon color="primary" fontSize="small" />
            </InputAdornment>
          ) : null}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 230, 118, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 230, 118, 0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          }}
        >
          <MenuItem value="">
            <em>Todos os Meses</em>
          </MenuItem>
          {months.map((month) => (
            <MenuItem key={month} value={month}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonthIcon fontSize="small" color="primary" />
                <Typography>{month}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  )
}

