exports.up = function (knex) {
    return knex.schema.createTable('sun_king_data', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('subtitle');
      table.text('content');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('banner_data');
  };