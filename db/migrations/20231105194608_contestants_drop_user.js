exports.up = function(knex) {
    return knex.schema.table('contestants', function(table) {
      // Drop foreign key first to avoid constraints error.
      table.dropForeign('user_id');
  
      // If 'user_id' is a primary key, we need to drop it.
      // Since Knex doesn't directly support dropping primary keys, we use raw SQL.
      return knex.raw('ALTER TABLE `contestants` DROP PRIMARY KEY');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('contestants', function(table) {
      // Recreate the foreign key constraint.
      table.foreign('user_id').references('users.id');
  
      // Recreate the primary key using raw SQL.
      return knex.raw('ALTER TABLE `contestants` ADD PRIMARY KEY (`user_id`)');
    });
  };
  