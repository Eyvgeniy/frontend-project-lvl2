#!/usr/bin/env node
const program = require('commander');

const diff = program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstconfig> <secondconfig>')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format')
  .action(function(firstconfig, secondconfig) {
    console.log(`${firstconfig} - 1, ${secondconfig} -2`);
  });

export default diff.parse(process.argv);
