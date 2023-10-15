exports.up = function(knex) {
    return knex.schema.createTable('contestants', table => {
      table.integer('user_id').primary().unsigned();
      table.string('url_photo');
      table.string('url_video');
      table.text('description');
      table.integer('votes').defaultTo(0);
      table.foreign('user_id').references('users.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('contestants');
  };
  