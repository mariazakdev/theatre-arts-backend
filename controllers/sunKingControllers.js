const knex = require('knex')(require('../knexfile'));

// Controller to get Sun King data
const getSunKingData = async () => {
  try {
    const sunKingData = await knex('sun_data').select('*');
    return sunKingData;
  } catch (error) {
    console.error('Error fetching Sun King data:', error);
    throw error;
  }
};

// Controller to update Sun King data
const updateSunKingData = async (newData) => {
  try {
    // Assuming your table is named 'sun_king_data'
    await knex('sun_data').update(newData);
  } catch (error) {
    console.error('Error updating Sun King data:', error);
    throw error;
  }
};

module.exports = {
  getSunKingData,
  updateSunKingData,
};
