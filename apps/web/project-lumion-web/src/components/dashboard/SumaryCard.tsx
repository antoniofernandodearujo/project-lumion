import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Card from './Card';
import { Invoices } from '@/core/get-invoices';

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function SummaryCards() {
  const [summaryData, setSummaryData] = useState({
    totalEnergyConsumption: 0,
    totalCompensatedEnergy: 0,
    totalSavings: 0,
    totalBillWithoutGD: 0,
  });

  useEffect(() => {
    const invoices = new Invoices("http://localhost:3001/api/invoices/");
    
    const fetchData = async () => {
      try {
        const data = await invoices.getInvoices();
        
        setSummaryData({
          totalEnergyConsumption: data.reduce((sum, item) => sum + item.consumoEnergiaEletrica, 0),
          totalCompensatedEnergy: data.reduce((sum, item) => sum + item.energiaCompensadaKwh, 0),
          totalSavings: data.reduce((sum, item) => sum + item.economiaGD, 0),
          totalBillWithoutGD: data.reduce((sum, item) => sum + item.valorTotalSemGD, 0),
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 4 }}>
      <Card
        title="Consumo Total"
        value={`${formatNumber(summaryData.totalEnergyConsumption)} kWh`}
        description="Total de energia elétrica consumida"
        type="energy"
      />
      <Card
        title="Energia Compensada"
        value={`${formatNumber(summaryData.totalCompensatedEnergy)} kWh`}
        description="Total de energia compensada pelo sistema GD"
        type="energy"
      />
      <Card
        title="Economia Total"
        value={formatCurrency(summaryData.totalSavings)}
        description="Valor total economizado com GD"
        type="savings"
      />
      <Card
        title="Valor sem GD"
        value={formatCurrency(summaryData.totalBillWithoutGD)}
        description="Valor total das faturas sem GD"
        type="money"
      />
    </Box>
  );
}