const execa = require('execa');
const semver = require('semver');

const path = require('path');

const cli = path.join(__dirname, '../', 'cli.js');
const fixtures = require('./__fixtures__/fixtures');
const { wait } = require('./test-helpers');

describe('Prints a valid version number', () => {
  test('when using `--version` flag', async () => {
    const { stdout } = await execa(cli, ['--version']);
    expect(semver.valid(stdout)).not.toBeNull();
    expect(semver.gt(stdout, '0.1.0')).toBe(true);
  });

  test('when using `-v` alias', async () => {
    const { stdout } = await execa(cli, ['-v']);
    expect(semver.valid(stdout)).not.toBeNull();
    expect(semver.gt(stdout, '0.1.0')).toBe(true);
  });
});

describe('Shows help', () => {
  test('when using `--help` flag', async () => {
    const { stdout } = await execa(cli, ['--help']);
    expect(stdout).toBe(fixtures.help);
  });

  test('when using `-h` alias', async () => {
    const { stdout } = await execa(cli, ['-h']);
    expect(stdout).toBe(fixtures.help);
  });
});

describe('Prints error messages', () => {
  test('when entering multiple search terms', async () => {
    await expect(execa(cli, ['yarn', 'npm'])).rejects.toThrow(
      /Invalid input. Please check the help below:/
    );
  });

  test('when no package is found', async () => {
    const { stderr } = await execa(cli, ['hahaha']);
    expect(stderr).toMatch(/No formula or cask found for `hahaha`/);
  });
});

describe('Inquirer search results list', async () => {
  let response;

  beforeAll(async () => {
    const stream = execa(cli, ['davmail']);

    stream.stdout.on('data', data => {
      response = response + data.toString().trim();
      stream.stdout.destroy();
    });

    await wait(10);
    response = response.split('\n');
  });

  test('asks the correct question', () => {
    expect(response[0]).toMatch('Which package you would like to install?');
  });

  test('has correctly labeled disabled items', () => {
    expect(response.find(line => line.includes('- Formulae'))).toMatch(
      '- Formulae (Command line packages)'
    );
    expect(response.find(line => line.includes('- Casks'))).toMatch(
      '- Casks (GUI macOS applications)'
    );
  });

  test('has selects a package', () => {
    expect(response.find(line => line.includes('davmail'))).toMatch(
      '❯ davmail'
    );
  });

  test('has separators', () => {
    expect(response.find(line => line.includes('──────────────'))).toMatch(
      '──────────────'
    );
  });
});

describe('Inquirer installed packages list', async () => {
  let response;

  beforeAll(async () => {
    const stream = execa(cli, ['--upgrade']);

    stream.stdout.on('data', data => {
      response = response + data.toString().trim();
      stream.stdout.destroy();
    });

    await wait(5);
    response = response.split('\n');
  });

  test('asks the correct question', () => {
    expect(response[0]).toMatch('Which packages you would like to upgrade?');
  });

  test('renders installed packages as checkbox', () => {
    expect(response.find(line => line.includes('cowsay'))).toMatch('◯ cowsay');
  });
});
