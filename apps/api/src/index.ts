// Arquivo principal que inicializa o servidor Express e sincroniza o banco de dados

import express from 'express';
import cors from 'cors';
import invoiceRoutes from './routes/invoice.routes';
import sequelize from './db';
import './models/invoice.model'; // Garante que o modelo seja carregado

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares para tratamento de JSON e CORS
app.use(express.json());
app.use(cors());

// Configuração das rotas da API
app.use('/api/invoices', invoiceRoutes);

// Sincroniza o banco de dados e inicia o servidor
(async () => {
  try {
    // Sincroniza os modelos com o banco de dados; use { alter: true } apenas em desenvolvimento
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
})();
