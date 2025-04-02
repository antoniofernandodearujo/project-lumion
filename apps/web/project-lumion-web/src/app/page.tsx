"use client"

import { useState } from "react"
import { Container, Box, Paper, SelectChangeEvent, Typography } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"

// Importando os componentes (ajuste os caminhos conforme sua estrutura)
import DateRangeFilter from "@/components/filters/DateRangeFilter"
// Outros componentes (ClienteFilter, SummaryCard, EnergyChart, FinancialChart) podem ser importados se necessários
import EnergyChart from "@/components/dashboard/EnergyChart"
import FinancialChart from "@/components/dashboard/FinacialChart"
import SummaryCards from '@/components/dashboard/SumaryCard';

export default function Dashboard() {
  // Inicializa as datas como instâncias Dayjs
  const [dataInicio, setDataInicio] = useState<Dayjs | null>(
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1))
  )
  const [dataFim, setDataFim] = useState<Dayjs | null>(dayjs(new Date()))

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, color: "#006400" }}>
        Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <Box flex={{ xs: '1', md: '0 0 33%' }}>
            {/* Substitua pelo componente ClienteFilter se houver */}
          </Box>
          <Box flex="1">
            <DateRangeFilter
              startDate={dataInicio}
              endDate={dataFim}
              onStartDateChange={setDataInicio}
              onEndDateChange={setDataFim}
            />
          </Box>
        </Box>
      </Paper>

      <SummaryCards />

      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, color: "#006400" }}>
        Confira os gráficos abaixo
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <EnergyChart />
        <FinancialChart />
      </Box>


    </Container>
  )
}