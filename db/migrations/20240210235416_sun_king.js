exports.up = async function (knex) {
    try {
      await knex.schema.createTable('sun_data', function (table) {
        table.increments('id').primary();
        table.string('title');
        table.string('subtitle');
        table.text('content');
      });
      console.log('Table "sun_data" created successfully.');
    } catch (error) {
      console.error('Error creating table "sun_data":', error.message);
      throw error;
    }
  };
  
  exports.down = async function (knex) {
    try {
      await knex.schema.dropTable('sun_data');
      console.log('Table "sun_data" dropped successfully.');
    } catch (error) {
      console.error('Error dropping table "sun_data":', error.message);
      throw error;
    }
  };
  