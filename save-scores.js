const _ = require('lodash');
const converter = require('json-2-csv');
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');

function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

function splitGameScore({
  homeTeam, homeScore, awayTeam, awayScore,
} = {}, date) {
  // split home team and away team
  const homeResult = {
    team: homeTeam,
    result: {
      VS: awayTeam,
      GFA: '',
      GAA: '',
      GFH: homeScore,
      GAH: awayScore,
      Date: date,
    },
  };
  const awayResult = {
    team: awayTeam,
    result: {
      VS: homeTeam,
      GFA: awayScore,
      GAA: homeScore,
      GFH: '',
      GAH: '',
      Date: date,
    },
  };
  return [homeResult, awayResult];
}

function getJson2CsvCallback(filePath) {
  return function json2csvCallback(err, csv) {
    if (err) {
      console.log({ err });
    }
    // console.log(csv);
    fs.writeFile(filePath, csv, 'utf8', (fileError) => {
      if (fileError) {
        console.log(
          'Some error occured - file either not saved or corrupted file saved.',
          fileError,
        );
      } else {
        console.log("It's saved!");
      }
    });
  };
}

function getAvgRow(games) {
  const totals = games.reduce(
    (acc, game) => {
      acc.GFA += +game.GFA || 0;
      acc.GAA += +game.GAA || 0;
      acc.GFH += +game.GFH || 0;
      acc.GAH += +game.GAH || 0;
      if (game.GFA !== '') {
        acc.awayGames += 1;
      } else {
        acc.homeGames += 1;
      }
      return acc;
    },
    {
      GFA: 0,
      GAA: 0,
      GFH: 0,
      GAH: 0,
      homeGames: 0,
      awayGames: 0,
    },
  );

  return {
    VS: 'AVERAGES',
    GFA: totals.awayGames > 0 ? round(totals.GFA / totals.awayGames, 5) : null,
    GAA: totals.awayGames > 0 ? round(totals.GAA / totals.awayGames, 5) : null,
    GFH: totals.homeGames > 0 ? round(totals.GFH / totals.homeGames, 5) : null,
    GAH: totals.homeGames > 0 ? round(totals.GAH / totals.homeGames, 5) : null,
    Date: null,
  };
}

function generateFileInputs(filePath, result) {
  let games;
  if (fs.existsSync(filePath)) {
    // Do something
    games = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
    games[games.length - 1] = result;
  } else {
    games = [result];
  }

  games.push(getAvgRow(games));

  return games;
}

function generateCsvForGame(game) {
  const path = `team-results/${game.team}.csv`;
  const games = generateFileInputs(path, game.result);
  const json2csvCallback = getJson2CsvCallback(path);

  converter.json2csv(games, json2csvCallback);
}


function saveScores({ scores, date } = {}) {
  const splitScores = _.flatten(scores.map((score) => splitGameScore(score, date)));
  splitScores.forEach(generateCsvForGame);
}

module.exports = {
  saveScores,
};
