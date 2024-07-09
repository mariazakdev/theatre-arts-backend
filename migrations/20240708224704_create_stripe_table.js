exports.up = async function(knex) {
    try {
      await knex.schema.createTable('stripe_payments', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.string('payment_intent_id').notNullable();
        table.decimal('amount', 10, 2);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('users.id');
      });
    } catch (error) {
      console.error('Error creating stripe_payments table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('stripe_payments');
    } catch (error) {
      console.error('Error dropping stripe_payments table:', error);
      throw error;
    }
  };
  