exports.up = function(knex) {
    return knex.schema.createTable('paid_votes', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.string('payment_intent_id').notNullable();
      table.decimal('amount', 10, 2);
      table.integer('votes').notNullable(); // Number of votes purchased
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('paid_votes');
  };
  