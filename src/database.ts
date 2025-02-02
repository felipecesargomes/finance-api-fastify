import knex from 'knex';
import path from 'path';
import { env } from './env';

export const dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', env.DATABASE_URL)
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: path.resolve(__dirname, '..', 'db', 'migrations')
  }
};

const db = knex(dbConfig);
export default db;