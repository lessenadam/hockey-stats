const moment = require('moment');

const yesterday = moment().add(-1, 'days');

module.exports = {
  yesterday,

  getDayInfo(momentDay) {
    return {
      targetDay: {
        month: momentDay.month() + 1, // month is zero indexed
        day: momentDay.date(),
        year: momentDay.year(),
      },
      targetFormattedDay: momentDay.format('ddd MMM DD YYYY'),
    };
  },
};
