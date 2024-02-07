exports.up = async function(knex) {
    try {
      // Drop 'paid_votes' table
      await knex.schema.dropTableIfExists('paid_votes');
  
      // Drop 'stripe_payments' table
      await knex.schema.dropTableIfExists('stripe_payments');
  
      // Drop 'contestants' table
      await knex.schema.dropTableIfExists('contestants');
  
      // Drop 'users' table
      await knex.schema.dropTableIfExists('users');
  
      console.log('Tables dropped successfully.');
    } catch (error) {
      console.error('Error dropping tables:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    console.error('Down migration not supported for dropping tables.');
    throw new Error('Down migration not supported for dropping tables.');
  };
  