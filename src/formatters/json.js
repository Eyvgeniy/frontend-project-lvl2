import fs from 'fs';
import { isObject } from 'lodash';

const indent = '  ';

const renderObjectValue = (value, deep) => {
  if (!isObject(value)) {
    return typeof value === 'string' ? `"${value}",` : `${value},`;
  }
  const values = Object.keys(value)
    .map(el => `  "${el}": ${renderObjectValue(value[el])}`)
    .join('\n');
  return `{\n${indent.repeat(deep + 2)}${values}\n${indent.repeat(deep + 1)}},`;
};

const typeActions = {
  nested: (node, deep, render) => {
    const { key, children } = node;
    return `${indent.repeat(deep - 1)}"${key}": {\n${render(children, deep)}\n${indent.repeat(deep - 1)}},`;
  },
  unchanged: (node, deep) => {
    const { key, oldValue } = node;
    return `${indent.repeat(deep)}"  ${key}": ${renderObjectValue(oldValue)}`;
  },
  changed: (node, deep) => {
    const { key, oldValue, newValue } = node;
    return [
      [`${indent.repeat(deep)}"- ${key}": ${renderObjectValue(oldValue, deep)}`],
      [`${indent.repeat(deep)}"+ ${key}": ${renderObjectValue(newValue, deep)}`],
    ];
  },
  deleted: (node, deep) => {
    const { key, oldValue } = node;
    return `${indent.repeat(deep)}"- ${key}": ${renderObjectValue(oldValue, deep)}`;
  },
  added: (node, deep) => {
    const { key, newValue } = node;
    return `${indent.repeat(deep)}"+ ${key}": ${renderObjectValue(newValue, deep)}`;
  },
};


const diff = (astDiff) => {
  const render = (ast, deep) => ast
    .map((node) => {
      const { type } = node;
      const process = typeActions[type];
      return process(node, deep, render);
    })
    .flat()
    .join('\n');
  return `{\n${render(astDiff, 0)}\n}`;
};
export default data => fs.writeFileSync('diff.json', diff(data));
