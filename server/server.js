const express = require('express');
const { getProjectionsForDay } = require('../src/get-game-projections');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/results', (req, res) => {
  const { day, month, year } = req.query;
  console.log('got the results req!');
  console.log({ day, month, year });
  getProjectionsForDay(`${month}-${day}-${year} UTC`)
    .then((projections) => {
      res.send(projections);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send('Server error');
    });
});

app.listen(process.env.PORT || 8080);
