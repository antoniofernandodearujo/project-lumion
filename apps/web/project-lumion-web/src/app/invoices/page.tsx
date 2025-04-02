"use client"

import { useState, useEffect } from "react"
import { Container, Box, Typography } from "@mui/material"

import InvoiceTable from "@/components/invoices/InvoiceTable"
import ClienteFilter from "@/components/filters/ClientFilter"

import { Invoices } from "@/core/get-invoices"
import { Invoice } from "@/types/Invoice"

export default function BibliotecaFaturas() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const invoiceService = new Invoices("http://localhost:3001/api/invoices/")
    setIsLoading(true);
    invoiceService
      .getInvoices()
      .then((data) => {
        setAllInvoices(data)
        setFilteredInvoices(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao buscar faturas:', err)
        setIsLoading(false)
      })
  }, [])

  // Criar lista única de clientes
  const uniqueClients = Array.from(new Set(allInvoices.map(invoice => invoice.clientNumber)))
    .map(clientNumber => ({
      id: clientNumber,
      nome: clientNumber // Você pode adicionar o nome real do cliente se disponível
    }));

  const handleClientChange = async (clientNumber: string, shouldRefreshAll?: boolean) => {
    const invoiceService = new Invoices("http://localhost:3001/api/invoices/")
    
    try {
      if (shouldRefreshAll) {
        // Recarrega todas as faturas
        const allData = await invoiceService.getInvoices()
        setAllInvoices(allData)
        setFilteredInvoices(allData)
      } else if (clientNumber) {
        // Filtra localmente para o cliente selecionado
        const filteredInvoices = allInvoices.filter(
          (invoice) => invoice.clientNumber === clientNumber
        )
        setFilteredInvoices(filteredInvoices)
      }
    } catch (error) {
      console.error('Erro ao atualizar faturas:', error)
    }
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, color: "#006400" }}>
        Biblioteca de Faturas
      </Typography>

      <Box>
        <ClienteFilter 
          clientes={uniqueClients}
          value=""
          onChange={handleClientChange}
        />
      </Box>

      <Box mt={4}>
        {isLoading ? (
          <Typography>Carregando faturas...</Typography>
        ) : (
          <InvoiceTable invoices={filteredInvoices} />
        )}
      </Box>
    </Container>
  )
}
