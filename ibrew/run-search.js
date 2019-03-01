const inquirer = require('inquirer');
const ora = require('ora');

const search = require('./lib/search');
const { executeCommand } = require('./lib/execute-command');

const spinner = ora();

const runSearch = async (searchTerm, pageSize) => {
  spinner.start('Searching for packages');
  const result = await search.getSearchResults(searchTerm);
  if (!result) {
    spinner.info(`No formula or cask found for \`${searchTerm}\`.`);
    process.exit(0);
  }

  const choices = search.getInquirerChoices(result);
  spinner.succeed(
    `Found ${
      choices.filter(choice => typeof choice === 'string').length
    } packages\n`
  );
  const selected = await inquirer.prompt([
    {
      type: 'list',
      name: 'package',
      message: 'Which package you would like to install?',
      pageSize,
      choices
    }
  ]);
  executeCommand({
    command: 'install',
    packages: [selected.package],
    spinner,
    loadingMessage: `Installing \`${selected.package}\``
  });
};

exports.runSearch = runSearch;
