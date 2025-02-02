// src/app.ts
import Fastify from 'fastify';
import cookie from 'fastify-cookie';
import transactionsRoutes from './routes/transactions';

const app = Fastify();

app.register(cookie);

app.register(transactionsRoutes, { prefix: '/transactions' });

export default app;
