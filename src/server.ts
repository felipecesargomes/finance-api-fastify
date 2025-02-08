import { app } from './app';
import { env } from './env';

const start = async () => {
  try {
    const port = Number(env.PORT) || 3000;
    await app.listen({ port });
    console.log(`Server is running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
