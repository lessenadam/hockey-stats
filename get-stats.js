const puppeteer = require('puppeteer');
const yesterday = require('./get-date.js');

async function run({ month = 3, day = 6, year = 2018 } = {}) {
  const url = `https://www.hockey-reference.com/boxscores/index.fcgi?month=${month}&day=${day}&year=${year}`;
  console.log('target url', url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  } catch (err) {
    await browser.close();
    throw err;
  }

  //
  // if the url redirects, it means there weren't any games for that day
  //
  console.log(page.url());
  if (page.url() === url) {
    const data = await page.evaluate(() => {
      const games = Array.from(document.querySelectorAll('.game_summary'));
      const HOME_TEAM = '.teams tbody tr:nth-of-type(1) td:nth-of-type(1) a';
      const HOME_SCORE = '.teams tbody tr:nth-of-type(1) td:nth-of-type(2)';
      const AWAY_TEAM = '.teams tbody tr:nth-of-type(2) td:nth-of-type(1) a';
      const AWAY_SCORE = '.teams tbody tr:nth-of-type(2) td:nth-of-type(2)';
      return games.map((game) => ({
        homeTeam: game.querySelector(HOME_TEAM).innerText.trim(),
        homeScore: game.querySelector(HOME_SCORE).innerText.trim(),
        awayTeam: game.querySelector(AWAY_TEAM).innerText.trim(),
        awayScore: game.querySelector(AWAY_SCORE).innerText.trim(),
      }));
    });
    console.log(data);
  } else {
    console.log('no games for date', { month, day, year });
  }

  await browser.close();
}

run()
  .then(() => console.warn('success'))
  .catch((err) => console.warn('Error:', err));
