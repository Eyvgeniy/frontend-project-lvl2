import fs from 'fs';
import path from 'path';
import {
  has,
  union,
  isObject,
} from 'lodash';
import parse from './parsers';

const indent = '  ';

const renderObjectValue = (value, deep) => {
  if (isObject(value)) {
    const values = Object.keys(value).map(el => `  ${el}: ${value[el]}`).join('\n');
    return `{\n${indent.repeat(deep+2)}${values}\n${indent.repeat(deep+1)}}`;
  }
  return `${value}`;
};

const typeActions = [{
    name: 'nested',
    check: arg => arg === 'nested',
    process: (key, render, children, deep) => `${indent.repeat(deep-1)}${key}: {\n${render(children, deep)}\n${indent.repeat(deep-1)}}`,
  },
  {
    name: 'unchanged',
    check: arg => arg === 'unchanged',
    process: (key, oldValue, newValue, deep) => `${indent.repeat(deep)}  ${key}: ${oldValue}`,
  },
  {
    name: 'changed',
    check: function (arg) {
      return arg === 'changed';
    },
    process: (key, oldValue, newValue, deep) => {
      return [
        [`${indent.repeat(deep)}- ${key}: ${renderObjectValue(oldValue, deep)}`],
        [`${indent.repeat(deep)}+ ${key}: ${renderObjectValue(newValue, deep)}`],
      ];
    }
  },
  {
    name: 'deleted',
    check: function (arg) {
      return arg === 'deleted';
    },
    process: (key, oldValue, newValue, deep) => {
      return `${indent.repeat(deep)}- ${key}: ${renderObjectValue(oldValue, deep)}`;
    }
  },
  {
    name: 'added',
    check: function (arg) {
      return arg === 'added';
    },
    process: (key, oldValue, newValue, deep) => {
      return `${indent.repeat(deep)}+ ${key}: ${renderObjectValue(newValue, deep)}`;
    }
  }
];
const getTypeAction = arg => typeActions.find(({
  check
}) => check(arg));

const buildAst = (first, second) => {
  const keys = union(Object.keys(first), Object.keys(second));
  const ast = keys.map((key) => {
    if (
      has(first, key) &&
      has(second, key) &&
      isObject(first[key]) && isObject(second[key])
    ) {
      return {
        key,
        oldValue: null,
        newValue: null,
        type: 'nested',
        children: buildAst(first[key], second[key]),
      };
    }
    if (
      has(first, key) &&
      has(second, key) &&
      first[key] === second[key]
    ) {
      return {
        key,
        oldValue: first[key],
        newValue: null,
        type: 'unchanged',
        children: [],
      };
    }
    if (
      has(first, key) &&
      has(second, key) &&
      first[key] !== second[key]
    ) {
      return {
        key,
        oldValue: first[key],
        newValue: second[key],
        type: 'changed',
        children: [],
      };
    }
    if (has(first, key) && !has(second, key)) {
      return {
        key,
        oldValue: first[key],
        newValue: null,
        type: 'deleted',
        children: [],
      };
    }
    if (!has(first, key) && has(second, key)) {
      return {
        key,
        oldValue: null,
        newValue: second[key],
        type: 'added',
        children: [],
      };
    }
  });
  return ast;
};

const gendiff = (first, second) => {
  const firstFile = parse(first);
  const secondFile = parse(second);
  const ast = buildAst(firstFile, secondFile);
  const render = (astDiff, deep) => {
    console.log(deep);
    return astDiff.map((el) => {
      const {
        key,
        oldValue,
        newValue,
        type,
        children,
      } = el;
      const {
        process,
      } = getTypeAction(type);
      return children.length > 0 ? process(key, render, children, deep + 2) : process(key, oldValue, newValue, deep);
    }).flat().join('\n');
  };
  console.log(render(ast, 0));

  return `{\n${render(ast, 0)}\n}`;
};

export default gendiff;