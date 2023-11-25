exports.up = function(knex) {
    return knex.schema
    .dropTableIfExists('paid_votes')
    .then(() => knex.schema.dropTableIfExists('stripe_payments'))
      .then(() => knex.schema.dropTableIfExists('contestants'))
      .then(() => knex.schema.dropTableIfExists('users'));
  };
  
  exports.down = function(knex) {
    // logic to recreate tables if necessary
  };
  