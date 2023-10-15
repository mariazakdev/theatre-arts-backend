
exports.seed = async function(knex) {
try{

    await knex('users').del();

    await knex('users').insert([
      {
        firebase_auth_id: 'fAuthId1',
        email: 'contestant1@example.com',
        is_contestant: true,
        created_at: new Date()
      },
      {
        firebase_auth_id: 'fAuthId2',
        email: 'contestant2@example.com',
        is_contestant: true,
        created_at: new Date()
      },
      {
        firebase_auth_id: 'fAuthId3',
        email: 'voter1@example.com',
        is_contestant: false,
        created_at: new Date()
      },
      {
        firebase_auth_id: 'fAuthId4',
        email: 'voter2@example.com',
        is_contestant: false,
        created_at: new Date()
      },
      {
        firebase_auth_id: 'fAuthId5',
        email: 'both1@example.com', 
        is_contestant: true,
        created_at: new Date()
      }
  ]);
} catch ( error) {
  console.error('Error seeding data in users table', error);
}


};
