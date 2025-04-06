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
import PersonIcon from "@mui/icons-material/Person"
import FilterListIcon from "@mui/icons-material/FilterList"

interface Cliente {
  id: string
  nome: string
}

interface ClienteFilterProps {
  clientes: Cliente[]
  value: string
  onChange: (clientNumber: string) => void
}

export default function ClientFilter({ clientes, value, onChange }: ClienteFilterProps) {
  const [loading, setLoading] = useState(false)

  const handleChange = (event: SelectChangeEvent) => {
    const clientNumber = event.target.value
    setLoading(true)

    try {
      onChange(clientNumber)
    } catch (error) {
      console.error("Erro ao filtrar cliente:", error)
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
          Selecione o Nº do Cliente
        </Typography>
      </Box>

      <FormControl fullWidth size="small">
        <InputLabel id="cliente-label">Nº do Cliente</InputLabel>
        <Select
          labelId="cliente-label"
          id="cliente-select"
          value={value}
          label="Nº do Cliente"
          onChange={handleChange}
          disabled={loading}
          startAdornment={!value ? (
            <InputAdornment position="start">
              <PersonIcon color="primary" fontSize="small" />
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
            <em>Todos os Clientes</em>
          </MenuItem>
          {clientes.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" color="primary" />
                <Typography>{c.id}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  )
}
