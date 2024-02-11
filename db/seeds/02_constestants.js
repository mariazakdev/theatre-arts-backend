exports.seed = async function(knex) {
  // Deletes ALL existing entries in `contestants` table
  await knex('contestants').del();

  // Inserts seed entries
  await knex('contestants').insert([
    {
      user_id: 41, // ID matching the user
      name: 'Brad Smith', 
      description: 'I love theatre. I have a backround in broadway.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-501787000-2048x2048.jpg', 
      url_video: 'https://www.youtube.com/watch?v=0yZcDeVsj_Y', 
      votes: 550, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 42, // ID matching the user
      name: 'Kevin Rogers', 
      description: 'I used to be a sports athlete until my injury. Now I want to act.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-504123304-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=HMxbdAEUqfk', 
      votes: 440,// Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 43, // ID matching the user
      name: 'Lex Bobson', 
      description: 'Hoping to make my dad proud.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-811177514-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 410, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 44, // ID matching the user
      name: 'Angelo Markus', 
      description: 'I am an engineer, but I do love to perform. Please vote for me.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-858449444-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=-1tLkSJNK0M', 
      votes: 210, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 45, // ID matching the user
      name: 'Terry Corner', 
      description: 'Trying to stay active and young. Why not do this? yay! ', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-1218999241-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 180, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 46, // ID matching the user
      name: 'Lara Smith', 
      description: 'I love theatre. I have a backround in broadway.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/4abb0a2c-2fd7-4fa8-ad16-792f329249cd/Miranda_Low+Res-9.jpg?format=500w', 
      url_video: 'https://www.youtube.com/watch?v=0yZcDeVsj_Y', 
      votes: 170, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 47, // ID matching the user
      name: 'Cathy Rogers', 
      description: 'I used to be a sports athlete until my injury. Now I want to act.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/8ca61b60-3111-498a-95ce-20f745e8dab3/Poppy+and+Finch_Low+Res-32.jpg?format=500w',
      url_video: 'https://www.youtube.com/watch?v=HMxbdAEUqfk', 
      votes: 160, // Starting votes
      active: true // contestant active and competing   
    },
    {
      user_id: 48, // ID matching the user
      name: 'Branda Bobson', 
      description: 'Hoping to make my dad proud.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/e312bac2-54cf-4ad7-90bb-026124394725/Lily_Low+Res-8.jpg?format=500w', 
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 150, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 49, // ID matching the user
      name: 'Cookie Markus', 
      description: 'I am an engineer, but I do love to perform. Please vote for me.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/39b565a6-197c-4e06-96c8-44b094e27315/Wilder_Low+Res-9.jpg?format=500w', 
      url_video: 'https://www.youtube.com/watch?v=-1tLkSJNK0M', 
      votes: 140, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 50, // ID matching the user
      name: 'Sandy Corner', 
      description: 'Trying to stay active and young. Why not do this? yay! ', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/43c92e64-73ca-46c8-9b98-1638987e6819/Spring+2022_Low+Res-122.jpg?format=500w',
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 130, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 51, // ID matching the user
      name: 'Brad Smith', 
      description: 'I love theatre. I have a backround in broadway.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-501787000-2048x2048.jpg', 
      url_video: 'https://www.youtube.com/watch?v=0yZcDeVsj_Y', 
      votes: 120, // Starting votes
      active: true // contestant active and competing

    },
    {
      user_id: 52, // ID matching the user
      name: 'Kevin Rogers', 
      description: 'I used to be a sports athlete until my injury. Now I want to act.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-504123304-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=HMxbdAEUqfk', 
      votes: 90, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 53, // ID matching the user
      name: 'Lex Bobson', 
      description: 'Hoping to make my dad proud.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-811177514-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 80,// Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 54, // ID matching the user
      name: 'Angelo Markus', 
      description: 'I am an engineer, but I do love to perform. Please vote for me.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-858449444-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=-1tLkSJNK0M', 
      votes: 70, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 55, // ID matching the user
      name: 'Terry Corner', 
      description: 'Trying to stay active and young. Why not do this? yay! ', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-1218999241-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 60, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 56, // ID matching the user
      name: 'Lara Smith', 
      description: 'I love theatre. I have a backround in broadway.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/4abb0a2c-2fd7-4fa8-ad16-792f329249cd/Miranda_Low+Res-9.jpg?format=500w', 
      url_video: 'https://www.youtube.com/watch?v=0yZcDeVsj_Y', 
      votes:50, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 57, // ID matching the user
      name: 'Cathy Rogers', 
      description: 'I used to be a sports athlete until my injury. Now I want to act.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/8ca61b60-3111-498a-95ce-20f745e8dab3/Poppy+and+Finch_Low+Res-32.jpg?format=500w',
      url_video: 'https://www.youtube.com/watch?v=HMxbdAEUqfk', 
      votes: 40, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 58, // ID matching the user
      name: 'Branda Bobson', 
      description: 'Hoping to make my dad proud.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/e312bac2-54cf-4ad7-90bb-026124394725/Lily_Low+Res-8.jpg?format=500w', 
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 30, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 59, // ID matching the user
      name: 'Cookie Markus', 
      description: 'I am an engineer, but I do love to perform. Please vote for me.', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/39b565a6-197c-4e06-96c8-44b094e27315/Wilder_Low+Res-9.jpg?format=500w', 
      url_video: 'https://www.youtube.com/watch?v=-1tLkSJNK0M', 
      votes: 20, // Starting votes
      active: true // contestant active and competing
    },
    {
      user_id: 60, // ID matching the user
      name: 'Sandy Corner', 
      description: 'Trying to stay active and young. Why not do this? yay! ', 
      url_photo: 'https://images.squarespace-cdn.com/content/v1/5ef253fe0814c166c3d8b4a5/43c92e64-73ca-46c8-9b98-1638987e6819/Spring+2022_Low+Res-122.jpg?format=500w',
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 10, // Starting votes
      active: true // contestant active and competing
    }
  ]);
};
