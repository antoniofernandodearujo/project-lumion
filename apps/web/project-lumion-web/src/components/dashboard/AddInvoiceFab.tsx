"use client"

import { useState } from "react"
import { Fab, Tooltip, useMediaQuery, useTheme, Zoom } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import AddInvoiceModal from "./AddInvoiceModal"

export interface InvoiceUpload {
  file: File;
  name: string;
  uploadDate: string;
}

interface AddInvoiceFabProps {
  onSave: (pdfData: InvoiceUpload) => Promise<void>
}

export default function AddInvoiceFab({ onSave }: AddInvoiceFabProps) {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip title="Adicionar Nova Fatura" placement="left" TransitionComponent={Zoom}>
        <Fab
          color="primary"
          aria-label="add invoice"
          onClick={handleOpen}
          sx={{
            position: "fixed",
            bottom: isMobile ? 16 : 24,
            right: isMobile ? 16 : 24,
            zIndex: 1000,
            color: "#212121",
            "&:hover": {
              backgroundColor: "#66FFA6",
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <AddInvoiceModal open={open} onClose={handleClose} onSave={onSave} />
    </>
  )
}

