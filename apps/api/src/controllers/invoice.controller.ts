// Controlador responsável por lidar com as requisições relacionadas às faturas

import { Request, Response } from 'express';
import InvoiceService from '../services/invoice.service';

class InvoiceController {
  /**
   * Endpoint para fazer upload e processar um PDF de fatura.
   * Espera receber no corpo da requisição o caminho do arquivo (filePath).
   */
  async uploadInvoice(req: Request, res: Response) {
    try {
      const filePath: string = req.body.filePath;
      if (!filePath) {
        return res.status(400).json({ error: 'O caminho do arquivo é obrigatório.' });
      }
      // Extrai os dados do PDF e salva a fatura
      const data = await InvoiceService.extractDataFromPDF(filePath);
      const savedInvoice = await InvoiceService.saveInvoice(data);
      res.status(201).json({ message: 'Fatura processada e salva com sucesso!', invoice: savedInvoice });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Endpoint para listar todas as faturas.
   */
  async getInvoices(req: Request, res: Response) {
    try {
      const invoices = await InvoiceService.getAllInvoices();
      res.status(200).json(invoices);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new InvoiceController();
