exports.up = function(knex) {
    return knex.schema.alterTable('users', table => {
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('users', table => {
      table.dropColumn('first_name');
      table.dropColumn('last_name');
    });
  };
  