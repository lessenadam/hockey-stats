const moment = require('moment');

const yesterday = moment().add(-1, 'days');

module.exports = {
  yesterday: {
    month: yesterday.month() + 1, // month is zero indexed
    day: yesterday.date(),
    year: yesterday.year(),
  },

  yesterdayFormatted: yesterday.format('ddd MMM DD YYYY'),
};
