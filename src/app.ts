import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import db from './database';
import transactionsRoutes from './routes/transactions';

const app = Fastify();

app.register(cookie);
app.register(transactionsRoutes, { prefix: 'transactions' });

app.get('/hello', async (request, reply) => {
  return { message: 'Hello World' };
});

export { app };
