#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const execa = require('execa');
const inquirer = require('inquirer');
const ora = require('ora');
const getStream = require('get-stream');

const cli = meow(
	`
	Usage
	  $ ibrew <searchterm>

	Options
	  --help, -h      Show help
	  --version, -v   Print version number

	Example
	  $ ibrew ascii
`,
	{
		alias: {
			h: 'help',
			v: 'version'
		}
	}
);

const [searchTerm] = cli.input;
const spinner = ora('Searching for packages').start();

if (cli.input.length === 0 && cli.flags.v === true) {
	cli.showVersion();
}

if (cli.input.length === 0 && cli.flags.h === true) {
	cli.showHelp(0);
}

if (cli.input.length > 1) {
	console.log(
		`\n${logSymbols.error} Invalid input. Please check the help below:`
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
	const { stdout: result } = await execa('brew', ['search', searchTerm]);
	const choices = result.split('\n').map(choice => {
		if (choice.includes('==>')) {
			return {
				name: choice.substring(4),
				disabled: choice.includes('Formulae')
					? 'Command line packages'
					: 'GUI macOS applications'
			};
		}
		if (choice === '') {
			return new inquirer.Separator();
		}
		return choice;
	});

	choices.push(new inquirer.Separator());

	if (result) {
		spinner.succeed(
			`Found ${
				choices.filter(choice => typeof choice === 'string').length
			} packages\n`
		);
	} else {
		spinner.info(`No formula or cask found for \`${searchTerm}\`.`);
		process.exit(0);
	}

	const selected = await inquirer.prompt([
		{
			type: 'list',
			name: 'package',
			message: 'Which package you would like to install?',
			pageSize: 10,
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
