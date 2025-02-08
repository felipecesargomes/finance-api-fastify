# Finance API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Knex.js](https://img.shields.io/badge/Knex.js-000000?style=for-the-badge&logo=knex&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![zod](https://img.shields.io/badge/zod-000000?style=for-the-badge&logo=zod&logoColor=white)

## Instalações Frameworks e Bibliotecas

Para instalar as dependências, rode o comando:

```sh
npm install
```

## Variáveis de ambiente

Para configurar as variáveis de ambiente, crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL=./db/app.db
PORT=3333
NODE_ENV=development
```

## Rodando a aplicação

Para rodar a aplicação em modo de desenvolvimento, use o comando:

```sh
npm run dev
```

Para rodar as migrações do banco de dados, use o comando:

```sh
npm run migrate
```

Para reverter as migrações do banco de dados, use o comando:

```sh
npm run migrate:rollback
```

Para compilar o projeto, use o comando:

```sh
npm run build
```

Para iniciar a aplicação em produção, use o comando:

```sh
npm start
```

### Passos para resolver o problema:

1. **Verifique se as migrações estão configuradas corretamente:**
   - Certifique-se de que o arquivo de configuração do Knex (`knexfile.ts`) está correto.
   - Certifique-se de que as migrações estão no diretório correto.

2. **Execute as migrações:**
   - Rode o comando para executar as migrações do banco de dados.
