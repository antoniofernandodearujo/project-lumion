// Serviço responsável pela extração de dados dos PDFs, cálculos e interação com o modelo Invoice

import fs from 'fs';
import pdf from 'pdf-parse';
import Invoice from '../models/invoice.model';

class InvoiceService {
  /**
   * Extrai os dados relevantes do PDF e realiza os cálculos necessários.
   * @param filePath - Caminho do arquivo PDF
   * @returns Objeto com os dados extraídos e calculados
   */
  async extractDataFromPDF(filePath: string) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      const text = data.text;
      
      // Extrai dados usando funções auxiliares (implementadas abaixo).
      const clientNumber = this.extractClientNumber(text);
      const referenceMonth = this.extractReferenceMonth(text);
      const energiaEletricaKwh = this.extractNumber(text, 'Energia Elétrica kWh');
      const energiaEletricaValor = this.extractNumber(text, 'Energia Elétrica R\\$');
      const energiaSCEEEKwh = this.extractNumber(text, 'Energia SCEEE s/ICMS kWh');
      const energiaSCEEValor = this.extractNumber(text, 'Energia SCEEE s/ICMS R\\$');
      const energiaCompensadaKwh = this.extractNumber(text, 'Energia Compensada GD I kWh');
      const energiaCompensadaValor = this.extractNumber(text, 'Energia Compensada GD I R\\$');
      const contribIlumPublica = this.extractNumber(text, 'Contrib Ilum Publica Municipal R\\$');
      
      // Cálculos de variáveis
      const consumoEnergiaEletrica = energiaEletricaKwh + energiaSCEEEKwh;
      const valorTotalSemGD = energiaEletricaValor + energiaSCEEValor + contribIlumPublica;
      const economiaGD = energiaCompensadaValor;
  
      // Retorna os dados formatados para posterior armazenamento
      return {
        clientNumber,
        referenceMonth,
        energiaEletricaKwh,
        energiaEletricaValor,
        energiaSCEEEKwh,
        energiaSCEEValor,
        energiaCompensadaKwh,
        energiaCompensadaValor,
        contribIlumPublica,
        consumoEnergiaEletrica,
        valorTotalSemGD,
        economiaGD
      };
    } catch (error) {
      throw new Error('Erro ao extrair dados do PDF: ' + error);
    }
  }

  /**
   * Função para extrair o número do cliente do texto.
   * Aqui você deve implementar a lógica real, por exemplo, usando expressões regulares.
   */
  extractClientNumber(text: string): string {
    // Exemplo dummy; implemente a extração real
    return '12345';
  }

  /**
   * Função para extrair o mês de referência do texto.
   * Implemente a lógica conforme o formato esperado.
   */
  extractReferenceMonth(text: string): string {
    // Exemplo dummy; implemente a extração real
    return 'Abril/24';
  }

  /**
   * Extrai um número a partir de um rótulo presente no texto.
   * @param text - Texto completo extraído do PDF
   * @param label - Rótulo que precede o número (ex.: "Energia Elétrica kWh")
   * @returns Número extraído ou 0 se não encontrar
   */
  extractNumber(text: string, label: string): number {
    // Regex simples para capturar números (inteiros ou decimais) após o rótulo
    const regex = new RegExp(`${label}\\s*[:]?\\s*(\\d+(\\.\\d+)?)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
    return 0;
  }

  /**
   * Salva a fatura extraída no banco de dados.
   * @param data - Objeto com os dados da fatura
   */
  async saveInvoice(data: any) {
    try {
      const invoice = await Invoice.create(data);
      return invoice;
    } catch (error) {
      throw new Error('Erro ao salvar fatura: ' + error);
    }
  }

  /**
   * Retorna todas as faturas armazenadas no banco.
   */
  async getAllInvoices() {
    return Invoice.findAll();
  }
}

export default new InvoiceService();
