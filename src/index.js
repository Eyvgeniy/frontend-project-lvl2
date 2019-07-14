import fs from 'fs';
import path from 'path';
import { has, union } from 'lodash';
import parse from '../src/parsers';

const typeActions = [
  {
    name: 'unchanged',
    check: function(arg) {
      return arg === 'unchanged';
    },
    process: (key, oldValue, newValue) => {
      return ` ${key}: ${oldValue}`;
    }
  },
  {
    name: 'changed',
    check: function(arg) {
      return arg === 'changed';
    },
    process: (key, oldValue, newValue) => {
      return [[`+ ${key}: ${newValue}`], [`- ${key}: ${oldValue}`]];
    }
  },
  {
    name: 'deleted',
    check: function(arg) {
      return arg === 'deleted';
    },
    process: (key, oldValue, newValue) => {
      return `- ${key}: ${oldValue}`;
    }
  },
  {
    name: 'added',
    check: function(arg) {
      return arg === 'added';
    },
    process: (key, oldValue, newValue) => {
      return `+ ${key}: ${newValue}`;
    }
  }
];
const getTypeAction = arg => typeActions.find(({ check }) => check(arg));

const gendiff = function(first, second) {
  const firstFile = parse(first);
  const secondFile = parse(second);
  const keys = union(Object.keys(firstFile), Object.keys(secondFile));
  const ast = keys.map(key => {
    if (
      has(firstFile, key) &&
      has(secondFile, key) &&
      firstFile[key] === secondFile[key]
    ) {
      return { key, oldValue: firstFile[key], newValue: '', type: 'unchanged' };
    }
    if (
      has(firstFile, key) &&
      has(secondFile, key) &&
      firstFile[key] !== secondFile[key]
    ) {
      return {
        key,
        oldValue: firstFile[key],
        newValue: secondFile[key],
        type: 'changed'
      };
    }
    if (has(firstFile, key) && !has(secondFile, key)) {
      return { key, oldValue: firstFile[key], newValue: null, type: 'deleted' };
    }
    if (!has(firstFile, key) && has(secondFile, key)) {
      return {
        key,
        oldValue: null,
        newValue: secondFile[key],
        type: 'added'
      };
    }
  });
  const render = ast => {
    return ast.map(el => {
      const { key, oldValue, newValue, type } = el;
      const { process } = getTypeAction(type);
      return process(key, oldValue, newValue);
    });
  };
  return `{\n ${render(ast)
    .flat()
    .join('\n')}\n}`;
};

export default gendiff;
