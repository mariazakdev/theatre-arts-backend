exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('contestants').del();
    await knex('users').del();
  
    // Inserts seed entries for users
    await knex('users').insert([
      {
        firebase_auth_id: 'auth_id_1',
        email: 'user1@example.com',
        is_contestant: false,
        is_admin: false,
        hasPaid: false,
        uploadStatus: false
      },
      {
        firebase_auth_id: 'auth_id_2',
        email: 'user2@example.com',
        is_contestant: true,
        is_admin: false,
        hasPaid: true,
        uploadStatus: true
      },
      {
        firebase_auth_id: 'auth_id_3',
        email: 'user3@example.com',
        is_contestant: true,
        is_admin: false,
        hasPaid: true,
        uploadStatus: true
      },
      {
        firebase_auth_id: 'auth_id_4',
        email: 'user4@example.com',
        is_contestant: true,
        is_admin: false,
        hasPaid: true,
        uploadStatus: true
      },
      {
        firebase_auth_id: 'auth_id_5',
        email: 'user5@example.com',
        is_contestant: false,
        is_admin: true,
        hasPaid: false,
        uploadStatus: false
      },
      {
        firebase_auth_id: 'auth_id_6',
        email: 'user6@example.com',
        is_contestant: false,
        is_admin: false,
        hasPaid: false,
        uploadStatus: false
      }
    ]);
  
    // Fetch the user IDs for contestants
    const users = await knex('users').select('id', 'firebase_auth_id').whereIn('firebase_auth_id', ['auth_id_2', 'auth_id_3', 'auth_id_4']);
  
    // Inserts seed entries for contestants
    await knex('contestants').insert([
      {
        user_id: users.find(user => user.firebase_auth_id === 'auth_id_2').id,
        name: 'Contestant 1',
        description: 'Description for Contestant 1',
        url_photo: 'http://example.com/photo1.jpg',
        url_video: 'http://example.com/video1.mp4',
        votes: 0,
        active: true,
        round: 1,
        group_number: 1
      },
      {
        user_id: users.find(user => user.firebase_auth_id === 'auth_id_3').id,
        name: 'Contestant 2',
        description: 'Description for Contestant 2',
        url_photo: 'http://example.com/photo2.jpg',
        url_video: 'http://example.com/video2.mp4',
        votes: 0,
        active: true,
        round: 1,
        group_number: 1
      },
      {
        user_id: users.find(user => user.firebase_auth_id === 'auth_id_4').id,
        name: 'Contestant 3',
        description: 'Description for Contestant 3',
        url_photo: 'http://example.com/photo3.jpg',
        url_video: 'http://example.com/video3.mp4',
        votes: 0,
        active: true,
        round: 1,
        group_number: 1
      }
    ]);
  };
  