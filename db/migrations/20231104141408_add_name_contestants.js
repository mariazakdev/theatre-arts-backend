const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('contestants' , table => {
    table.string('name').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('contestants', table =>{
    table.dropColumn('name');
  } )
};

// | user_id     | int unsigned | NO   | PRI | NULL    |       |
// | url_photo   | varchar(255) | YES  |     | NULL    |       |
// | url_video   | varchar(255) | YES  |     | NULL    |       |
// | description | text         | YES  |     | NULL    |       |
// | votes       | int          | YES  |     | 0       |       |
// | name        | varchar(255) | NO   |     | NULL    |       |