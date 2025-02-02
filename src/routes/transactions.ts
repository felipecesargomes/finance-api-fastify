// src/routes/transactions.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { randomUUID } from 'crypto';
import db from '../database';
import { z } from 'zod';
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists';

async function transactionsRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  // Exemplo de hook global para este plugin
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  // Rota para criar uma nova transação
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit'])
      });
      const { title, amount, type } = createTransactionBodySchema.parse(request.body);
      const { sessionId } = request.cookies as { sessionId: string };
      const finalAmount = type === 'debit' ? amount * -1 : amount;
      await db('transactions').insert({
        id: randomUUID(),
        title,
        amount: finalAmount,
        sessionId,
        createdAt: new Date()
      });
      reply.status(201).send();
    }
  );

  // Rota para listar todas as transações (filtradas pelo sessionId)
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies as { sessionId: string };
      const transactions = await db('transactions').where({ sessionId }).select();
      return { transactions };
    }
  );

  // Rota para obter detalhes de uma transação específica
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid()
      });
      const { id } = getTransactionParamsSchema.parse(request.params);
      const { sessionId } = request.cookies as { sessionId: string };
      const transaction = await db('transactions').where({ id, sessionId }).first();
      if (!transaction) {
        reply.status(404).send({ error: 'Transaction not found' });
        return;
      }
      return { transaction };
    }
  );

  // Rota para obter o resumo (soma dos amounts)
  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies as { sessionId: string };
      const summaryArray = await db('transactions')
        .where({ sessionId })
        .sum({ amount: 'amount' })
        .first();
      return { summary: summaryArray };
    }
  );
}

export default transactionsRoutes;
