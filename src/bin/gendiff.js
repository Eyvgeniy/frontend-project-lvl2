#!/usr/bin/env node

import gendiff from '../index';

const program = require('commander');

const diff = program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstconfig> <secondconfig>')
  .option('-V, --version', 'output the version number')
  .option('-f, --format <type>', 'Output format')
  .action((firstconfig, secondconfig) =>
    console.log(gendiff(firstconfig, secondconfig, program.format)),
  );

diff.parse(process.argv);
