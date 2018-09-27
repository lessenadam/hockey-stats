const { MongoClient } = require('mongodb');
const _ = require('lodash');
const assert = require('assert');

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

// Connection URL
const url = 'mongodb://localhost:27017/hockey-stats';

const insertDocuments = function insertDoc(docs, db, callback) {
  // Get the documents collection
  const collection = db.collection('scores');
  // Insert some documents
  collection.insertMany(docs, (err, result) => {
    assert.equal(err, null);
    console.log(`Inserted ${result.ops.length} documents into the collection`);
    callback(result);
  });
};

function saveScores({ scores, date } = {}) {
  const splitScores = _.flatten(scores.map((score) => splitGameScore(score, date)));
  
  // Use connect method to connect to the server
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log('Connected successfully to server');
  
    insertDocuments(splitScores, db, () => {
      db.close();
    });
  });
}

module.exports = {
  saveScores,
};
