// tests/transactions.spec.ts
import request from 'supertest';
import app from '../src/app';
import { execSync } from 'child_process';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

beforeAll(async () => {
  execSync('npm run migrate:rollback --all', { stdio: 'inherit' });
  execSync('npm run migrate', { stdio: 'inherit' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Transactions Routes', () => {
  it('should be able to create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5000,
        type: 'credit'
      });
    expect(response.status).toBe(201);
  });

  it('should be able to list all transactions', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'list transaction',
        amount: 1000,
        type: 'credit'
      });
    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', (await request(app.server)
        .post('/transactions')
        .send({
          title: 'cookie transaction',
          amount: 2000,
          type: 'credit'
        })
      ).get('Set-Cookie') || '');
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body.transactions)).toBe(true);
  });

  it('should be able to get a transaction by ID', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'detail transaction',
        amount: 3000,
        type: 'credit'
      });
    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', createResponse.get('Set-Cookie') || '');
    const transactions = listResponse.body.transactions;
    const transactionId = transactions[0].id;
    const detailResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', createResponse.get('Set-Cookie') || '');
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body).toHaveProperty('transaction');
    expect(detailResponse.body.transaction).toMatchObject({
      title: 'detail transaction',
      amount: '3000.00'
    });
  });

  it('should be able to get the summary', async () => {
    const createCredit = await request(app.server)
      .post('/transactions')
      .send({
        title: 'credit transaction',
        amount: 5000,
        type: 'credit'
      });
    const cookies = createCredit.get('Set-Cookie') || '';
    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'debit transaction',
        amount: 2000,
        type: 'debit'
      });
    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies);
    expect(summaryResponse.status).toBe(200);
    const total = parseFloat(summaryResponse.body.summary.amount);
    expect(total).toBeCloseTo(3000);
  });
});
