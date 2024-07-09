exports.up = async function(knex) {
    // No need to create tables as we are focusing on dropping them
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('stripe_payments');
      await knex.schema.dropTableIfExists('paid_votes');
      await knex.schema.dropTableIfExists('votes_extra');
      await knex.schema.dropTableIfExists('votes_tracker');
    } catch (error) {
      console.error('Error dropping tables:', error);
      throw error;
    }
  };
  