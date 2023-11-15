exports.seed = async function(knex) {
    // Deletes ALL existing entries in `stripe_payments`
    await knex('stripe_payments').del();
  
    // Inserts seed entries into `stripe_payments`
    await knex('stripe_payments').insert([
      // Example entry
      {
        user_id: 41, // Ensure this ID exists in the `users` table
        payment_intent_id: 'pi_123456789',
        amount: 100.00,
      },
    ]);
  
    // Optionally check the inserted data
    const insertedPayments = await knex.select('*').from('stripe_payments');
    console.log(insertedPayments);
  };
  