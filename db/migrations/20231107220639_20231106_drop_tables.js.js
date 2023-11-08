/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return  knex.schema
  .dropTableIfExists('stripe_payments')
  .then(()=> knex.schema.dropTableIfExists('contestants'))
  .then(()=> knex.schema.dropTableIfExists('users'))
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
