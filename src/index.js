import { has, union, isObject } from 'lodash';
import parse from './parsers';
import render from './formatters/index';

const buildAst = (first, second) => {
  const keys = union(Object.keys(first), Object.keys(second));
  const ast = keys.map((key) => {
    if (has(first, key) && has(second, key) && isObject(first[key]) && isObject(second[key])) {
      return { key, type: 'nested', children: buildAst(first[key], second[key]) };
    }
    if (has(first, key) && has(second, key) && first[key] === second[key]) {
      return { key, oldValue: first[key], type: 'unchanged' };
    }
    if (has(first, key) && has(second, key) && first[key] !== second[key]) {
      return {
        key, oldValue: first[key], newValue: second[key], type: 'changed',
      };
    }
    if (has(first, key) && !has(second, key)) {
      return { key, oldValue: first[key], type: 'deleted' };
    }
    return { key, newValue: second[key], type: 'added' };
  });
  return ast;
};

const gendiff = (firstFilePath, secondFilePath, format) => {
  const firstData = parse(firstFilePath);
  const secondData = parse(secondFilePath);
  const ast = buildAst(firstData, secondData);
  return render(ast, format);
};

export default gendiff;
