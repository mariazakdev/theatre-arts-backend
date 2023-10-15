exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('firebase_auth_id').notNullable().unique();
      table.string('email').notNullable().unique();
      table.boolean('is_contestant').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  
