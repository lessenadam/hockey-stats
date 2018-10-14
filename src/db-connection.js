const yaml = require('js-yaml');
const fs = require('fs');

const { mongodb } = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
const {
  host, port, username, pwd, authDb,
} = mongodb;
const authString = username ? `${username}:${pwd}@` : '';
const authParams = authDb ? `?authSource=${authDb}` : '';
const url = `mongodb://${authString}${host}:${port}/hockey-stats${authParams}`;

module.exports = { url };
