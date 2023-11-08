exports.seed = async function(knex) {
  // Deletes ALL existing entries in `contestants` table
  await knex('contestants').del();

  // Inserts seed entries
  await knex('contestants').insert([
    {
      user_id: 41, // ID matching the user
      name: 'Contestant Name', 
      description: 'A brief description of Contestant 1', 
      url_photo: 'https://monologue-avatars.s3.us-east-2.amazonaws.com/356192230_1332158854324356_3428681088308755550_n.jpg', // S3 URL
      url_video: 'https://www.youtube.com/watch?v=WB9UTNsVetw', 
      votes: 0 // Starting votes
    }
  ]);
};
