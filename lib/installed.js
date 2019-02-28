const execa = require('execa');
const inquirer = require('inquirer');

const getInstalledPackages = async () => {
  const { stdout: result } = await execa('brew', ['list']);
  return result;
};

module.exports.selectInstalledPackage = async options => {
  const { message, validationError, pageSize, spinner } = options;
  spinner.start(`Retrieving installed packages`);
  const installedPackages = await getInstalledPackages();
  const choices = installedPackages.split('\n');
  spinner.succeed(`Found ${choices.length} packages\n`);
  const selected = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'packages',
      message,
      pageSize,
      validate: selection => (selection.length === 0 ? validationError : true),
      choices
    }
  ]);
  return selected;
};
