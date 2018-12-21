const { MongoClient } = require('mongodb');
const { url } = require('./db-connection');

function getStreak(games) {
  // array of games, use reduce to get streak

  // game will have either .gfa and .gaa or .gfh and .gah
  // if .gfa > .gaa or .gfh > .gah then its a win, other wise it's a loss
  const streakInfo = games.reduce((streak, game) => {
    let type;
    if ((game.gfh && game.gfh > game.gfa) || (game.gfa && game.gfa > game.gaa)) {
      type = 'W';
    } else {
      type = 'L';
    }

    if (streak.type === null || streak.type === type) {
      return {
        type,
        count: streak.count + 1,
      };
    }
    return streak;
  }, { type: null, count: 0 });

  return `${streakInfo.count}${streakInfo.type}`;
}

const getLeagueAvgs = () => MongoClient.connect(url).then((db) => {
  // Get the documents collection
  const collection = db.collection('scores');

  //
  // return collection.find
  return collection
    .aggregate([
      {
        $group: {
          _id: null,
          avgGfa: { $avg: '$gfa' },
          avgGaa: { $avg: '$gaa' },
          avgGfh: { $avg: '$gfh' },
          avgGah: { $avg: '$gah' },
        },
      },
    ])
    .toArray()
    .then((results) => {
      db.close();
      return results[0];
    })
    .catch((err) => {
      db.close();
      console.log('err', err);
    });
});

const getTeamAvgs = (teamName) => MongoClient.connect(url).then((db) => {
  const collection = db.collection('scores');

  return collection
    .aggregate([
      {
        $match: {
          team: teamName,
        },
      },
      {
        $group: {
          _id: null,
          avgGfa: { $avg: '$gfa' },
          avgGaa: { $avg: '$gaa' },
          avgGfh: { $avg: '$gfh' },
          avgGah: { $avg: '$gah' },
        },
      },
    ])
    .toArray()
    .then((results) => {
      db.close();
      return results[0];
    })
    .catch((err) => {
      db.close();
      console.log('err', err);
    });
});

const getLastN = (teamName, numberOfGames) => MongoClient.connect(url).then((db) => {
  const collection = db.collection('scores');

  const avgPromise = collection
    .aggregate([
      {
        $match: {
          team: teamName,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: numberOfGames,
      },
      {
        $group: {
          _id: null,
          gfa: { $sum: '$gfa' },
          gaa: { $sum: '$gaa' },
          gfh: { $sum: '$gfh' },
          gah: { $sum: '$gah' },
        },
      },
    ])
    .toArray();

  const gamesPromise = collection
    .aggregate([
      {
        $match: {
          team: teamName,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: numberOfGames,
      },
    ])
    .toArray();

  return Promise.all([avgPromise, gamesPromise])
    .then((results) => {
      const [avgResults, games] = results;
      const streak = getStreak(games);
      const [recent] = avgResults;
      const avgGf = (recent.gfa + recent.gfh) / numberOfGames;
      const avgGa = (recent.gaa + recent.gah) / numberOfGames;
      db.close();
      return { avgGf, avgGa, streak };
    })
    .catch((err) => {
      db.close();
      console.log('err', err);
    });
});

module.exports = {
  getLeagueAvgs,
  getTeamAvgs,
  getLastN,
};

// getLeagueAvgs();
// getTeamAvgs('San Jose Sharks');
// getLastN('San Jose Sharks', 5).then((res) => console.warn(res));
