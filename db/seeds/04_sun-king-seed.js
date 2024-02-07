// seed-sun-data.js
const data = [
    {
      title: 'Your Title',
      subtitle: 'Your Subtitle',
      content: 'Your Content',
    },
  ];
  
  exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('sun_data').del();
  
    // Inserts seed entries
    return knex('sun_data').insert(data);
  };
  