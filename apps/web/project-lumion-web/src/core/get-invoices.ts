import axios from 'axios';
import { Invoice } from '../types/Invoice';

export class Invoices {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getInvoices(): Promise<Invoice[]> {
        try {
            const response = await axios.get<Invoice[]>(`${this.baseUrl}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw error;
        }
    }

    async getInvoiceByNumber(clientNumber: string): Promise<Invoice | null> {
        try {
            const response = await axios.get<Invoice>(`${this.baseUrl}/client/${clientNumber}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching invoice by number:', error);
            throw error;
        }
    }

    async uploadInvoice(invoice: Invoice): Promise<Invoice> {
        try {
            const response = await axios.post<Invoice>(
                `${this.baseUrl}/upload`, 
                invoice,
                {
                    headers: {
                        'Content-Type': 'application/pdf'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error uploading invoice:', error);
            throw error;
        }
    }
}