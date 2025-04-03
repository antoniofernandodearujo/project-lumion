"use client"

import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Box, Typography, CircularProgress } from "@mui/material"

import { Invoices } from "@/core/get-invoices"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function EnergyChart() {
  const [chartData, setChartData] = useState<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      borderWidth: number
      tension: number
    }[]
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const invoices = new Invoices("http://localhost:3001/api/invoices/")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await invoices.getInvoices()

        // Adicione ordenação por data
        const sortedData = response.sort((a, b) => {
          const [monthA, yearA] = a.referenceMonth.split('/')
          const [monthB, yearB] = b.referenceMonth.split('/')
          return new Date(`${yearA}-${monthA}-01`).getTime() - new Date(`${yearB}-${monthB}-01`).getTime()
        })

        // Processando os dados para o gráfico
        const labels = sortedData.map((item) => item.referenceMonth)
        const consumoEnergia = sortedData.map((item) => item.consumoEnergiaEletrica)
        const energiaCompensada = sortedData.map((item) => item.energiaCompensadaKwh)

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Consumo de Energia Elétrica (kWh)",
              data: consumoEnergia,
              borderColor: "#2196F3", // Azul para consumo
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              borderWidth: 2,
              tension: 0.3,
            },
            {
              label: "Energia Compensada (kWh)",
              data: energiaCompensada,
              borderColor: "#00E676", // Verde para compensação
              backgroundColor: "rgba(0, 230, 118, 0.1)",
              borderWidth: 2,
              tension: 0.3,
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
        titleColor: "#1976D2", // Azul mais escuro para título
        bodyColor: "#212121",
        borderColor: "rgba(33, 150, 243, 0.2)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          labelPointStyle: () => ({
            pointStyle: "circle" as const,
            rotation: 0,
          }),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#666",
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.3,
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
          <Line data={chartData} options={options} />
        ) : (
          <Typography color="text.secondary">Nenhum dado disponível</Typography>
        )}
      </Box>
    </Box>
  )
}

