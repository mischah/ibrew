const execa = require('execa');
const inquirer = require('inquirer');

module.exports.getSearchResults = async searchTerm => {
  const { stdout: result } = await execa('brew', ['search', searchTerm || '']);
  return result;
};

module.exports.getInquirerChoices = searchResults => {
  const choices = searchResults.split('\n').map(choice => {
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

  return choices;
};
