const _ = require('lodash');
const converter = require('json-2-csv');
const fs = require('fs');

const scores = [
  {
    homeTeam: 'Washington Capitals',
    homeScore: '0',
    awayTeam: 'Anaheim Ducks',
    awayScore: '4',
  },
  {
    homeTeam: 'Detroit Red Wings',
    homeScore: '5',
    awayTeam: 'Boston Bruins',
    awayScore: '6',
  },
  {
    homeTeam: 'Vegas Golden Knights',
    homeScore: '1',
    awayTeam: 'Columbus Blue Jackets',
    awayScore: '4',
  },
  {
    homeTeam: 'Colorado Avalanche',
    homeScore: '1',
    awayTeam: 'Chicago Blackhawks',
    awayScore: '2',
  },
  {
    homeTeam: 'Carolina Hurricanes',
    homeScore: '2',
    awayTeam: 'Minnesota Wild',
    awayScore: '6',
  },
  {
    homeTeam: 'Montreal Canadiens',
    homeScore: '4',
    awayTeam: 'New Jersey Devils',
    awayScore: '6',
  },
  {
    homeTeam: 'Dallas Stars',
    homeScore: '0',
    awayTeam: 'Nashville Predators',
    awayScore: '2',
  },
  {
    homeTeam: 'Winnipeg Jets',
    homeScore: '3',
    awayTeam: 'New York Rangers',
    awayScore: '0',
  },
  {
    homeTeam: 'Florida Panthers',
    homeScore: '4',
    awayTeam: 'Tampa Bay Lightning',
    awayScore: '5',
  },
];

// [ {} -> ] [ a, b] [b, c] [a,b, b,c] [...1, ...2]

// [ [1,2], [3,4]]

function splitGameScore({
  homeTeam, homeScore, awayTeam, awayScore,
}) {
  // split home team and away team
  const homeResult = {
    team: homeTeam,
    result: {
      vs: awayTeam,
      'G For-Away': null,
      'G Against-Away': null,
      'G For-Home': homeScore,
      'G Against-Home': awayScore,
    },
  };
  const awayResult = {
    team: awayTeam,
    result: {
      vs: homeTeam,
      'G For Away': awayScore,
      'G Against Away': homeScore,
      'G For Home': null,
      'G Against Home': null,
    },
  };
  return [homeResult, awayResult];
}

const splitScores = _.flatten(scores.map(splitGameScore));

function generateCsvForGame(game) {
  const json2csvCallback = function (err, csv) {
    console.log(game.team);
    if (err) {
      console.log({ err });
    }
    // console.log(csv);
    fs.writeFile(`team-results/${game.team}.csv`, csv, 'utf8', (fileError) => {
      if (fileError) {
        console.log('Some error occured - file either not saved or corrupted file saved.', fileError);
      } else {
        console.log('It\'s saved!');
      }
    });
  };

  converter.json2csv([game.result], json2csvCallback);
}

splitScores.forEach(generateCsvForGame);

/*
{
  team
  result
}

*/
/*
  vs, g for away, g against away, g for home, g against home

  break each game
  homeTeam is Wash Capitals
  vs: @Ana
  g for away: null
  g against away: null
  g for home: homeScore
  g against home: awayScore
  */
