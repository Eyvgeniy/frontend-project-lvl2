#!/usr/bin/env node
const program = require('commander');

program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstconfig> <secondconfig>')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format');

program.parse(process.argv);
