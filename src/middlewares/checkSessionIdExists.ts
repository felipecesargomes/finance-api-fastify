// src/middlewares/checkSessionIdExists.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  let { sessionId } = request.cookies as { sessionId?: string };
  if (!sessionId) {
    sessionId = randomUUID();
    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 dias (em segundos)
    });
  }
}
