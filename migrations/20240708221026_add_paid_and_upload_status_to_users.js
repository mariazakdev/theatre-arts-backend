exports.up = async function(knex) {
    try {
      await knex.schema.table('users', table => {
        table.boolean('hasPaid').notNullable().defaultTo(false); // Add hasPaid field
        table.boolean('uploadStatus').notNullable().defaultTo(false); // Add uploadStatus field
      });
    } catch (error) {
      console.error('Error altering users table:', error);
      throw error;
    }
  };
  
  exports.down = async function(knex) {
    try {
      await knex.schema.table('users', table => {
        table.dropColumn('hasPaid'); // Drop hasPaid field
        table.dropColumn('uploadStatus'); // Drop uploadStatus field
      });
    } catch (error) {
      console.error('Error reverting users table alterations:', error);
      throw error;
    }
  };
  