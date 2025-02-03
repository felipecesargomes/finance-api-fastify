import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary();
        table.string('title').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.enum('type', ['credit', 'debit']).notNullable();
        table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}

