import { Request, Response } from 'express';
import InvoiceService from '../services/invoice.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sequelize from '../db';

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    fieldSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  }
}).single('file');

class InvoiceController {
  async uploadInvoice(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
      }

      // Create a temporary file path to store the uploaded file
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFilePath = path.join(tempDir, `invoice-${Date.now()}.pdf`);
      fs.writeFileSync(tempFilePath, req.file.buffer);

      try {
        // Extract data from PDF and save invoice
        const data = await InvoiceService.extractDataFromPDF(tempFilePath);
        // Pass both the data and the original PDF buffer
        const savedInvoice = await InvoiceService.saveInvoice(data, req.file.buffer);
        
        // Clean up temporary file
        fs.unlinkSync(tempFilePath);
        
        res.status(201).json({ 
          message: 'Fatura processada e salva com sucesso!', 
          invoice: savedInvoice 
        });
      } catch (error) {
        // Clean up temporary file in case of error
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        throw error;
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await InvoiceService.getAllInvoices();
      res.status(200).json(invoices);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoiceByClientNumber(req: Request, res: Response): Promise<Response> {
    try {
      const { clientNumber } = req.params;
      const invoices = await InvoiceService.getInvoiceByClientNumber(clientNumber);
      return res.status(200).json(invoices);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const uploadMiddleware = upload;
export default new InvoiceController();
