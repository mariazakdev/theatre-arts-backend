exports.up = async function(knex) {
    try {
      await knex.schema.createTable('paid_votes', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id');
        table.string('payment_intent_id').notNullable();
        table.decimal('amount', 10, 2);
        table.integer('votes').notNullable(); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
    } catch (error) {
      console.error('Error creating paid_votes table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('paid_votes');
    } catch (error) {
      console.error('Error dropping paid_votes table:', error);
      throw error;
    }
  };
  