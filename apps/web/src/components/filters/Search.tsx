"use client"

import type React from "react"

import { useState } from "react"
import { Box, Typography, Paper, TextField, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"

interface SearchFilterProps {
  value: string
  onChange: (search: string) => void
}

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleClear = () => {
    setLocalValue("")
    onChange("")
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderColor: "rgba(0, 230, 118, 0.2)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <SearchIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="body2" fontWeight={500}>
          Pesquisar Faturas
        </Typography>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Pesquisar por cliente, distribuidora..."
        value={localValue}
        onChange={handleChange}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: localValue ? (
            <InputAdornment position="end">
              <IconButton size="small" aria-label="clear search" onClick={handleClear} edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          mt: "auto",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(0, 230, 118, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 230, 118, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
        }}
      />
    </Paper>
  )
}

