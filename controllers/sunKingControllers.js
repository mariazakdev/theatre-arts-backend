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
const updateSunKingData = async (updatedData) => {
  try {
    console.log('Received data:', updatedData);

    // Ensure updatedData is an object with an 'id'
    if (!updatedData || !updatedData.id) {
      throw new Error("Invalid data structure");
    }

    await knex('sun_data')
      .where({ id: updatedData.id }) 
      .update(updatedData);
  } catch (error) {
    console.error('Error updating Sun King data:', error);
    throw error;
  }
};




module.exports = {
  getSunKingData,
  updateSunKingData,
};
