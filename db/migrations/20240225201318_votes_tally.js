exports.up = async function(knex) {
    try {
      await knex.schema.createTable('votes', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.integer('contestant_id').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        
        // Add a unique constraint to ensure each user can only vote for a contestant once
        table.unique(['user_id', 'contestant_id']);
        
        // Define foreign keys
        table.foreign('user_id').references('users.id');
        table.foreign('contestant_id').references('contestants.id');
      });
    } catch (error) {
      console.error('Error creating votes table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('votes');
    } catch (error) {
      console.error('Error dropping votes table:', error);
      throw error;
    }
  };
  