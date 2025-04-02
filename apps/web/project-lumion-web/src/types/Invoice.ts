export interface Invoice {
    id: number;
    clientNumber: string;
    referenceMonth: string;
    energiaEletricaKwh: number;
    energiaEletricaValor: number;
    energiaSCEEEKwh: number;
    energiaSCEEValor: number;
    energiaCompensadaKwh: number;
    energiaCompensadaValor: number;
    contribIlumPublica: number;
    pdfFile: string;
    consumoEnergiaEletrica: number;
    valorTotalSemGD: number;
    economiaGD: number;
    createdAt: string;
    updatedAt: string;
}