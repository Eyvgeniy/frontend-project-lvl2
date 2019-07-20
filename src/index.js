import { has, union, isObject } from 'lodash';
import parse from './parsers';
import json from './formatters/tree';
import plain from './formatters/plain';
import file from './formatters/json';

const buildAst = (first, second) => {
  const keys = union(Object.keys(first), Object.keys(second));
  const ast = keys.map((key) => {
    if (has(first, key) && has(second, key) && isObject(first[key]) && isObject(second[key])) {
      return {
        key,
        oldValue: null,
        newValue: null,
        type: 'nested',
        children: buildAst(first[key], second[key]),
      };
    }
    if (has(first, key) && has(second, key) && first[key] === second[key]) {
      return {
        key,
        oldValue: first[key],
        newValue: null,
        type: 'unchanged',
        children: [],
      };
    }
    if (has(first, key) && has(second, key) && first[key] !== second[key]) {
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
    return {
      key,
      oldValue: null,
      newValue: second[key],
      type: 'added',
      children: [],
    };
  });
  return ast;
};

const gendiff = (first, second, format) => {
  const firstFile = parse(first);
  const secondFile = parse(second);
  const ast = buildAst(firstFile, secondFile);
  switch (format) {
    case 'plain':
      return plain(ast);
    case 'json':
      return json(ast);
    case 'file':
      return file(ast);
    default:
      break;
  }
  return null;
};

export default gendiff;
