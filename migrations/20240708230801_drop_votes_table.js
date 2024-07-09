exports.up = function(knex) {
    return knex.schema.dropTableIfExists('votes');
  };
  
  exports.down = function(knex) {
    // You can leave this empty or recreate the table if needed
  };
  
