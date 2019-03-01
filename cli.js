#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const ora = require('ora');

const { runUpgrade } = require('./ibrew/run-upgrade');
const { runRemove } = require('./ibrew/run-remove');
const { runSearch } = require('./ibrew/run-search');

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
exports.cli = cli;

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
const spinner = ora();
exports.spinner = spinner;
const defaultPageSize = {
  searchResult: 10,
  installed: 20
};
exports.defaultPageSize = defaultPageSize;

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
  runUpgrade(Number(cli.flags.size) || defaultPageSize.installed);
}

// List installed packages to remove
if (cli.flags.remove === true) {
  runRemove(Number(cli.flags.size) || defaultPageSize.installed);
}

// Search for a package to install
if (cli.flags.upgrade === false && cli.flags.remove === false) {
  runSearch(cli.input, Number(cli.flags.size) || defaultPageSize.searchResult);
}
