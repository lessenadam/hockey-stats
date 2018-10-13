const serializePromises = (arrayOfFunctions) => {
  return arrayOfFunctions
    .reduce((promiseChain, currentTask) => {
      return promiseChain.then((chainResults) =>
        currentTask().then((currentResult) => [...chainResults, currentResult])
      );
    }, Promise.resolve([]))
    .then((arrayOfResults) => {
      return arrayOfResults;
    });
};

module.exports = {
  serializePromises,
};
