const { selectInstalledPackage } = require('./lib/installed');
const { executeCommand } = require('./lib/execute-command');

const runRemove = async pageSize => {
  const { packages } = await selectInstalledPackage({
    message: 'Which packages you would like to uninstall?',
    validationError: 'Please select at least one package to uninstall.',
    pageSize
  });
  executeCommand({
    command: 'remove',
    packages,
    loadingMessage: 'Uninstalling selected packages(s)'
  });
};

exports.runRemove = runRemove;
