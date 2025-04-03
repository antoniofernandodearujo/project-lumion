"use client"

import { useEffect, useState } from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Box, Typography, CircularProgress } from "@mui/material"

import { Invoices } from "@/core/get-invoices"

ChartJS.register(ArcElement, Tooltip, Legend)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export default function FinancialChart() {
  const invoices = new Invoices("http://localhost:3001/api/invoices/")
  const [chartData, setChartData] = useState<{
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor: string[]
      borderColor: string[]
      borderWidth: number
    }[]
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await invoices.getInvoices()

        // Calculando os totais
        const valorTotalSemGD = response.reduce((sum, item) => sum + item.valorTotalSemGD, 0)
        const economiaGD = response.reduce((sum, item) => sum + item.economiaGD, 0)

        setChartData({
          labels: [`Valor Total sem GD`, `Economia GD`],
          datasets: [
            {
              data: [valorTotalSemGD, economiaGD],
              backgroundColor: ["rgba(33, 150, 243, 0.7)", "rgba(0, 230, 118, 0.7)"], // Azul e Verde
              borderColor: ["#2196F3", "#00E676"], // Mesmas cores do EnergyChart
              borderWidth: 1,
            },
          ],
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1976D2", // Azul escuro para título
        bodyColor: "#212121",
        borderColor: "rgba(33, 150, 243, 0.2)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const value = context.raw as number
            const label = context.label || ""
            return `${label}: ${formatCurrency(value)}`
          },
        },
      },
    },
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        p: 3,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        backgroundColor: 'transparent'
      }}
    >
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <CircularProgress color="primary" />
        ) : chartData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <Typography color="text.secondary">Nenhum dado disponível</Typography>
        )}
      </Box>
    </Box>
  )
}

