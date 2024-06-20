exports.up = function(knex) {
    return knex.schema.createTable('vote_ip_tracker', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('ip_address').notNullable();
      table.integer('contestant_id').unsigned().notNullable();
      table.timestamp('vote_timestamp').defaultTo(knex.fn.now());
      
      table.foreign('user_id').references('users.id');
      table.foreign('contestant_id').references('contestants.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('vote_ip_tracker');
  };
  