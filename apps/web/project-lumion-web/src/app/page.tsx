"use client"

import { useState } from "react"
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material"

import AddIcon from "@mui/icons-material/Add"
import AddInvoiceModal from "@/components/dashboard/AddInvoiceModal"
import AddInvoiceFab from "@/components/dashboard/AddInvoiceFab"
import SummaryCards from "@/components/dashboard/SumaryCard"
import EnergyChart from "@/components/dashboard/EnergyChart"
import FinancialChart from "@/components/dashboard/FinacialChart"

export interface InvoiceUpload {
  file: File;
  name: string;
  uploadDate: string;
}


export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleSaveInvoice = async (invoiceData: InvoiceUpload): Promise<void> => {
    console.log("Saving invoice:", invoiceData)
    // Here you would typically send this data to your API
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
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
            py: 2,
            px: 3,
            borderBottom: "1px solid",
            borderColor: "rgba(0, 230, 118, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ color: "#fff", fontWeight: 'bold' }}>
            Dashboard
          </Typography>

          {!isMobile && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{
                color: "#212121",
                fontWeight: 500,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#B9F6CA",
                },
              }}
            >
              Adicionar Nova Fatura
            </Button>
          )}
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
              <SummaryCards />

              <Box 
                sx={{ 
                  mt: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: "100%",
                      height: 300,
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "rgba(0, 230, 118, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary.main" fontWeight={700} gutterBottom>
                      Consumo de Energia x Energia Compensada
                    </Typography>
                    <EnergyChart />
                  </Paper>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: "100%",
                      height: 300,
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "rgba(0, 230, 118, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary.main" fontWeight={700} gutterBottom>
                      Resultados Financeiros
                    </Typography>
                    <FinancialChart />
                  </Paper>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>

      <AddInvoiceModal open={openModal} onClose={handleCloseModal} onSave={handleSaveInvoice} />

      {isMobile && <AddInvoiceFab onSave={handleSaveInvoice} />}
    </Container>
  )
}