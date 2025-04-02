// src/components/DateRangeFilter.tsx
"use client"

import { Box } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Dayjs } from "dayjs"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"

interface DateRangeFilterProps {
  startDate: Dayjs | null
  endDate: Dayjs | null
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  monthYearOnly?: boolean
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  monthYearOnly = false,
}: DateRangeFilterProps) {

  const handleStartDateChange = (newValue: string | number | Dayjs | Date | null | undefined) => {
    if (!newValue) {
      onStartDateChange(null)
      return
    }
    const date = dayjs.isDayjs(newValue) ? newValue : dayjs(newValue)
    onStartDateChange(date)
  }

  const handleEndDateChange = (newValue: string | number | Dayjs | Date | null | undefined) => {
    if (!newValue) {
      onEndDateChange(null)
      return
    }
    const date = dayjs.isDayjs(newValue) ? newValue : dayjs(newValue)
    onEndDateChange(date)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        <Box flex="1">
          <DatePicker
            label={monthYearOnly ? "Mês/Ano Início" : "Data Início"}
            value={startDate}
            onChange={handleStartDateChange}
            views={monthYearOnly ? ["year", "month"] : undefined}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
        <Box flex="1">
          <DatePicker
            label={monthYearOnly ? "Mês/Ano Fim" : "Data Fim"}
            value={endDate}
            onChange={handleEndDateChange}
            views={monthYearOnly ? ["year", "month"] : undefined}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  )
}
