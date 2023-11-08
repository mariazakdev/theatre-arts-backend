exports.up = function(knex) {
    return knex.schema.table('contestants', function(table) {
      // Drop foreign key first to avoid constraints error.
      table.dropForeign('user_id');
      
      // Drop the primary key using raw SQL. Be cautious with raw SQL and always double-check the syntax.
      return knex.raw('ALTER TABLE `contestants` DROP PRIMARY KEY, DROP `user_id`');
    });
  };

  exports.down = function(knex) {
    return knex.schema.table('contestants', function(table) {
      // Re-add the `user_id` column first.
      table.integer('user_id').unsigned();
      
      // Raw SQL to re-add the primary key and the foreign key.
      return knex.raw('ALTER TABLE `contestants` ADD PRIMARY KEY (`user_id`), ADD CONSTRAINT `contestants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)');
    });
  };
  