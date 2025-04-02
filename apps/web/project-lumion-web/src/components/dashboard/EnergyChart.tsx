"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box } from "@mui/material";

import { Invoices } from "@/core/get-invoices";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EnergyChart() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
    }[];
  } | null>(null);
  const invoices = new Invoices("http://localhost:3001/api/invoices/");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await invoices.getInvoices();

        // Processando os dados para o gráfico
        const labels = response.map((item) => item.referenceMonth);
        const consumoEnergia = response.map((item) => item.consumoEnergiaEletrica);
        const energiaCompensada = response.map((item) => item.energiaCompensadaKwh);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Consumo de Energia Elétrica (kWh)",
              data: consumoEnergia,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderWidth: 2,
            },
            {
              label: "Energia Compensada (kWh)",
              data: energiaCompensada,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Consumo de Energia x Energia Compensada',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      {chartData ? <Line data={chartData} options={options} /> : <p>Carregando gráfico...</p>}
    </Box>
  );
}
