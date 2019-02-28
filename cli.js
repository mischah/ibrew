#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const inquirer = require('inquirer');
const ora = require('ora');
const getStream = require('get-stream');

const search = require('./lib/search');
const install = require('./lib/install');
const installed = require('./lib/installed');
const upgrade = require('./lib/upgrade');
const remove = require('./lib/remove');

const cli = meow(
  `
  Usage
    $ ibrew [searchterm] [options]

  Options
    --upgrade, -u   Lists installed packages to choose the ones to upgrade
    --remove, -r   Lists installed packages to choose the ones to uninstall
    --size, -s      Set number of lines for the interactive lists
    --help, -h      Show help
    --version, -v   Print version number

  Examples
    $ ibrew say
    ✔ Found 2 packages

    ? Which package you would like to install? (Use arrow keys)
    ❯ cowsay
      ponysay

    $ ibrew --upgrade
    ✔ Found 137 packages

    ? Which packages you would like to upgrade? (Press <space> to select, <a> to toggle all, <i> to invert selection)
    ❯ ◯ adns
      ◯ aom
      ◯ asciinema

    $ ibrew --remove
    ✔ Found 137 packages

    ? Which packages you would like to uninstall? (Press <space> to select, <a> to toggle all, <i> to invert selection)
    ❯ ◯ adns
      ◯ aom
      ◯ asciinema
`,
  {
    alias: {
      h: 'help',
      v: 'version'
    },
    flags: {
      size: {
        type: 'string',
        alias: 's'
      },
      upgrade: {
        type: 'boolean',
        alias: 'u'
      },
      remove: {
        type: 'boolean',
        alias: 'r'
      }
    }
  }
);

const allowedFlags = [
  'upgrade',
  'u',
  'remove',
  'r',
  'size',
  's',
  'help',
  'h',
  'version',
  'v'
];
const [searchTerm] = cli.input;
const spinner = ora();
const defaultPageSize = {
  searchResult: 10,
  installed: 20
};

if (cli.input.length === 0 && cli.flags.v === true) {
  cli.showVersion();
}

if (cli.input.length === 0 && cli.flags.h === true) {
  cli.showHelp(0);
}

if (
  cli.input.length > 1 ||
  (cli.input.length !== 0 && cli.flags.upgrade === true) ||
  !Object.keys(cli.flags).every(flag => allowedFlags.includes(flag))
) {
  console.log(
    `${logSymbols.error} Invalid input. Please check the help below:`
  );
  cli.showHelp();
}

// Exits program execution on ESC
process.stdin.on('keypress', (ch, key) => {
  if (key && key.name === 'escape') {
    process.exit(0);
  }
});

// List installed packages to upgrade
if (cli.flags.upgrade === true) {
  (async () => {
    const selected = await installed.selectInstalledPackage({
      message: 'Which packages you would like to upgrade?',
      validationError: 'Please select at least one package to upgrade.',
      pageSize: Number(cli.flags.size) || defaultPageSize.installed,
      spinner
    });

    spinner.start(`Upgrading selected packages(s)`);
    const stream = upgrade.getOutput(selected.packages);
    stream.stdout.on('data', data => {
      spinner.stop();
      console.log(data.toString().trim());
    });
    stream.stderr.on('data', data => {
      spinner.stop();
      console.log(
        data.toString() &&
          data
            .toString()
            .trim()
            .replace(/Error/gm, `${logSymbols.error} Error`)
      );
    });
  })();
}

// List installed packages to remove
if (cli.flags.remove === true) {
  (async () => {
    const selected = await installed.selectInstalledPackage({
      message: 'Which packages you would like to uninstall?',
      validationError: 'Please select at least one package to uninstall.',
      pageSize: Number(cli.flags.size) || defaultPageSize.installed,
      spinner
    });

    spinner.start(`Uninstalling selected packages(s)`);
    const stream = remove.getOutput(selected.packages);
    stream.stdout.on('data', data => {
      spinner.stop();
      console.log(data.toString().trim());
    });
    stream.stderr.on('data', data => {
      spinner.stop();
      console.log(
        data.toString() &&
          data
            .toString()
            .trim()
            .replace(/Error/gm, `${logSymbols.error} Error`)
      );
    });
  })();
}

// Search for a package to install
if (cli.flags.upgrade === false && cli.flags.remove === false) {
  (async () => {
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
        name: 'packages',
        message: 'Which package you would like to install?',
        pageSize: Number(cli.flags.size) || defaultPageSize.searchResult,
        choices
      }
    ]);

    console.log('selection =', selected.packages);

    spinner.start(`Installing \`${selected.package}\``);
    const stream = install.getOutput(selected.package);

    stream.stdout.on('data', data => {
      spinner.stop();
      console.log(data.toString().trim());
    });

    getStream(stream.stderr).then(stderr => {
      spinner.stop();
      console.log(stderr && `${logSymbols.warning} ${stderr.trim()}`);
    });
  })();
}
