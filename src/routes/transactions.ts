// src/routes/transactions.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { randomUUID } from 'crypto';
import db from '../database';
import { z } from 'zod';
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists';

async function transactionsRoutes(app: FastifyInstance, options: FastifyPluginOptions) {

  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.post(
    '/',
    async (request, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit'])
      });
      const { title, amount, type } = createTransactionBodySchema.parse(request.body);
      let { sessionId } = request.cookies as { sessionId?: string };

      if (!sessionId) {
        sessionId = randomUUID();
        reply.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      const finalAmount = type === 'debit' ? amount * -1 : amount;
      await db('transactions').insert({
        id: randomUUID(),
        title,
        amount: finalAmount,
        sessionId,
        createdAt: new Date().toISOString() // Ensure createdAt is a string
      });
      reply.status(201).send();
    }
  );

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies as { sessionId: string };
      const transactions = await db('transactions').where({ sessionId }).select();
      return { transactions };
    }
  );

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
