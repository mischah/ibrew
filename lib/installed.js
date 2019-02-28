const execa = require('execa');

module.exports.getInstalledPackages = async () => {
  const { stdout: result } = await execa('brew', ['list']);
  return result;
};
