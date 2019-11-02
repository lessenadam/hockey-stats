const { MongoClient } = require('mongodb');
const assert = require('assert');
const csvToJson = require('convert-csv-to-json');
const { url } = require('./db-connection');

const insertDocuments = function insertDoc(docs, db, callback) {
  // Get the documents collection
  const collection = db.collection('schedule');
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
  const filePath = 'data/2019_2020_NHL_Schedule.csv';
  const games = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath).map((game) => ({
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
