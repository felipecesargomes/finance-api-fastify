// src/server.ts
import app from './app';
import { env } from './env';

const start = async () => {
  try {
    await app.listen({ port: env.PORT });
    console.log(`HTTP server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
