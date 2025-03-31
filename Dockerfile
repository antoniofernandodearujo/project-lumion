# Utiliza a imagem oficial do Node.js com Alpine para um ambiente leve
FROM node:22-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de package para instalar as dependências
COPY apps/api/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da API
COPY apps/api/ ./

# Compila o TypeScript
RUN npm run build

EXPOSE 3001

# Inicia a aplicação
CMD ["npm", "run", "start"]
