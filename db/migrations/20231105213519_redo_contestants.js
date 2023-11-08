exports.up = function(knex) {
    // Drop the `contestants` table if it exists
    return knex.schema
      .dropTableIfExists('contestants')
      .then(function () {
        // Recreate the `contestants` table with the `id` field as the primary key
        return knex.schema.createTable('contestants', function (table) {
          table.increments('id').primary();
          table.integer('user_id').unsigned().notNullable();
          table.string('url_photo', 255);
          table.string('url_video', 255);
          table.text('description');
          table.integer('votes').defaultTo(0);
          table.string('name', 255).notNullable();
          table.foreign('user_id').references('users.id');
        });
      });
  };
  
  exports.down = function(knex) {
    // Drop the `contestants` table if needed
    return knex.schema.dropTable('contestants');
  };
  
//   | Field       | Type         | Null | Key | Default | Extra          |
// +-------------+--------------+------+-----+---------+----------------+
// | id          | int unsigned | NO   | PRI | NULL    | auto_increment |
// | user_id     | int unsigned | NO   | MUL | NULL    |                |
// | url_photo   | varchar(255) | YES  |     | NULL    |                |
// | url_video   | varchar(255) | YES  |     | NULL    |                |
// | description | text         | YES  |     | NULL    |                |
// | votes       | int          | YES  |     | 0       |                |
// | name        | varchar(255) | NO   |     | NULL    |                |
// +-------------+--------------+------+-----+---------+----------------+
// 7 rows in set (0.01 sec)

// mysql> desc stripe_payments;
// +-------------------+---------------+------+-----+-------------------+-------------------+
// | Field             | Type          | Null | Key | Default           | Extra             |
// +-------------------+---------------+------+-----+-------------------+-------------------+
// | id                | int unsigned  | NO   | PRI | NULL              | auto_increment    |
// | user_id           | int unsigned  | YES  | MUL | NULL              |                   |
// | payment_intent_id | varchar(255)  | NO   |     | NULL              |                   |
// | amount            | decimal(10,2) | YES  |     | NULL              |                   |
// | created_at        | timestamp     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +-------------------+---------------+------+-----+-------------------+-------------------+
// 5 rows in set (0.00 sec)

// mysql> desc users;
// +------------------+--------------+------+-----+-------------------+-------------------+
// | Field            | Type         | Null | Key | Default           | Extra             |
// +------------------+--------------+------+-----+-------------------+-------------------+
// | id               | int unsigned | NO   | PRI | NULL              | auto_increment    |
// | firebase_auth_id | varchar(255) | NO   | UNI | NULL              |                   |
// | email            | varchar(255) | NO   | UNI | NULL              |                   |
// | is_contestant    | tinyint(1)   | NO   |     | 0                 |                   |
// | created_at       | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +------------------+--------------+------+-----+-------------------+-------------------+