const execa = require('execa');
const inquirer = require('inquirer');
const ora = require('ora');

const spinner = ora();

const getInstalledPackages = async outdatedOnly => {
  const { stdout: result } = await execa('brew', [
    outdatedOnly ? 'outdated' : 'list'
  ]);
  return result;
};

const updateBrew = async () => {
  const { stdout: result } = await execa('brew', ['update']);
  return result;
};

module.exports.selectPackage = async options => {
  const { message, validationError, outdatedOnly, pageSize } = options;
  const scope = outdatedOnly ? 'outdated' : 'installed';

  if (outdatedOnly) {
    spinner.start(`Looking for Homebrew updates`);
    const outputFromHomebrew = await updateBrew();
    spinner.succeed(`Finished Homebrew update`);
    console.log(`${outputFromHomebrew}\n`);
  }

  spinner.start(`Retrieving ${scope} packages`);
  const installedPackages = await getInstalledPackages(outdatedOnly);
  const choices = installedPackages.length
    ? installedPackages.split('\n')
    : null;
  if (!choices) {
    spinner.fail(`Found no ${scope} package(s)`);
    process.exit(0);
  }

  spinner.succeed(`Found ${choices.length} ${scope} package(s)`);
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
