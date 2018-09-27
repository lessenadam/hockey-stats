const { getStats } = require('./get-stats');
const { saveScores } = require('./mongo-save-scores');

const day = { day: 17, month: 3, year: 2018 };
const formattedDay = 'Fri Mar 17 2018';

// getStats takes a day and day formatted
getStats(day, formattedDay).then((statsForGames) => {
  // pass res to saveScores
  saveScores(statsForGames);
});
