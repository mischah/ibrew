module.exports = {
  help: `
  Interactive CLI for Homebrew – the missing package manager for macOS.

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
    ✔ Found 3 outdated packages

    ? Which packages you would like to upgrade? (Press <space> to select, <a> to toggle all, <i> to invert selection)
    ❯ ◯ git
      ◯ lynx
      ◯ watchman

    $ ibrew --remove
    ✔ Found 136 installed packages

    ? Which packages you would like to uninstall? (Press <space> to select, <a> to toggle all, <i> to invert selection)
    ❯ ◯ adns
      ◯ aom
      ◯ asciinema
`
};
