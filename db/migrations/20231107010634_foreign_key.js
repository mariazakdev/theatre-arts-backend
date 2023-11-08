exports.seed = async function(knex) {
    // Deletes ALL existing entries from tables with foreign keys to `users`
    await knex('contestants').del();
    await knex('stripe_payments').del(); // Make sure to delete from this table as well
  
    // Deletes ALL existing entries from `users`
    await knex('users').del();
  
    // Inserts seed entries into `users`
    await knex('users').insert([
      // ... your users data
    ]);
  
    // After inserting users and getting their IDs, insert seed entries into `contestants`
    // You may need to retrieve the user IDs again if they are auto-generated to ensure accuracy
    const users = await knex.select('id').from('users');
  
    await knex('contestants').insert([
      // ... your contestants data with the correct user_id from users
    ]);
  
    // After inserting contestants, you can also insert seed data into `stripe_payments`
    // with the correct user_id if needed
    // ... your stripe_payments seeding logic (if necessary)
  
    // Check the inserted data for users and contestants
    const insertedUsers = await knex.select('*').from('users');
    console.log(insertedUsers);
  
    const insertedContestants = await knex.select('*').from('contestants');
    console.log(insertedContestants);
  };
  