const execa = require('execa');

module.exports.getOutput = packages => {
  return execa('brew', ['remove', ...packages]);
};
