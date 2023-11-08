exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
      table.dropColumn('first_name');
      table.dropColumn('last_name');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
    });
  };
  
// | id               | int unsigned | NO   | PRI | NULL              | auto_increment    |
// | firebase_auth_id | varchar(255) | NO   | UNI | NULL              |                   |
// | email            | varchar(255) | NO   | UNI | NULL              |                   |
// | is_contestant    | tinyint(1)   | NO   |     | 0                 |                   |
// | created_at       | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |