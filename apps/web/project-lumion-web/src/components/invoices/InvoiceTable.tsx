"use client"

import React, { useState, useEffect } from "react"
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
  Box,
  TablePagination,
  Divider,
} from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import { Invoice } from "@/types/Invoice"
import { Invoices } from "@/core/get-invoices"

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

interface InvoiceTableProps {
  invoices: Invoice[]
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const theme = useTheme()
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(invoices)
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    // Configura o callback de atualização
    const invoiceService = Invoices.getInstance();
    if (invoiceService) {
        invoiceService.setOnUpdate(async () => {
            try {
                const updatedInvoices = await invoiceService.getInvoices();
                setLocalInvoices(updatedInvoices);
            } catch (error) {
                console.error('Error refreshing invoices:', error);
            }
        });
    }
  }, []);

  // Atualiza o estado local quando as props mudam
  useEffect(() => {
    setLocalInvoices(invoices)
  }, [invoices])

  if (!localInvoices || localInvoices.length === 0) {
    return (
      <Paper sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
        <Typography>Nenhuma fatura encontrada</Typography>
      </Paper>
    )
  }

  // Função para organizar as faturas por cliente
  const organizeInvoicesByClient = () => {
    const invoicesByClient: Record<string, Record<string, Invoice>> = {}
    
    localInvoices.forEach((inv) => {
      // Verifica se o cliente já existe
      if (!invoicesByClient[inv.clientNumber]) {
        invoicesByClient[inv.clientNumber] = {}
      }
      // Adiciona ou atualiza a fatura para o mês específico
      invoicesByClient[inv.clientNumber][inv.referenceMonth] = inv
    })

    return invoicesByClient
  }

  const allMonthYears = Array.from(new Set(localInvoices.map((inv) => inv.referenceMonth)))
  // Mantém a ordenação dos meses
  allMonthYears.sort((a, b) => {
    const dateA = parseMonthYear(a)
    const dateB = parseMonthYear(b)
    return dateA.getTime() - dateB.getTime()
  })

  const invoicesByClient = organizeInvoicesByClient()
  const clientEntries = Object.entries(invoicesByClient)
  const paginatedClients = clientEntries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

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
      const invoiceValue = 
        (invoice.energiaEletricaValor || 0) +
        (invoice.contribIlumPublica || 0) +
        (invoice.energiaCompensadaValor || 0) +
        (invoice.energiaSCEEValor || 0);
      
      return total + invoiceValue;
    }, 0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ mt: 2, borderRadius: 2 }}>
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
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  backgroundColor: theme.palette.primary.main,
                  width: '200px'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} color="#fff">
                    Valor Total &#40;Anual&#41;
                  </Typography>
                </Box>
              </TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.map(([clientNumber, invoicesByMonth], index) => {
              const totalInvoiceValue = getTotalInvoiceValue(invoicesByMonth);

              return (
                <TableRow key={`${clientNumber}-${index}`}>
                  {/* Primeira coluna: número do cliente */}
                  <TableCell 
                    key={`client-${clientNumber}`}
                    sx={{ 
                      fontWeight: 600, 
                      backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : theme.palette.grey[50] 
                    }}
                  >
                    {clientNumber}
                  </TableCell>

                  {/* Colunas dinâmicas: para cada mês, mostra a fatura + botão de download */}
                  {allMonthYears.map((monthYear) => {
                    const invoice = invoicesByMonth[monthYear]
                    if (!invoice) {
                      return <TableCell key={`${clientNumber}-${monthYear}-empty`} align="center" sx={{ padding: "4px", minWidth: "80px" }}>-</TableCell>
                    }

                    // const consumption = getTotalConsumption(invoice);

                    const valueInvoice = 
                      invoice.energiaEletricaValor 
                      + invoice.contribIlumPublica 
                      + invoice.energiaCompensadaValor 
                      + invoice.energiaSCEEValor;

                    const totalPrice = valueInvoice?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })

                    return (
                      <TableCell key={`${clientNumber}-${monthYear}`} align="center" sx={{ padding: "4px", minWidth: "80px" }}>
                        <Tooltip
                          title={
                            <Box>
                              <Typography variant="body2">
                                Energia Elétrica: <strong>{invoice.energiaEletricaKwh?.toFixed(2) || 0} kWh</strong>
                              </Typography>
                              <Typography variant="body2">
                                Energia SCEE s/ ICMS: <strong>{invoice.energiaSCEEEKwh?.toFixed(2) || 0} kWh</strong>
                              </Typography>
                              <Typography variant="body2">
                                Energia Compensada GD I: <strong>{invoice.energiaCompensadaKwh?.toFixed(2) || 0} kWh</strong>
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="body2">
                                Valor da Fatura: <strong>{totalPrice}</strong>
                              </Typography>
                            </Box>
                          }
                          arrow
                        >
                          <Box component="span" sx={{ fontWeight: 500 }}>
                            Boleto
                          </Box>
                        </Tooltip>

                        <Tooltip title={`Baixar fatura de ${monthYear}`} arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(invoice)}
                            disabled={!invoice.pdfFile || downloadingInvoiceId === invoice.id}
                            sx={{
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(0, 230, 118, 0.1)' 
                                : 'rgba(0, 230, 118, 0.05)',
                              '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                  ? 'rgba(0, 230, 118, 0.2)'
                                  : 'rgba(0, 230, 118, 0.1)',
                              },
                              '&.Mui-disabled': {
                                backgroundColor: theme.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.05)'
                                  : 'rgba(0, 0, 0, 0.05)',
                              },
                              ml: 1, // margin left for spacing from the text
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <DownloadIcon 
                              fontSize="inherit" 
                              sx={{ 
                                color: invoice.pdfFile 
                                  ? theme.palette.primary.main
                                  : theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.3)' 
                                    : 'rgba(0, 0, 0, 0.3)',
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )
                  })}

                  {/* Coluna para total de faturas */}
                  <TableCell 
                    key={`${clientNumber}-total`}
                    align="center"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : theme.palette.grey[50],
                      borderLeft: `1px solid ${theme.palette.divider}`,
                      fontWeight: 600
                    }}
                  >
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="body2">
                            Total Energia Elétrica: <strong>
                              {Object.values(invoicesByMonth)
                                .reduce((total, inv) => total + (inv.energiaEletricaKwh || 0), 0)
                                .toFixed(2)} kWh
                            </strong>
                          </Typography>
                          <Typography variant="body2">
                            Total Energia SCEE: <strong>
                              {Object.values(invoicesByMonth)
                                .reduce((total, inv) => total + (inv.energiaSCEEEKwh || 0), 0)
                                .toFixed(2)} kWh
                            </strong>
                          </Typography>
                          <Typography variant="body2">
                            Total Energia Compensada: <strong>
                              {Object.values(invoicesByMonth)
                                .reduce((total, inv) => total + (inv.energiaCompensadaKwh || 0), 0)
                                .toFixed(2)} kWh
                            </strong>
                          </Typography>
                        </Box>
                      }
                      arrow
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
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
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={clientEntries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count} clientes`
        }
        labelRowsPerPage="Clientes por página:"
      />
    </Paper>
  )
}
