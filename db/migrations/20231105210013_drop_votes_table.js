exports.up = function(knex) {
    return knex.schema
      .dropTableIfExists('votes');
  };
  
  exports.down = function(knex) {
    return knex.schema.createTable('votes', function(table) {
      table.increments('id').primary();
    });
  };
  