import { has, union, isObject } from 'lodash';

const buildAst = (data1, data2) => {
  const keys = union(Object.keys(data1), Object.keys(data2));
  const ast = keys.map((key) => {
    if (has(data1, key) && has(data2, key) && isObject(data1[key]) && isObject(data2[key])) {
      return { key, type: 'nested', children: buildAst(data1[key], data2[key]) };
    }
    if (has(data1, key) && has(data2, key) && data1[key] === data2[key]) {
      return { key, oldValue: data1[key], type: 'unchanged' };
    }
    if (has(data1, key) && has(data2, key) && data1[key] !== data2[key]) {
      return {
        key, oldValue: data1[key], newValue: data2[key], type: 'changed',
      };
    }
    if (has(data1, key) && !has(data2, key)) {
      return { key, oldValue: data1[key], type: 'deleted' };
    }
    return { key, newValue: data2[key], type: 'added' };
  });
  return ast;
};

export default buildAst;
