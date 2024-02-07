const knex = require("knex")(require("../knexfile"));



// exports.castVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has already voted in the past 24 hours
//     const existingVote = await knex("votes")
//       .where({ user_id: userId })
//       .orderBy('created_at', 'desc')
//       .first();

//     if (existingVote) {
//       const lastVoteTime = new Date(existingVote.created_at);
//       const nextVoteTime = new Date(lastVoteTime.getTime() + 24 * 60 * 60 * 1000);
// console.log('nextVoteTime', nextVoteTime);
// console.log('new Date()', new Date());

//       if (nextVoteTime > new Date()) {
//         // User has already voted in the past 24 hours
//         const remainingTime = nextVoteTime.getTime() - new Date().getTime();
//         const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
//         const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

//         console.log('remainingHours', remainingHours); //showing 28, must be 24 max
//         console.log('remainingMinutes', remainingMinutes);
//         console.log('remainingTime', remainingTime);

//         return res.status(400).json({
//           error: "User can only vote once every 24 hours",
//           remainingTime: {
//             minutes: remainingMinutes,
//             hours: remainingHours,
       
//           },
//           message: `You can vote again in ${remainingHours} hours and ${remainingMinutes} minutes.`,
//         });
//       }
//     }

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));
// console.log('votesToInsert', votesToInsert);
  
//     await knex("votes").insert(votesToInsert);

//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

const moment = require('moment-timezone');
moment.tz.setDefault('America/Toronto'); // Set default time zone to Toronto

exports.castVote = async (req, res, next) => {
  try {
    const { userId, contestantId, numberOfVotes } = req.body;

    // Check if the user has already voted in the past 24 hours
    const existingVote = await knex("votes")
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .first();

    if (existingVote) {
      const lastVoteTime = moment(existingVote.created_at);
      const nextVoteTime = lastVoteTime.clone().add(24, 'hours');

      console.log('nextVoteTime', nextVoteTime.format()); // Output the next vote time in Toronto time
      console.log('Current time in Toronto', moment().format()); // Output the current time in Toronto

      if (nextVoteTime > moment()) {
        // User has already voted in the past 24 hours
        const remainingTime = nextVoteTime.diff(moment(), 'milliseconds');
        const remainingDuration = moment.duration(remainingTime);

        console.log('remainingDuration', remainingDuration);

        return res.status(400).json({
          error: "User can only vote once every 24 hours",
          remainingTime: {
            minutes: remainingDuration.minutes(),
            hours: remainingDuration.hours(),
          },
          message: `You can vote again in ${remainingDuration.hours()} hours and ${remainingDuration.minutes()} minutes.`,
        });
      }
    }

    // Insert a new vote record for each vote
    const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
      user_id: userId,
      contestant_id: contestantId,
    }));

    console.log('votesToInsert', votesToInsert);

    await knex("votes").insert(votesToInsert);

    res.status(201).json({ message: "Votes cast successfully" });
  } catch (error) {
    console.error(`Error in castVote controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error." });
  }
};
