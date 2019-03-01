const { selectPackage } = require('./lib/installed');
const { executeCommand } = require('./lib/execute-command');

const runUpgrade = async pageSize => {
  const { packages } = await selectPackage({
    message: 'Which packages you would like to upgrade?',
    validationError: 'Please select at least one package to upgrade.',
    outdatedOnly: true,
    pageSize
  });
  executeCommand({
    command: 'upgrade',
    packages,
    loadingMessage: 'Upgrading selected packages(s)'
  });
};

exports.runUpgrade = runUpgrade;
