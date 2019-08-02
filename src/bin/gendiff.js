#!/usr/bin/env node

import program from 'commander';
import gendiff from '..';

program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstconfig> <secondconfig>')
  .option('-V, --version', 'output the version number')
  .option('-f, --format <type>', 'Output format')
  .action((firstconfig, secondconfig) => {
    console.log(gendiff(firstconfig, secondconfig, program.format));
  });
program.parse(process.argv);
