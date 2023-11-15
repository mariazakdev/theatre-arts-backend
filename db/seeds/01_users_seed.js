exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 41,
      firebase_auth_id: 'fAuthId1',
      email: 'contestant1@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 42,
      firebase_auth_id: 'fAuthId2',
      email: 'contestant2@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 43,
      firebase_auth_id: 'fAuthId3',
      email: 'voter1@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 44,
      firebase_auth_id: 'fAuthId4',
      email: 'voter2@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {id: 45,
      firebase_auth_id: 'fAuthId5',
      email: 'both1@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 46,
      firebase_auth_id: 'fAuthId6',
      email: 'noncontestant@example.com',
      is_contestant: false, // Set to false for testing
      created_at: new Date()
    }
  ]);

  // Check the inserted data
  const insertedUsers = await knex.select('*').from('users');
  console.log(insertedUsers);
};
