# Backend do Projeto 🛠️

## Visão Geral
O backend foi desenvolvido em **Node.js** com **PostgreSQL** para armazenamento dos dados e utiliza Docker para facilitar a configuração do ambiente. A API é responsável pela extração, processamento e disponibilização dos dados das faturas.

## Como Rodar o Projeto Separadamente

### Utilizando Docker
1. Navegue até a pasta do backend:
   ```bash
   cd apps/api
#### Inicie os containers com Docker Compose:

```bash
ocker compose build --no-cache
docker compose up -d
```
Isso iniciará tanto a aplicação quanto o banco de dados PostgreSQL.

#### Inicie a aplicação:
A API ficará disponível em: http://localhost:3001/api/invoices/

Acessando o Banco de Dados com psql
Conecte-se ao PostgreSQL utilizando:

```bash
  docker exec -it lumi_postgres bash
  psql -U lumi -d lumi_db
```

### Endpoints da API (exemplos para testar com Postman)
| Method | Endpoint               | Description                |
|--------|------------------------|----------------------------|
| GET    | `/`                    | Lista todos as faturas     |
| POST   | `/upload`              | Envia o arquivo PDF para tratamento   |
| GET    | `/client/:nº_cliente`  | Lista apenas os documentos de um cliente específico           |


