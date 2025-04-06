import axios from 'axios';
import { Invoice } from '../types/Invoice';

export class Invoices {
    private baseUrl: string;
    private static instance: Invoices;
    private onUpdateCallback?: () => void;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        Invoices.instance = this;
    }

    static getInstance(): Invoices | null {
        return this.instance;
    }

    setOnUpdate(callback: () => void) {
        this.onUpdateCallback = callback;
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

    async uploadInvoice(pdfFile: File): Promise<Invoice> {
        try {
            const formData = new FormData();
            formData.append('file', pdfFile);

            const response = await axios.post<Invoice>(
                `${this.baseUrl}upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 30000,
                    validateStatus: (status) => {
                        return status >= 200 && status < 300;
                    }
                }
            );

            // Chama o callback de atualização se existir
            if (this.onUpdateCallback) {
                this.onUpdateCallback();
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error uploading invoice:', {
                    status: error.response?.status,
                    message: error.message,
                    url: error.config?.url
                });
                throw new Error(`Failed to upload invoice: ${error.message}`);
            }
            throw error;
        }
    }
}