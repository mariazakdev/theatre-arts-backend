exports.up = async function(knex) {
    try {
      const exists = await knex.schema.hasTable('votes_tracker');
      if (!exists) {
        await knex.schema.createTable('votes_tracker', table => {
          table.increments('id').primary();
          table.integer('user_id').unsigned().notNullable();
          table.integer('contestant_id').unsigned().notNullable();
          table.integer('votes_count').defaultTo(1).notNullable();
          table.integer('voting_round').defaultTo(1).notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
  
          table.unique(['user_id', 'contestant_id']);
          table.foreign('user_id').references('users.id');
          table.foreign('contestant_id').references('contestants.id');
        });
      }
    } catch (error) {
      console.error('Error creating votes tracker table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('votes_tracker');
    } catch (error) {
      console.error('Error dropping votes tracker table:', error);
      throw error;
    }
  };
  