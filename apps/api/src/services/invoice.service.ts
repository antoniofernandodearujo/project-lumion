import fs from 'fs';
import pdf from 'pdf-parse';
import Invoice from '../models/invoice.model';
import sequelize from '../db';

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
      
      // Log do texto completo
      console.log('\n=== TEXTO COMPLETO EXTRAÍDO ===');
      console.log(data.text);
      
      const text = data.text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
      
      // Log do texto processado
      console.log('\n=== TEXTO APÓS PROCESSAMENTO ===');
      console.log(text);

      // Log da tabela de valores
      console.log('\n=== TENTATIVA DE EXTRAÇÃO DA TABELA ===');
      const tableMatch = text.match(/Itens da Fatura.*?TOTAL/s);
      if (tableMatch) {
        console.log(tableMatch[0]);
      }

      // Log dos números encontrados
      console.log('\n=== NÚMEROS ENCONTRADOS NO TEXTO ===');
      const allNumbers = text.match(/\d+[,.]\d+|\d+/g);
      console.log('Todos os números encontrados:', allNumbers);

      // Log específico para cada seção importante
      console.log('\n=== SEÇÕES IMPORTANTES ===');
      [
        'Energia Elétrica',
        'Energia SCEE s/ ICMS',
        'Energia compensada GD I',
        'Contrib Ilum Publica Municipal'
      ].forEach(section => {
        const sectionRegex = new RegExp(`${section}.*?(?=\\s|$)`, 'i');
        const sectionMatch = text.match(sectionRegex);
        console.log(`\n${section}:`);
        console.log(sectionMatch ? sectionMatch[0] : 'Não encontrado');
      });

      const patterns = {
        clientNumber: /N(?:º|úmero)\s+do\s+Cliente(?:\s+N(?:º|úmero)\s+da\s+Instalação)?\s+(\d+)/i,
        referenceMonth: /Referente\s+a\s*.*?([A-Z]{3}\/\d{4})/i,
        energiaEletrica: {
          // Captura números com milhar (ex: 1.234 ou 1234)
          kwh: /Energia\s+El[ée]trica\s*kWh\s*((?:\d{1,3}\.?)?\d{1,3})/i,
          // Captura valores em R$ com milhar e centavos (ex: 1.234,56)
          valor: /Energia\s+El[ée]trica\s*kWh\s*(?:\d{1,3}\.?)?\d{1,3}\s+[\d,.]+\s+((?:\d{1,3}\.?)?\d{1,3},\d{2})/i
        },
        energiaSCEEE: {
          kwh: /Energia\s+SCEE\s+s\/\s*ICMS\s*kWh\s*((?:\d{1,3}\.?)?\d{1,3})/i,
          valor: /Energia\s+SCEE\s+s\/\s*ICMS\s*kWh\s*(?:\d{1,3}\.?)?\d{1,3}\s+[\d,.]+\s+((?:\d{1,3}\.?)?\d{1,3},\d{2})/i
        },
        energiaCompensada: {
          kwh: /Energia\s+compensada\s+GD\s+I\s*kWh\s*((?:\d{1,3}\.?)?\d{1,3})/i,
          valor: /Energia\s+compensada\s+GD\s+I\s*kWh\s*(?:\d{1,3}\.?)?\d{1,3}\s+[\d,.]+\s+-((?:\d{1,3}\.?)?\d{1,3},\d{2})/i
        },
        contribIlumPublica: /Contrib\s+Ilum\s+Publica\s+Municipal\s*((?:\d{1,3}\.?)?\d{1,3},\d{2})/i
      };

      // Adicione uma função de debug para verificar as extrações
      const debugExtraction = (text: string, patterns: any) => {
        console.log('=== Debug Extrações ===');
        console.log('Energia Elétrica kWh:', text.match(patterns.energiaEletrica.kwh)?.[1]);
        console.log('Energia Elétrica Valor:', text.match(patterns.energiaEletrica.valor)?.[1]);
        console.log('SCEE kWh:', text.match(patterns.energiaSCEEE.kwh)?.[1]);
        console.log('SCEE Valor:', text.match(patterns.energiaSCEEE.valor)?.[1]);
        console.log('Compensada kWh:', text.match(patterns.energiaCompensada.kwh)?.[1]);
        console.log('Compensada Valor:', text.match(patterns.energiaCompensada.valor)?.[1]);
        console.log('Iluminação:', text.match(patterns.contribIlumPublica)?.[1]);
      };

      // Adicione o debug antes de extrair os valores
      debugExtraction(text, patterns);

      const extractValue = (pattern: RegExp, field: string) => {
        const match = text.match(pattern);
        const rawValue = match ? match[1] : null;
        
        if (!rawValue) return 0;
        
        // Remove os pontos dos milhares e substitui vírgula por ponto
        let value = parseFloat(rawValue.replace(/\./g, '').replace(',', '.'));
        
        // Se for um valor da energia compensada, deve ser negativo
        if (field.includes('energiaCompensadaValor')) {
          value = -Math.abs(value);
        }
        
        return value;
      };
      
      const invoice = {
        clientNumber: text.match(patterns.clientNumber)?.[1] || 'Desconhecido',
        referenceMonth: text.match(patterns.referenceMonth)?.[1] || 'Desconhecido',
        energiaEletricaKwh: extractValue(patterns.energiaEletrica.kwh, 'energiaEletricaKwh'),
        energiaEletricaValor: extractValue(patterns.energiaEletrica.valor, 'energiaEletricaValor'),
        energiaSCEEEKwh: extractValue(patterns.energiaSCEEE.kwh, 'energiaSCEEEKwh'),
        energiaSCEEValor: extractValue(patterns.energiaSCEEE.valor, 'energiaSCEEValor'),
        energiaCompensadaKwh: extractValue(patterns.energiaCompensada.kwh, 'energiaCompensadaKwh'),
        energiaCompensadaValor: extractValue(patterns.energiaCompensada.valor, 'energiaCompensadaValor'),
        contribIlumPublica: extractValue(patterns.contribIlumPublica, 'contribIlumPublica'),
        consumoEnergiaEletrica: 0,
        valorTotalSemGD: 0,
        economiaGD: 0
      };

      // Validação dos valores extraídos
      console.log('Valores extraídos:', {
        energiaEletrica: `${invoice.energiaEletricaKwh} kWh - R$ ${invoice.energiaEletricaValor}`,
        energiaSCEEE: `${invoice.energiaSCEEEKwh} kWh - R$ ${invoice.energiaSCEEValor}`,
        energiaCompensada: `${invoice.energiaCompensadaKwh} kWh - R$ ${invoice.energiaCompensadaValor}`,
        contribIlumPublica: `R$ ${invoice.contribIlumPublica}`
      });

      // Cálculos com logs detalhados
      console.log('\n=== DETALHAMENTO DOS CÁLCULOS ===');
      
      // Consumo de Energia
      invoice.consumoEnergiaEletrica = invoice.energiaEletricaKwh + invoice.energiaSCEEEKwh;
      console.log('Consumo de Energia:', {
        energiaEletricaKwh: invoice.energiaEletricaKwh,
        energiaSCEEEKwh: invoice.energiaSCEEEKwh,
        total: invoice.consumoEnergiaEletrica
      });

      // Valor Total sem GD
      invoice.valorTotalSemGD = invoice.energiaEletricaValor + invoice.energiaSCEEValor + invoice.contribIlumPublica;
      console.log('Valor Total sem GD:', {
        energiaEletricaValor: invoice.energiaEletricaValor,
        energiaSCEEValor: invoice.energiaSCEEValor,
        contribIlumPublica: invoice.contribIlumPublica,
        total: invoice.valorTotalSemGD.toFixed(2)
      });

      // Economia GD
      invoice.economiaGD = Math.abs(invoice.energiaCompensadaValor); // Garantindo valor positivo
      console.log('Economia GD:', {
        energiaCompensadaValor: invoice.energiaCompensadaValor,
        economiaGD: invoice.economiaGD.toFixed(2)
      });

      console.log('Cálculos realizados:', {
        consumoTotal: `${invoice.consumoEnergiaEletrica} kWh`,
        valorSemGD: `R$ ${invoice.valorTotalSemGD.toFixed(2)}`,
        economiaGD: `R$ ${invoice.economiaGD.toFixed(2)}`
      });

      // Log adicional após a extração dos valores
      console.log('\n=== VALORES FINAIS EXTRAÍDOS ===');
      Object.entries(invoice).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      return invoice;
    } catch (error: any) {
      console.error('Erro na extração:', error);
      throw new Error(`Erro ao extrair dados do PDF: ${error.message}`);
    }
  }

  extractClientNumber(text: string): string {
    const match = text.match(/N\u00famero do Cliente[:\s]+(\d+)/i);
    return match ? match[1] : 'Desconhecido';
  }

  extractReferenceMonth(text: string): string {
    const match = text.match(/M\u00eas de Refer\u00eancia[:\s]+([a-zA-Z]+\/\d{2})/i);
    return match ? match[1] : 'Desconhecido';
  }

  extractNumber(text: string, regex: RegExp): number {
    const match = text.match(regex);
    if (match && match[1]) {
      return parseFloat(match[1].replace(',', '.'));
    }
    return 0;
  }

  async saveInvoice(data: any, pdfBuffer: Buffer) {
    try {
      // Convert the PDF buffer to base64 string for storage
      const pdfBase64 = pdfBuffer.toString('base64');
      
      // Add the PDF data to the invoice object
      const invoiceData = {
        ...data,
        pdfFile: pdfBase64
      };

      const invoice = await Invoice.create(invoiceData);
      return invoice;
    } catch (error) {
      throw new Error('Erro ao salvar fatura: ' + error);
    }
  }

  async getAllInvoices() {
    return Invoice.findAll();
  }

  async getInvoiceByClientNumber(clientNumber: string) {
    const invoice = await Invoice.findAll({
      where: { clientNumber }
    });
    if (!invoice) {
      throw new Error('Fatura(s) não encontrada para este número de cliente');
    }
    return invoice;
  }

}

export default new InvoiceService();
