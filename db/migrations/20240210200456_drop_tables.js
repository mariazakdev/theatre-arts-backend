exports.up = async function(knex) {
    try {
      // Drop foreign key constraint from votes table
      await knex.schema.alterTable('votes', table => {
        table.dropForeign('user_id');
      });
  
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
  