exports.up = function(knex) {
    return knex.schema.createTable('contestants', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('name').notNullable();
      table.text('description');
      table.string('url_photo');
      table.string('url_video');
      table.integer('votes').defaultTo(0);
      table.foreign('user_id').references('users.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('contestants');
  };
  