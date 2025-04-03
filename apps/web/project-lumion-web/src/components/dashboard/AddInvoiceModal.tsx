"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Close as CloseIcon, Upload as UploadIcon } from "@mui/icons-material"
import { Invoices } from "@/core/get-invoices"

export interface InvoiceUpload {
  file: File;
  name: string;
  uploadDate: string;
}

interface AddInvoiceModalProps {
  open: boolean
  onClose: () => void
  onSave: (pdfData: InvoiceUpload) => Promise<void>
}

export default function AddInvoiceModal({ open, onClose, onSave }: AddInvoiceModalProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPdfFile(file)
      setFileName(file.name)

      // Convert file to base64 for preview or storage
      const reader = new FileReader()
      reader.onloadend = () => {
        // You can store the base64 string if needed
        // const base64String = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (pdfFile) {
      try {
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1]; // Remove data URL prefix
          
          const invoiceService = new Invoices("http://localhost:3001/api/invoices/");
          
          const uploadData: InvoiceUpload = {
            file: pdfFile,
            name: fileName,
            uploadDate: new Date().toISOString()
          };

          await onSave(uploadData);
          await invoiceService.uploadInvoice({
            ...uploadData,
            pdfFile: base64String,
            id: 0,
            clientNumber: "",
            referenceMonth: "",
            energiaEletricaKwh: 0,
            energiaEletricaValor: 0,
            energiaSCEEEKwh: 0,
            energiaSCEEValor: 0,
            energiaCompensadaKwh: 0,
            energiaCompensadaValor: 0,
            contribIlumPublica: 0,
            consumoEnergiaEletrica: 0,
            valorTotalSemGD: 0,
            economiaGD: 0,
            createdAt: "",
            updatedAt: ""
          });

          // Reset form
          setPdfFile(null);
          setFileName("");
          onClose();
        };

        reader.readAsDataURL(pdfFile);
      } catch (error) {
        console.error('Error uploading invoice:', error);
        // Here you should handle the error appropriately
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#212121",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
          Adicionar Nova Fatura
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box
          sx={{
            border: "1px dashed rgba(0, 230, 118, 0.5)",
            borderRadius: 1,
            p: 4,
            mt: 1,
            textAlign: "center",
            backgroundColor: "rgba(0, 230, 118, 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
          }}
        >
          <input
            accept="application/pdf"
            style={{ display: "none" }}
            id="pdf-file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="pdf-file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              sx={{
                mb: 2,
                px: 3,
                py: 1.5,
                borderColor: "rgba(0, 230, 118, 0.5)",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(0, 230, 118, 0.1)",
                  borderColor: "primary.main",
                },
              }}
            >
              Selecionar PDF da Fatura
            </Button>
          </label>

          {fileName ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" color="primary" fontWeight={500}>
                {fileName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Arquivo selecionado com sucesso!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Arraste e solte o arquivo PDF ou clique para selecionar
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Formatos aceitos: PDF
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!pdfFile}
          sx={{ color: "#212121" }}
        >
          Salvar Fatura
        </Button>
      </DialogActions>
    </Dialog>
  )
}

