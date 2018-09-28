const { MongoClient } = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/hockey-stats';

// Use connect method to connect to the Server
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log('Connected correctly to server');

  const col = db.collection('scores');

  col.aggregate([
    {
      $match: {},
    },
    {
      $group:
        {
          _id: null,
          averageGfa: {
            $avg: '$gfa',
          },
          averageGaa: {
            $avg: '$gaa',
          },
          averageGfh: {
            $avg: '$gfh',
          },
          averageGah: {
            $avg: '$gah',
          },
        },
    },
  ]).toArray((err, docs) => {
    assert.equal(null, err);
    console.log(docs);
    db.close();
  });
});
