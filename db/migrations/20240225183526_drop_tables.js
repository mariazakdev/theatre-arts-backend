exports.up = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('votes');
      await knex.schema.dropTableIfExists('paid_votes');
      await knex.schema.dropTableIfExists('stripe_payments');
      await knex.schema.dropTableIfExists('contestants');
      await knex.schema.dropTableIfExists('users');
    } catch (error) {
      console.error('Error dropping tables:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    console.log('No down migration needed for dropping tables.');
  };
  