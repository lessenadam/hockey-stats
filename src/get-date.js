const moment = require('moment');

module.exports = {
  getYesterday() {
    return moment().add(-1, 'days');
  },

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
