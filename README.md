# Overview

There are essentially 3 services built into this repo. 
1. Service to populate a mongodb database with a "schedule" collection that will contain all the hockey games scheduled for the 2017-2018 season.
2. Service to fetch NHL scores for a range of days, or a specfic day, and input them into a mongodb collection called "scores".
3. Service to handle incoming API requests and provide game projections for a specific date

# Getting started

Make sure to run `$ npm install` or `$ yarn install` - either works depending on your preference.

### Service 1
For service number 1, you will need to make sure that you have a running instance of mongodb. For more information, refer to https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/.
Depending on your mongo authorization, you may need to update the `config.yml` so that `db-connections.js` generates the correct access URL. The default assumes `mongodb://localhost:27017/hockey-stats`. This may work for you out of the box.

Once verifying the above, run `$ node src/populate-schedule.js` and the "schedule" will be all set up.

### Service 2
For service number 2, no additional prequisites are required besides those in number 1. You have the option of running `$ node main.js` to get all the scores from the season start to the current date; or you can change the commented lines so the `setInterval` is called and scores are feteched once a day. It is useful to run `$ nohup node main.js &` to run the process in the background.

You can run the following command from the mongo shell for example to verify that everything is working correctly `$ db['scores-2019'].find({team: "San Jose Sharks"})`

### Service 3

For service number 3, you will need to create a file in `/src` called `get-game-projections.js` that exports a function called `getProjectionsForDay`. This is the "secret sauce" and where the fun lies :wink:

After that, you can fire up `node server/server.js` which listens to request by default on port `8080` and serves the results from `getProjectionsForDay`. 

