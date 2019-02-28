const execa = require('execa');

module.exports.getOutput = selectedPackage => {
  execa('brew', ['install', selectedPackage]);
};
