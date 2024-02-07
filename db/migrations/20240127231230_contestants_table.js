exports.up = async function(knex) {
    try {
      await knex.schema.createTable('contestants', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('name').notNullable();
        table.text('description');
        table.string('url_photo');
        table.string('url_video');
        table.integer('votes').defaultTo(0);
        table.foreign('user_id').references('users.id');
      });
    } catch (error) {
      console.error('Error creating contestants table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.dropTableIfExists('contestants');
    } catch (error) {
      console.error('Error dropping contestants table:', error);
      throw error;
    }
  };
  