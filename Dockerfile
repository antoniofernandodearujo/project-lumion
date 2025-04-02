FROM node:22-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY apps/api/package*.json ./

# Instala as dependências (incluindo devDependencies)
RUN npm install

# Instala o typescript globalmente
RUN npm install -g typescript
# Instala o ts-node-dev globalmente
RUN npm install -g ts-node-dev

# Copia o restante do código da API
COPY apps/api/ ./

# Executa o build
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "dev"]
