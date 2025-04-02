import express from 'express';
import InvoiceController, { uploadMiddleware } from '../controllers/invoice.controller';

const router = express.Router();

// Error handling middleware
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/upload', uploadMiddleware, asyncHandler(InvoiceController.uploadInvoice));

router.get('/', asyncHandler(InvoiceController.getInvoices));

router.get('/client/:clientNumber', asyncHandler(InvoiceController.getInvoiceByClientNumber));


export default router;
