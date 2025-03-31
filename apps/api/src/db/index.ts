// Conexão com o banco de dados PostgreSQL usando Sequelize

import { Sequelize } from 'sequelize';

// Utiliza a variável de ambiente DATABASE_URL, ou, em caso de ausência, utiliza a string de conexão padrão.
// No docker-compose, a variável DATABASE_URL pode ser definida para apontar para o serviço 'postgres'.
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://lumi:lumi123@postgres:5432/lumi_db', {
  dialect: 'postgres',
  logging: false
});

export default sequelize;
