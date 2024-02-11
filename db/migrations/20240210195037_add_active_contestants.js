exports.up = async function(knex) {
    try {
      await knex.schema.alterTable('contestants', table => {
        table.boolean('active').defaultTo(true); // Adding the active column with default true
      });
    } catch (error) {
      console.error('Error altering contestants table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.alterTable('contestants', table => {
        table.dropColumn('active');
      });
    } catch (error) {
      console.error('Error dropping active column from contestants table:', error);
      throw error;
    }
  };
  
