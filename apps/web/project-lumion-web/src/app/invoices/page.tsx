"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material"

import ClientFilter from "@/components/filters/ClientFilter"
import InvoiceTable from "@/components/invoices/InvoiceTable"
import MonthYearFilter from "@/components/filters/DateRangeFilter"
import SearchFilter from "@/components/filters/Search"
import AddInvoiceFab from "@/components/AddInvoiceFab"

import { Invoices } from "@/core/get-invoices"
import type { Invoice } from "@/types/Invoice"
import type { InvoiceUpload } from "@/types/Invoice"

export default function BibliotecaFaturas() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const invoiceService = new Invoices("http://localhost:3001/api/invoices/")
    setIsLoading(true)
    invoiceService
      .getInvoices()
      .then((data) => {
        setAllInvoices(data)
        setFilteredInvoices(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Erro ao buscar faturas:", err)
        setIsLoading(false)
      })
  }, [])

  // Criar lista única de clientes
  const uniqueClients = Array.from(new Set(allInvoices.map((invoice) => invoice.clientNumber))).map((clientNumber) => ({
    id: clientNumber,
    nome: clientNumber,
  }))

  // Criar lista única de meses/anos
  const uniqueMonths = Array.from(new Set(allInvoices.map((invoice) => invoice.referenceMonth))).sort((a, b) => {
    // Ordenar meses cronologicamente
    const [monthA, yearA] = a.split("/")
    const [monthB, yearB] = b.split("/")

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

    if (yearA !== yearB) return Number.parseInt(yearA) - Number.parseInt(yearB)
    return monthMap[monthA] - monthMap[monthB]
  })

  const handleClientChange = (clientNumber: string) => {
    setSelectedClient(clientNumber)

    // Aplicar filtros
    applyFilters(clientNumber, selectedMonth, searchTerm)
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)

    // Aplicar filtros
    applyFilters(selectedClient, month, searchTerm)
  }

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)

    // Aplicar filtros
    applyFilters(selectedClient, selectedMonth, search)
  }

  const applyFilters = (client: string, month: string, search: string) => {
    let filtered = [...allInvoices]

    if (client) {
      filtered = filtered.filter((invoice) => invoice.clientNumber === client)
    }

    if (month) {
      filtered = filtered.filter((invoice) => invoice.referenceMonth === month)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (invoice) =>
          invoice.clientNumber.toLowerCase().includes(searchLower) ||
          invoice.referenceMonth.toLowerCase().includes(searchLower),
      )
    }

    setFilteredInvoices(filtered)
  }

  const handleSaveInvoice = async (invoiceData: InvoiceUpload): Promise<void> => {
    console.log("Saving invoice:", invoiceData)
    const newInvoice = {
      ...invoiceData,
      id: allInvoices.length + 1,
    }

    setAllInvoices([...allInvoices, newInvoice as unknown as Invoice])
    setFilteredInvoices([...filteredInvoices, newInvoice as unknown as Invoice])
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "rgba(0, 230, 118, 0.2)",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            py: 2.5,
            px: 3,
            borderBottom: "1px solid",
            borderColor: "rgba(0, 230, 118, 0.2)",
          }}
        >
          <Typography variant="h5" component="h1" sx={{ color: "#fff", fontWeight: 700 }}>
            Biblioteca de Faturas
          </Typography>
        </Box>

        {/* Filter Section */}
        <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "rgba(0, 230, 118, 0.05)" }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
            Filtros
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}>
              <ClientFilter clientes={uniqueClients} value={selectedClient} onChange={handleClientChange} />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}>
              <MonthYearFilter months={uniqueMonths} value={selectedMonth} onChange={handleMonthChange} />
            </Box>
            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
              <SearchFilter value={searchTerm} onChange={handleSearchChange} />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Content Section */}
        <Box sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <InvoiceTable invoices={filteredInvoices} />
          )}
        </Box>
      </Paper>

      {/* Add Invoice FAB */}
      <AddInvoiceFab onSave={handleSaveInvoice} />
    </Container>
  )
}

