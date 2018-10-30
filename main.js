const moment = require('moment');
const { getStats } = require('./src/get-stats');
const { saveScores } = require('./src/mongo-save-scores');
const { getDayInfo, getYesterday } = require('./src/get-date');
const { serializePromises } = require('./utils/utils');

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
};

const getScoresForDayRange = (dayFrom, dayTo) => {
  const momentDates = getDates(new Date(dayFrom), new Date(dayTo));
  const tasks = momentDates.map((momentDate) => () => getScoresAndSave(getDayInfo(momentDate)));

  /* eslint-disable */
  return serializePromises(tasks)
    .then(arrayOfResults => {
        // Do something with all results
        console.log(arrayOfResults);
    });
}

const seasonStart = 'Oct 3, 2018'
const today = moment().format('MMM DD, YYYY');

// getScoresForDayRange(seasonStart, today);
getScoresForDay(getYesterday())
const msPerDay = 1000 * 60 * 60 * 24;
// const oneMinute = 1000 * 60;
setInterval(() => getScoresForDay(getYesterday()), msPerDay);
