// Definição do modelo de fatura (Invoice) usando Sequelize e TypeScript

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

// Define os atributos que cada fatura possuirá.
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
  // Variáveis calculadas
  consumoEnergiaEletrica?: number;
  valorTotalSemGD?: number;
  economiaGD?: number;
}

// Alguns campos são opcionais na criação, pois podem ser calculados posteriormente.
interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'consumoEnergiaEletrica' | 'valorTotalSemGD' | 'economiaGD'> {}

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

  // Campos calculados
  public consumoEnergiaEletrica!: number;
  public valorTotalSemGD!: number;
  public economiaGD!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializa o modelo, definindo os campos e seus tipos.
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
