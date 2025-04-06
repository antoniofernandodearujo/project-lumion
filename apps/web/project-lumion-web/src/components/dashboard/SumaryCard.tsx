"use client"

import { useEffect, useState } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { Invoices } from "@/core/get-invoices"
import Card from "./Card"

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("pt-BR").format(value)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

interface SummaryData {
  totalEnergyConsumption: number;  // Consumo Total
  totalCompensatedEnergy: number;  // Energia Compensada
  totalBillWithoutGD: number;      // Valor sem GD
  totalSavings: number;            // Economia GD
}

export default function SummaryCards() {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalEnergyConsumption: 0,
    totalCompensatedEnergy: 0,
    totalSavings: 0,
    totalBillWithoutGD: 0,
  })

  const invoices = new Invoices("http://localhost:3001/api/invoices/")

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await invoices.getInvoices()

        const summaryData = response.reduce((acc, invoice) => {
          // Consumo de Energia Elétrica = Energia Elétrica kWh + Energia SCEEE kWh
          const consumoTotal = invoice.energiaEletricaKwh + invoice.energiaSCEEEKwh

          // Energia Compensada = Energia Compensada GD I (sempre positivo)
          const energiaCompensada = Math.abs(invoice.energiaCompensadaKwh)

          // Valor Total sem GD = Energia Elétrica R$ + Energia SCEE R$ + Contrib Ilum Publica
          const valorTotalSemGD = 
            invoice.energiaEletricaValor + 
            invoice.energiaSCEEValor + 
            invoice.contribIlumPublica

          // Economia GD = Valor absoluto da Energia compensada GD I R$ (para mostrar economia positiva)
          const economiaGD = Math.abs(invoice.energiaCompensadaValor)

          return {
            totalEnergyConsumption: acc.totalEnergyConsumption + consumoTotal,
            totalCompensatedEnergy: acc.totalCompensatedEnergy + energiaCompensada,
            totalBillWithoutGD: acc.totalBillWithoutGD + valorTotalSemGD,
            totalSavings: acc.totalSavings + economiaGD,
          }
        }, {
          totalEnergyConsumption: 0,
          totalCompensatedEnergy: 0,
          totalBillWithoutGD: 0,
          totalSavings: 0,
        })

        setSummaryData(summaryData)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [invoices])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" color="primary.main" fontWeight={800} sx={{ mb: 2 }}>
        Resumo
      </Typography>

      <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          mx: -1.5, // Compensate for padding
          '& > *': { 
            px: 1.5,
            mb: 3,
            width: {
              xs: '100%',
              sm: '50%',
              md: '25%'
            }
          }
        }}
      >
        <Box>
          <Card
            title="Consumo Total"
            value={`${formatNumber(summaryData.totalEnergyConsumption)} kWh`}
            description="Somatório: Energia Elétrica (kWh) + Energia SCEEE (kWh)"
            type="energy"
          />
        </Box>
        <Box>
          <Card
            title="Energia Compensada"
            value={`${formatNumber(summaryData.totalCompensatedEnergy)} kWh`}
            description="Total de Energia Compensada GD I (kWh)"
            type="energy"
          />
        </Box>
        <Box>
          <Card
            title="Economia Total"
            value={formatCurrency(summaryData.totalSavings)}
            description="Valor total economizado com Energia Compensada GD I (R$)"
            type="savings"
          />
        </Box>
        <Box>
          <Card
            title="Valor sem GD"
            value={formatCurrency(summaryData.totalBillWithoutGD)}
            description="Somatório: Energia Elétrica (R$) + SCEE (R$) + Iluminação Pública"
            type="money"
          />
        </Box>
      </Box>
    </Box>
  )
}

