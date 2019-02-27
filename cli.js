#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const execa = require('execa');
const inquirer = require('inquirer');
const ora = require('ora');
const getStream = require('get-stream');

const search = require('./lib/search');

const cli = meow(
  `
  Usage
    $ ibrew [searchterm]

  Options
    --size, -s      Set number of lines for interactive list (default: 8)
    --help, -h      Show help
    --version, -v   Print version number

  Example
    $ ibrew say
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
      }
    }
  }
);

const [searchTerm] = cli.input;
const spinner = ora('Searching for packages');

if (cli.input.length === 0 && cli.flags.v === true) {
  cli.showVersion();
}

if (cli.input.length === 0 && cli.flags.h === true) {
  cli.showHelp(0);
}

if (cli.input.length > 1) {
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

(async () => {
  spinner.start();
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
      pageSize: Number(cli.flags.size) || 8,
      choices
    }
  ]);

  spinner.start(`Installing \`${selected.package}\``);
  const stream = execa('brew', ['install', selected.package]);

  stream.stdout.on('data', data => {
    spinner.stop();
    console.log(data.toString().trim());
  });

  getStream(stream.stderr).then(stderr => {
    spinner.stop();
    console.log(stderr && `${logSymbols.warning} ${stderr.trim()}`);
  });
})();
