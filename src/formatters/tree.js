import { isObject } from 'lodash';

const indent = '  ';

const renderObjectValue = (value, deep) => {
  if (!isObject(value)) {
    return `${value}`;
  }
  const values = Object.keys(value)
    .map(el => `  ${el}: ${value[el]}`)
    .join('\n');
  return `{\n${indent.repeat(deep + 2)}${values}\n${indent.repeat(deep + 1)}}`;
};

const typeActions = {
  nested: (key, render, children, deep) => `${indent.repeat(deep - 1)}${key}: {\n${render(children, deep)}\n${indent.repeat(deep - 1)}}`,
  unchanged: (key, oldValue, newValue, deep) => `${indent.repeat(deep)}  ${key}: ${oldValue}`,
  changed: (key, oldValue, newValue, deep) => [
    [`${indent.repeat(deep)}- ${key}: ${renderObjectValue(oldValue, deep)}`],
    [`${indent.repeat(deep)}+ ${key}: ${renderObjectValue(newValue, deep)}`],
  ],
  deleted: (key, oldValue, newValue, deep) => `${indent.repeat(deep)}- ${key}: ${renderObjectValue(oldValue, deep)}`,
  added: (key, oldValue, newValue, deep) => `${indent.repeat(deep)}+ ${key}: ${renderObjectValue(newValue, deep)}`,
};

const diff = (astDiff) => {
  const render = (ast, deep) => ast
    .map((el) => {
      const {
        key, oldValue, newValue, type, children,
      } = el;
      const process = typeActions[type];
      return type === 'nested'
        ? process(key, render, children, deep + 2)
        : process(key, oldValue, newValue, deep);
    })
    .flat()
    .join('\n');
  return `{\n${render(astDiff, 0)}\n}`;
};

export default diff;
