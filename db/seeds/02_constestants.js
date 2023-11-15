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
      votes: 0 // Starting votes
    },
    {
      user_id: 42, // ID matching the user
      name: 'Kevin Rogers', 
      description: 'I used to be a sports athlete until my injury. Now I want to act.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-504123304-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=HMxbdAEUqfk', 
      votes: 0 // Starting votes
    },
    {
      user_id: 43, // ID matching the user
      name: 'Lex Bobson', 
      description: 'Hoping to make my dad proud.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-811177514-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 0 // Starting votes
    },
    {
      user_id: 44, // ID matching the user
      name: 'Angelo Markus', 
      description: 'I am an engineer, but I do love to perform. Please vote for me.', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-858449444-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=-1tLkSJNK0M', 
      votes: 0 // Starting votes
    },
    {
      user_id: 45, // ID matching the user
      name: 'Terry Corner', 
      description: 'Trying to stay active and young. Why not do this? yay! ', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-1218999241-2048x2048.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=pGKGFGKC_bA', 
      votes: 0 // Starting votes
    }
  ]);
};
