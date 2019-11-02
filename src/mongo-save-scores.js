const { MongoClient } = require('mongodb');
const _ = require('lodash');
const { url } = require('./db-connection');

function splitGameScore({
  homeTeam, homeScore, awayTeam, awayScore,
} = {}, date) {
  // split home team and away team
  const homeResult = {
    team: homeTeam,
    vs: awayTeam,
    gfh: +homeScore,
    gah: +awayScore,
    date: new Date(date),
  };
  const awayResult = {
    team: awayTeam,
    vs: homeTeam,
    gfa: +awayScore,
    gaa: +homeScore,
    date: new Date(date),
  };
  return [homeResult, awayResult];
}

const insertDocuments = function insertDoc(docs, db) {
  // Get the documents collection
  const collection = db.collection('scores-2019');

  // check for existence
  const targetDate = docs[0].date;

  return collection.find({ date: { $exists: true, $eq: targetDate } }).toArray()
    .then((result) => {
      if (result.length === 0) {
        return collection.insertMany(docs)
          .then((insertResult) => {
            console.log(`Inserted ${insertResult.ops.length} documents into the collection`);
            return db;
          });
      }

      return db;
    });
};

function saveScores({ scores, date } = {}) {
  if (scores.length === 0) {
    // no games for this day
    console.log(`No games for ${date}`);
    return null;
  }

  const splitScores = _.flatten(scores.map((score) => splitGameScore(score, date)));

  // Use connect method to connect to the server
  return MongoClient.connect(url)
    .then((db) => {
      console.log('Connected successfully to server');

      return insertDocuments(splitScores, db);
    })
    .then((db) => {
      console.log('Database connection closed');
      db.close();
    })
    .catch((err) => {
      console.log('Error saving scores', err);
    });
}

module.exports = {
  saveScores,
};
