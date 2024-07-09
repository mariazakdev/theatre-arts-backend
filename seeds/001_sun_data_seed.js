exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('sun_data').del();
  
    // Inserts seed entries
    await knex('sun_data').insert([
      {
        id: 1,
        title: 'Sun King Title',
        subtitle: 'Sun King Subtitle',
        content: 'This is the content for the Sun King.',
      },
    ]);
  };
  