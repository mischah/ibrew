[![npm version](https://img.shields.io/npm/v/ibrew.svg?style=flat)](https://www.npmjs.org/package/ibrew)
[![Build Status](https://travis-ci.org/mischah/ibrew.svg?branch=master)](https://travis-ci.org/mischah/ibrew)
[![Coverage Status](https://coveralls.io/repos/github/mischah/ibrew/badge.svg?branch=master)](https://coveralls.io/github/mischah/ibrew?branch=master)
[![devDependency Status](https://david-dm.org/mischah/ibrew/dev-status.svg)](https://david-dm.org/mischah/ibrew#info=devDependencies)
[![Dependency Status](https://david-dm.org/mischah/ibrew/status.svg)](https://david-dm.org/mischah/ibrew#info=Dependencies)

# ibrew 🍻

> Interactive CLI for Homebrew – the missing package manager for macOS.

`ibrew` lets you use [Homebrew](https://brew.sh/) in a different way:

- Browse Homebrew search results and choose a package to install.
- Browse installed packages and select the ones you’d like to upgrade.

<br>
<p align="center">
  <a href="https://asciinema.org/a/229587">
    <img alt="Demo animation" width="700" src="https://gitcdn.xyz/cdn/mischah/ibrew/19be4c127197f92ff6c4b24c746d6d08ceabd7c7/demo.svg" />
    </a>
</p>

## Install

Get it with **npm**:

```sh
npm install -g ibrew
```

## Usage

```shell
$ ibrew [searchterm] [options]

  Options
    --upgrade, -u   Lists installed packages to choose the ones to upgrade
    --size, -s      Set number of lines for interactive list
    --help, -h      Show help
    --version, -v   Print version number

  Examples
    $ ibrew say
    ✔ Found 2 packages

    ? Which package you would like to install? (Use arrow keys)
    ❯ cowsay
      ponysay

    $ ibrew --upgrade
    Found 137 packages

    ? Which packages you would like to upgrade? (Press <space> to select, <a> to toggle all)
    ❯ ◯ adns
      ◯ aom
      ◯ asciinema
```

## Requirements

- macOS
- [Homebrew](https://brew.sh)
- Node.js

## Related

Awesome interactive CLI apps:

- [itunes-remote](https://github.com/mischah/itunes-remote) – Control iTunes via CLI :notes:
- [ntl](https://github.com/ruyadorno/ntl) – Interactive cli menu to list/run npm tasks
- [itrash](https://github.com/ruyadorno/itrash) – Interactively selects files to delete from current folder in the CLI
- [ipt](https://github.com/ruyadorno/ipt) – Interactive Pipe To: The Node.js cli interactive workflow


## License

[MIT](LICENSE) © 2019 [Michael Kühnel](http://michael-kuehnel.de)
