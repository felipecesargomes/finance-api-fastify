import { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      type: 'credit' | 'debit';
      sessionId: string;
      createdAt: string;
    };
  }
}
