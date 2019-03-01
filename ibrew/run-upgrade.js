const { selectInstalledPackage } = require('./lib/installed');
const { executeCommand } = require('./lib/execute-command');

const runUpgrade = async pageSize => {
  const { packages } = await selectInstalledPackage({
    message: 'Which packages you would like to upgrade?',
    validationError: 'Please select at least one package to upgrade.',
    pageSize
  });
  executeCommand({
    command: 'upgrade',
    packages,
    loadingMessage: 'Upgrading selected packages(s)'
  });
};

exports.runUpgrade = runUpgrade;
