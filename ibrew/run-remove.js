const { selectPackage } = require('./lib/installed');
const { executeCommand } = require('./lib/execute-command');

const runRemove = async pageSize => {
  const { packages } = await selectPackage({
    message: 'Which packages you would like to uninstall?',
    validationError: 'Please select at least one package to uninstall.',
    outdatedOnly: false,
    pageSize
  });
  executeCommand({
    command: 'remove',
    packages,
    loadingMessage: 'Uninstalling selected packages(s)'
  });
};

exports.runRemove = runRemove;
