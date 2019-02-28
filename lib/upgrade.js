const execa = require('execa');

module.exports.getOutput = packages => {
  return execa('brew', ['upgrade', ...packages]);
};
