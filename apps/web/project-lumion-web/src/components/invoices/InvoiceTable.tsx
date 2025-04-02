"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Tooltip,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import { Invoice } from "@/types/Invoice"

// Mapeia string "JAN/2024" -> Date para ordenação
function parseMonthYear(monthYear: string): Date {
  const monthMap: Record<string, number> = {
    JAN: 0,
    FEV: 1,
    MAR: 2,
    ABR: 3,
    MAI: 4,
    JUN: 5,
    JUL: 6,
    AGO: 7,
    SET: 8,
    OUT: 9,
    NOV: 10,
    DEZ: 11,
  }

  const [monthAbbr, yearStr] = monthYear.split("/")
  const year = parseInt(yearStr, 10) || 1970
  const monthIndex = monthMap[monthAbbr] ?? 0
  return new Date(year, monthIndex)
}

// Retorna o consumo total (soma de diferentes tipos de energia)
function getTotalConsumption(invoice: Invoice): number {
  return (
    (invoice.energiaEletricaKwh || 0) +
    (invoice.energiaSCEEEKwh || 0) +
    (invoice.energiaCompensadaKwh || 0)
  )
}

interface InvoiceTableProps {
  invoices: Invoice[]
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null);

  if (!invoices || invoices.length === 0) {
    return (
      <Paper sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
        <Typography>Nenhuma fatura encontrada</Typography>
      </Paper>
    )
  }

  const allMonthYears = Array.from(new Set(invoices.map((inv) => inv.referenceMonth)))

  allMonthYears.sort((a, b) => {
    const dateA = parseMonthYear(a)
    const dateB = parseMonthYear(b)
    return dateA.getTime() - dateB.getTime()
  })

  const invoicesByClient: Record<string, Record<string, Invoice>> = {}
  invoices.forEach((inv) => {
    if (!invoicesByClient[inv.clientNumber]) {
      invoicesByClient[inv.clientNumber] = {}
    }
    invoicesByClient[inv.clientNumber][inv.referenceMonth] = inv
  })

  const handleDownload = async (invoice: Invoice) => {
    if (!invoice.pdfFile) {
      alert('PDF não disponível para esta fatura.');
      return;
    }
  
    try {
      setDownloadingInvoiceId(invoice.id);
      
      const base64Response = invoice.pdfFile;
      const binaryString = window.atob(base64Response);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fatura-${invoice.clientNumber}-${invoice.referenceMonth}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
      alert('Não foi possível baixar a fatura. Por favor, tente novamente mais tarde.');
    } finally {
      setDownloadingInvoiceId(null);
    }
  }

  const getTotalInvoiceValue = (clientInvoices: Record<string, Invoice>): number => {
    return Object.values(clientInvoices).reduce((total, invoice) => {
      return total + (invoice.valorTotalSemGD || 0);
    }, 0);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
          <TableRow>
            <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 600 }}>
              Nº do Cliente
            </TableCell>
            {/* Coluna para cada mês/ano */}
            {allMonthYears.map((monthYear) => (
              <TableCell
                key={monthYear}
                align="center"
                sx={{ color: theme.palette.primary.contrastText, fontWeight: 600 }}
              >
                {monthYear}
              </TableCell>
            ))}
            {/* Nova coluna: Total de faturas */}
            <TableCell
              align="center"
              sx={{ color: theme.palette.primary.contrastText, fontWeight: 600 }}
            >
              Total Faturas
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(invoicesByClient).map(([clientNumber, invoicesByMonth]) => {
            const totalInvoiceValue = getTotalInvoiceValue(invoicesByMonth);

            return (
              <TableRow key={clientNumber}>
                {/* Primeira coluna: número do cliente */}
                <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.grey[50] }}>
                  {clientNumber}
                </TableCell>

                {/* Colunas dinâmicas: para cada mês, mostra a fatura + botão de download */}
                {allMonthYears.map((monthYear) => {
                  const invoice = invoicesByMonth[monthYear]
                  if (!invoice) {
                    return <TableCell key={monthYear} align="center" sx={{ padding: "4px", minWidth: "80px" }}>-</TableCell>
                  }

                  const consumption = getTotalConsumption(invoice)
                  const totalPrice = invoice.valorTotalSemGD?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })

                  return (
                    <TableCell key={monthYear} align="center" sx={{ padding: "4px", minWidth: "80px" }}>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant="body2">
                              kWh: <strong>{consumption.toFixed(2)} kWh</strong>
                            </Typography>
                            <Typography variant="body2">
                              Valor da Fatura: <strong>{totalPrice}</strong>
                            </Typography>
                          </Box>
                        }
                        arrow
                      >
                        <Box component="span" sx={{ fontWeight: 500 }}>
                          Fatura
                        </Box>
                      </Tooltip>

                      <Tooltip title={`Baixar fatura de ${monthYear}`} arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDownload(invoice)}
                          disabled={!invoice.pdfFile || downloadingInvoiceId === invoice.id}
                        >
                          <DownloadIcon 
                            fontSize="inherit" 
                            color={invoice.pdfFile ? 'primary' : 'disabled'}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )
                })}
                
                {/* Coluna para total de faturas */}
                <TableCell align="center">
                  <Tooltip
                    title={
                      <Box>
                        <Typography variant="body2">
                          Total kWh: <strong>{Object.values(invoicesByMonth).reduce((total, inv) => total + getTotalConsumption(inv), 0).toFixed(2)} kWh</strong>
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Typography variant="body2">
                      {totalInvoiceValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
