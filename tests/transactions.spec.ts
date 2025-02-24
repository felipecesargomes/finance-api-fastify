import request from 'supertest';
import { app } from '../src/app';
import { execSync } from 'child_process';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

beforeAll(async () => {
  console.log('Running migrations rollback...');
  execSync('npm run migrate:rollback --all', { stdio: 'inherit' });
  console.log('Running migrations...');
  execSync('npm run migrate', { stdio: 'inherit' });
  await app.ready();
  console.log('App is ready.');
}, 30000); 

afterAll(async () => {
  await app.close();
});

describe('Transactions Routes', () => {
  let sessionId: string;

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 100,
        type: 'credit',
      });

    if (response.status !== 201) {
      console.error('Error response:', response.body);
    }
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    sessionId = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('should be able to list all transactions', async () => {
    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', `sessionId=${sessionId}`);
    if (response.status !== 200) {
      console.error('Error response:', response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should be able to get a transaction by ID', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 100,
        type: 'credit',
      });

    const { id } = createResponse.body;

    const response = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', `sessionId=${sessionId}`);
    if (response.status !== 200) {
      console.error('Error response:', response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', id);
  });

  it('should be able to get the summary', async () => {
    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', `sessionId=${sessionId}`);
    if (response.status !== 200) {
      console.error('Error response:', response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('summary');
  });
});