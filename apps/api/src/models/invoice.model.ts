// Definição do modelo de fatura (Invoice) usando Sequelize e TypeScript

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface InvoiceAttributes {
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
  pdfFile?: string;
  // Variáveis calculadas
  consumoEnergiaEletrica?: number;
  valorTotalSemGD?: number;
  economiaGD?: number;
}

// Alguns campos são opcionais na criação, pois podem ser calculados posteriormente.
interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'consumoEnergiaEletrica' | 'valorTotalSemGD' | 'economiaGD' | 'pdfFile'> {}

// Classe que representa a fatura
class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public clientNumber!: string;
  public referenceMonth!: string;
  public energiaEletricaKwh!: number;
  public energiaEletricaValor!: number;
  public energiaSCEEEKwh!: number;
  public energiaSCEEValor!: number;
  public energiaCompensadaKwh!: number;
  public energiaCompensadaValor!: number;
  public contribIlumPublica!: number;
  public pdfFile!: string;

  // Campos calculados
  public consumoEnergiaEletrica!: number;
  public valorTotalSemGD!: number;
  public economiaGD!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  clientNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  referenceMonth: {
    type: DataTypes.STRING,
    allowNull: false
  },
  energiaEletricaKwh: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  energiaEletricaValor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  energiaSCEEEKwh: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  energiaSCEEValor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  energiaCompensadaKwh: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  energiaCompensadaValor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  contribIlumPublica: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  pdfFile: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'PDF file stored as base64 string'
  },
  // Campos calculados (opcionais na criação)
  consumoEnergiaEletrica: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  valorTotalSemGD: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  economiaGD: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'invoices'
});

export default Invoice;
