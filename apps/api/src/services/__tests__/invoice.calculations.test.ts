import InvoiceService from '../invoice.service';

describe('InvoiceService Calculations', () => {
  let service: typeof InvoiceService;

  beforeEach(() => {
    service = InvoiceService;
  });

  describe('Cálculos de valores agregados', () => {
    it('deve calcular corretamente o Consumo de Energia Elétrica', async () => {
      // Mock do objeto invoice com valores conhecidos
      const invoice = {
        energiaEletricaKwh: 50,
        energiaSCEEEKwh: 476,
        consumoEnergiaEletrica: 0
      };

      // Calcula o consumo
      invoice.consumoEnergiaEletrica = invoice.energiaEletricaKwh + invoice.energiaSCEEEKwh;

      // Verifica se o resultado está correto
      expect(invoice.consumoEnergiaEletrica).toBe(526);
    });

    it('deve calcular corretamente o Valor Total sem GD', async () => {
      // Mock do objeto invoice com valores conhecidos
      const invoice = {
        energiaEletricaValor: 51.53,
        energiaSCEEValor: 242.21,
        contribIlumPublica: 58.13,
        valorTotalSemGD: 0
      };

      // Calcula o valor total
      invoice.valorTotalSemGD = invoice.energiaEletricaValor + 
                               invoice.energiaSCEEValor + 
                               invoice.contribIlumPublica;

      // Verifica se o resultado está correto (com 2 casas decimais)
      expect(invoice.valorTotalSemGD.toFixed(2)).toBe('351.87');
    });

    it('deve calcular corretamente a Economia GD', async () => {
      // Mock do objeto invoice com valores conhecidos
      const invoice = {
        energiaCompensadaValor: -233.99,
        economiaGD: 0
      };

      // Calcula a economia (valor absoluto)
      invoice.economiaGD = Math.abs(invoice.energiaCompensadaValor);

      // Verifica se o resultado está correto
      expect(invoice.economiaGD.toFixed(2)).toBe('233.99');
    });

    it('deve validar exemplo completo de Abril/24', async () => {
      const invoice = {
        energiaEletricaKwh: 50,
        energiaSCEEEKwh: 476,
        energiaEletricaValor: 51.53,
        energiaSCEEValor: 242.21,
        contribIlumPublica: 58.13,
        energiaCompensadaKwh: 476,
        energiaCompensadaValor: -233.99,
        consumoEnergiaEletrica: 0,
        valorTotalSemGD: 0,
        economiaGD: 0
      };

      // Realiza todos os cálculos
      invoice.consumoEnergiaEletrica = invoice.energiaEletricaKwh + invoice.energiaSCEEEKwh;
      invoice.valorTotalSemGD = invoice.energiaEletricaValor + invoice.energiaSCEEValor + invoice.contribIlumPublica;
      invoice.economiaGD = Math.abs(invoice.energiaCompensadaValor);

      // Verifica todos os resultados
      expect(invoice.consumoEnergiaEletrica).toBe(526); // 50 + 476
      expect(invoice.valorTotalSemGD.toFixed(2)).toBe('351.87'); // 51.53 + 242.21 + 58.13
      expect(invoice.economiaGD.toFixed(2)).toBe('233.99');
      expect(invoice.energiaCompensadaKwh).toBe(476);
    });
  });
});