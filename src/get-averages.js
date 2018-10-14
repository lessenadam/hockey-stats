const { MongoClient } = require('mongodb');
const { url } = require('./db-connection');

const getLeagueAvgs = () => MongoClient.connect(url)
  .then((db) => {
    // Get the documents collection
    const collection = db.collection('scores');

    //
    // return collection.find
    return collection.aggregate([
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
      .then((results) => results[0])
      .catch((err) => console.log('err', err))
      .finally(() => db.close());
  });

const getTeamAvgs = (teamName) => MongoClient.connect(url)
  .then((db) => {
    const collection = db.collection('scores');

    return collection.aggregate([
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
      .then((results) => results[0])
      .catch((err) => console.log('err', err))
      .finally(() => db.close());
  });

const getLastN = (teamName, numberOfGames) => MongoClient.connect(url)
  .then((db) => {
    const collection = db.collection('scores');

    return collection.aggregate([
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
      .toArray()
      .then((results) => {
        const [recent] = results;
        const avgGf = (recent.gfa + recent.gfh) / numberOfGames;
        const avgGa = (recent.gaa + recent.gah) / numberOfGames;
        return { avgGf, avgGa };
      })
      .catch((err) => console.log('no', err))
      .finally(() => db.close());
  });

module.exports = {
  getLeagueAvgs,
  getTeamAvgs,
  getLastN,
};

// getLeagueAvgs();
// getTeamAvgs('San Jose Sharks');
// getLastN('San Jose Sharks', 5).then((res) => console.warn(res));
