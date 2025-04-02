"use client"

import React, { useEffect, useState } from "react";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box } from "@mui/material";

import { Invoices } from "@/core/get-invoices";

ChartJS.register(ArcElement, Tooltip, Legend);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function FinancialChart() {
  const invoices = new Invoices("http://localhost:3001/api/invoices/");
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  } | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await invoices.getInvoices();

        // Calculando os totais
        const valorTotalSemGD = response.reduce((sum, item) => sum + item.valorTotalSemGD, 0);
        const economiaGD = response.reduce((sum, item) => sum + item.economiaGD, 0);

        setChartData({
          labels: [
            `Valor Total sem GD (${formatCurrency(valorTotalSemGD)})`,
            `Economia GD (${formatCurrency(economiaGD)})`
          ],
          datasets: [{
            data: [valorTotalSemGD, economiaGD],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(75, 192, 192, 0.8)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 4,
      }}
    >
      {chartData && (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Resultados Financeiros",
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    return ` ${formatCurrency(value)}`;
                  }
                }
              }
            }
          }}
        />
      )}
    </Box> 
  )
}

