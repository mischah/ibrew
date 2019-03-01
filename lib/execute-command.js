const execa = require('execa');
const logSymbols = require('log-symbols');

const getOutput = (command, packages) => {
  return execa('brew', [command, ...packages]);
};

module.exports.executeCommand = options => {
  const { command, packages, spinner, loadingMessage } = options;
  spinner.start(loadingMessage);
  const stream = getOutput(command, packages);
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
          .replace(/Warning/gm, `${logSymbols.warning} Warning`)
    );
  });
};
