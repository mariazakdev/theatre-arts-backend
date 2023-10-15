exports.up = function(knex) {
    return knex.schema.createTable('votes', table => {
      table.increments('id').primary();
      table.integer('contestant_user_id').unsigned();
      table.integer('voter_user_id').unsigned();
      table.boolean('is_paid_vote').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
  
      table.foreign('contestant_user_id').references('contestants.user_id');
      table.foreign('voter_user_id').references('users.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('votes');
  };
  