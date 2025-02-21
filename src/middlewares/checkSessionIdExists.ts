// src/middlewares/checkSessionIdExists.ts
import { FastifyRequest, FastifyReply } from 'fastify';

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  const { sessionId } = request.cookies;

  if (!sessionId) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
