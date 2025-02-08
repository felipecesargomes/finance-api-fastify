import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('transactions', 'sessionId');
  if (!hasColumn) {
    await knex.schema.alterTable('transactions', (table) => {
      table.string('sessionId', 36).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('sessionId');
  });
}