"use client"

import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  type SelectChangeEvent,
  InputAdornment,
  Box,
  Typography 
} from "@mui/material"
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonIcon from '@mui/icons-material/Person'
import { useState } from "react"

interface Cliente {
  id: string
  nome: string
}

interface ClienteFilterProps {
  clientes: Cliente[]
  value: string
  onChange: (clientNumber: string, shouldRefreshAll?: boolean) => void
}

export default function ClienteFilter({ clientes, value, onChange }: ClienteFilterProps) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (event: SelectChangeEvent) => {
    const clientNumber = event.target.value
    setLoading(true)
    
    try {
      // Removendo a chamada desnecessária ao serviço, já que o filtro é feito no componente pai
      onChange(clientNumber)
    } catch (error) {
      console.error('Erro ao filtrar cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FilterListIcon color="primary" />
      <FormControl fullWidth size="small">
        <InputLabel id="cliente-label">Nº do Cliente</InputLabel>
        <Select
          labelId="cliente-label"
          id="cliente-select"
          value={value}
          label="Nº do Cliente"
          onChange={handleChange}
          disabled={loading}
          startAdornment={
            <InputAdornment position="start">
              <PersonIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          }
        >
          <MenuItem value="">
            <em>Todos os Clientes</em>
          </MenuItem>
          {clientes.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" />
                <Typography>
                  {c.id}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
