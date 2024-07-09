exports.up = function(knex) {
    return knex.schema.hasTable('votes').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('votes', function(table) {
          table.increments('id').primary();
          table.integer('user_id').unsigned().notNullable();
          table.integer('contestant_id').unsigned().notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
        });
      }
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('votes');
  };
  