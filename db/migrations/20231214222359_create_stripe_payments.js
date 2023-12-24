exports.up = function(knex) {
    return new Promise((resolve, reject) => {
      knex.schema.createTable('stripe_payments', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.string('payment_intent_id').notNullable();
        table.decimal('amount', 10, 2);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('users.id');
      })
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
  };
  
  exports.down = function(knex) {
    return new Promise((resolve, reject) => {
      knex.schema.dropTableIfExists('stripe_payments')
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
  };
  