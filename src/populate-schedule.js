const { MongoClient } = require('mongodb');
const assert = require('assert');
const csvToJson = require('convert-csv-to-json');
const { url } = require('./db-connection');
const { SCHEDULE_COLLECTION, SCHEDULE_FILE_PATH } = require('../utils/constants');

const insertDocuments = function insertDoc(docs, db, callback) {
  // Get the documents collection
  const collection = db.collection(SCHEDULE_COLLECTION);
  // Insert some documents
  collection.insertMany(docs, (err, result) => {
    assert.equal(err, null);
    console.log(`Inserted ${result.ops.length} documents into the collection`);
    callback(result);
  });
};

function saveSchedule() {
  // read in the csv
  // convert it to the documents we want to save to the db
  // date, homeTeam, awayTeam (Date, Visitor, Home)
  const games = csvToJson.fieldDelimiter(',').getJsonFromCsv(SCHEDULE_FILE_PATH).map((game) => ({
    date: new Date(game.Date),
    awayTeam: game.Visitor,
    homeTeam: game.Home,
  }));

  // Use connect method to connect to the server
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    insertDocuments(games, db, () => {
      db.close();
    });
  });
}

module.exports = {
  saveSchedule,
};

saveSchedule();
