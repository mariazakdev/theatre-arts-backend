exports.up = function(knex) {
    return knex.schema.hasTable('votes_extra').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('votes_extra', function(table) {
          table.increments('id').primary();
          table.integer('user_id').unsigned().notNullable();
          table.integer('contestant_id').unsigned().notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('last_voted_at').defaultTo(knex.fn.now()); // Add last_voted_at
        });
      }
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('votes_extra');
  };
  