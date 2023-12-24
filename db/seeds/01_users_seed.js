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
    },
    {
      id: 47,
      firebase_auth_id: 'fAuthId7',
      email: 'contestantrrerwer@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 48,
      firebase_auth_id: 'fAuthId8',
      email: 'contestanttyty2@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 49,
      firebase_auth_id: 'fAuthId9',
      email: 'voter1uyuy@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 50,
      firebase_auth_id: 'fAuthId10',
      email: 'voteruyuyu2@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {id: 51,
      firebase_auth_id: 'fAuthId11',
      email: 'both1iiii@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 52,
      firebase_auth_id: 'fAuthId12',
      email: 'noncontestantyuut@example.com',
      is_contestant: false, // Set to false for testing
      created_at: new Date()
    },
    {
      id: 53,
      firebase_auth_id: 'fAuthId13',
      email: 'contestantyutyut1@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 54,
      firebase_auth_id: 'fAuthId14',
      email: 'contestant2tyty@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 55,
      firebase_auth_id: 'fAuthId15',
      email: 'voteytuytur1@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 56,
      firebase_auth_id: 'fAuthId16',
      email: 'voter2iiiiiiii@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 57,
      firebase_auth_id: 'fAuthId17',
      email: 'contestautuynt2@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 58,
      firebase_auth_id: 'fAuthId18',
      email: 'vtutyoter1@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 59,
      firebase_auth_id: 'fAuthId19',
      email: 'vottuytuytioer2@example.com',
      is_contestant: true,
      created_at: new Date()
    },
    {
      id: 60,
      firebase_auth_id: 'fAuthId20',
      email: 'voteroiouo2@example.com',
      is_contestant: true,
      created_at: new Date()
    }
  ]);

  // Check the inserted data
  const insertedUsers = await knex.select('*').from('users');
  console.log(insertedUsers);
};
