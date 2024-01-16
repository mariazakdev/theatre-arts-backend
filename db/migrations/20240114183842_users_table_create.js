exports.up = async function(knex) {
    try {
      await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('firebase_auth_id').notNullable().unique();
        table.string('email').notNullable().unique();
        table.boolean('is_contestant').notNullable().defaultTo(false);
        table.boolean('is_admin').notNullable().defaultTo(false); // Added 'is_admin' column
        table.timestamps(true, true);
      });
    } catch (error) {
      console.error('Error creating users table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('users');
    } catch (error) {
      console.error('Error dropping users table:', error);
      throw error;
    }
  };
  