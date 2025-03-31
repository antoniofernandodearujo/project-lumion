// Define as rotas relacionadas às faturas e mapeia para os métodos do controlador

import { Router } from 'express';
import InvoiceController from '../controllers/invoice.controller';

const router = Router();

// Rota para upload e processamento de PDF de fatura
router.post('/upload', (req, res, next) => {
  InvoiceController.uploadInvoice(req, res).catch(next);
});

// Rota para obter todas as faturas
router.get('/', InvoiceController.getInvoices);

export default router;
