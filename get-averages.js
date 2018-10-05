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

const getHomeLastN = (teamName, numberOfGames) => MongoClient.connect(url)
  .then((db) => {
    const collection = db.collection('scores');

    return collection.aggregate([
      {
        $match: {
          team: teamName,
          gfh: { $exists: true },
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
          recentAvgGfh: { $avg: '$gfh' },
          recentAvgGah: { $avg: '$gah' },
        },
      },
    ])
      .toArray()
      .then((results) => {
        console.log(results);
        return results[0];
      })
      .catch((err) => console.log('no', err))
      .finally(() => db.close());
  });

const getAwayLastN = (teamName, numberOfGames) => MongoClient.connect(url)
  .then((db) => {
    const collection = db.collection('scores');

    return collection.aggregate([
      {
        $match: {
          team: teamName,
          gfa: { $exists: true },
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
          recentAvgGfa: { $avg: '$gfa' },
          recentAvgGaa: { $avg: '$gaa' },
        },
      },
    ])
      .toArray()
      .then((results) => {
        console.log(results);
        return results[0];
      })
      .catch((err) => console.log('no', err))
      .finally(() => db.close());
  });

module.exports = {
  getLeagueAvgs,
  getTeamAvgs,
  getHomeLastN,
  getAwayLastN,
};

// getLeagueAvgs();
// getTeamAvgs('San Jose Sharks');
getAwayLastN('San Jose Sharks', 5);
