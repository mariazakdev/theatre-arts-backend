exports.up = function(knex) {
    return knex.schema.createTable('stripe_payments', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.string('payment_intent_id').notNullable();
      table.decimal('amount', 10, 2);
      table.timestamp('created_at').defaultTo(knex.fn.now());
  
      table.foreign('user_id').references('users.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('stripe_payments');
  };
//   mysql> desc stripe_payments;
// +-------------------+---------------+------+-----+-------------------+-------------------+
// | Field             | Type          | Null | Key | Default           | Extra             |
// +-------------------+---------------+------+-----+-------------------+-------------------+
// | id                | int unsigned  | NO   | PRI | NULL              | auto_increment    |
// | user_id           | int unsigned  | YES  | MUL | NULL              |                   |
// | payment_intent_id | varchar(255)  | NO   |     | NULL              |                   |
// | amount            | decimal(10,2) | YES  |     | NULL              |                   |
// | created_at        | timestamp     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +-------------------+---------------+------+-----+-------------------+-------------------+