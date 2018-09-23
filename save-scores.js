const _ = require('lodash');
const converter = require('json-2-csv');
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');

const { scores, date } = {
  scores: [
    {
      homeTeam: 'Washington Capitals',
      homeScore: '0',
      awayTeam: 'Anaheim Ducks',
      awayScore: '3',
    },
    {
      homeTeam: 'Detroit Red Wings',
      homeScore: '1',
      awayTeam: 'Boston Bruins',
      awayScore: '10',
    },
    {
      homeTeam: 'Vegas Golden Knights',
      homeScore: '3',
      awayTeam: 'Columbus Blue Jackets',
      awayScore: '2',
    },
    {
      homeTeam: 'Colorado Avalanche',
      homeScore: '5',
      awayTeam: 'Chicago Blackhawks',
      awayScore: '6',
    },
    {
      homeTeam: 'Carolina Hurricanes',
      homeScore: '7',
      awayTeam: 'Minnesota Wild',
      awayScore: '1',
    },
    {
      homeTeam: 'Montreal Canadiens',
      homeScore: '0',
      awayTeam: 'New Jersey Devils',
      awayScore: '1',
    },
    {
      homeTeam: 'Dallas Stars',
      homeScore: '0',
      awayTeam: 'Nashville Predators',
      awayScore: '5',
    },
    {
      homeTeam: 'Winnipeg Jets',
      homeScore: '0',
      awayTeam: 'New York Rangers',
      awayScore: '1',
    },
    {
      homeTeam: 'Florida Panthers',
      homeScore: '2',
      awayTeam: 'Tampa Bay Lightning',
      awayScore: '2',
    },
  ],
  date: 'Sat Sep 22 2018',
};

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function splitGameScore({ homeTeam, homeScore, awayTeam, awayScore }) {
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

const splitScores = _.flatten(scores.map(splitGameScore));

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
          fileError
        );
      } else {
        console.log("It's saved!");
      }
    });
  };
}

const mockGames = [
  {
      VS: 'foo',
      GFA: 3,
      GAA: 1,
      GFH: '',
      GAH: '',
      Date: 'bar',
    },
    {
      VS: 'foo',
      GFA: 7,
      GAA: 2,
      GFH: '',
      GAH: '',
      Date: date,
    },
    {
      VS: 'foo',
      GFA: 1,
      GAA: 2,
      GFH: '',
      GAH: '',
      Date: date,
    },
]

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
    }
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

splitScores.forEach(generateCsvForGame);
