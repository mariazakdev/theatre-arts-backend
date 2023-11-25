exports.up = function(knex) {
    return new Promise((resolve, reject) => {
      knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('firebase_auth_id').notNullable().unique();
        table.string('email').notNullable().unique();
        table.boolean('is_contestant').notNullable().defaultTo(false);
        table.timestamps(true, true);
      })
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
  };
  
  exports.down = function(knex) {
    return new Promise((resolve, reject) => {
      knex.schema.dropTableIfExists('users')
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
  };
  