const moment = require('moment');
const { getStats } = require('./get-stats');
const { saveScores } = require('./mongo-save-scores');
const { getDayInfo, yesterday } = require('./get-date');

function getDates(startDate, stopDate) {
  const dateArray = [];
  let currentDate = moment(startDate);
  const momentStopDate = moment(stopDate);
  while (currentDate <= momentStopDate) {
    dateArray.push(moment(currentDate));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}
// getStats takes a day and day formatted
const getScoresAndSave = ({ targetDay, targetFormattedDay } = {}) => {
  console.log('Beginning stats collection');
  return getStats(targetDay, targetFormattedDay)
    .then((statsForGames) => saveScores(statsForGames))
    .then(() => {
      console.log('saveScores completed');
      return targetFormattedDay;
    })
    .catch((err) => {
      console.log('There was some uncaught error', err);
    });
};


const getScoresForDay = (day) => {
  const momentDate = moment(day);
  return getScoresAndSave(getDayInfo(momentDate));
}

const getScoresForDayRange = (dayFrom, dayTo) => {
  
  const momentDates = getDates(new Date(dayFrom), new Date(dayTo));
  const tasks = momentDates.map((momentDate) => () => getScoresAndSave(getDayInfo(momentDate)));

  /* eslint-disable */
  return tasks.reduce((promiseChain, currentTask) => {
      return promiseChain.then((chainResults) =>
          currentTask().then((currentResult) =>
              [ ...chainResults, currentResult ]
          )
      );
  }, Promise.resolve([])).then(arrayOfResults => {
      // Do something with all results
      console.log(arrayOfResults);
  });  
}

getScoresForDayRange('Jan 10, 2018', 'Jan 12, 2018');