const { MongoClient } = require('mongodb');

// need a function for league avgs
const url = 'mongodb://localhost:27017/hockey-stats';

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
      .then((results) => {
        console.log(results[0]);
        return results[0];
      })
      .catch((err) => console.log('no', err))
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
      .then((results) => {
        console.log(results[0]);
        return results[0];
      })
      .catch((err) => console.log('no', err))
      .finally(() => db.close());
  });

module.exports = {
  getLeagueAvgs,
  getTeamAvgs,
};

// getLeagueAvgs().then((res) => console.log('res is', res));
getTeamAvgs('San Jose Sharks');