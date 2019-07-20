import fs from 'fs';
import { isObject } from 'lodash';

const indent = '  ';

const renderObjectValue = (value, deep) => {
  if (isObject(value)) {
    const values = Object.keys(value)
      .map(el => `  "${el}": ${renderObjectValue(value[el])}`)
      .join('\n');
    return `{\n${indent.repeat(deep + 2)}${values}\n${indent.repeat(deep + 1)}},`;
  }
  return typeof value === 'string' ? `"${value}",` : `${value},`;
};

const typeActions = [
  {
    name: 'nested',
    check: arg => arg === 'nested',
    process: (key, render, children, deep) => `${indent.repeat(deep - 1)}"${key}": {\n${render(children, deep)}\n${indent.repeat(
      deep - 1,
    )}},`,
  },
  {
    name: 'unchanged',
    check: arg => arg === 'unchanged',
    process: (key, oldValue, newValue, deep) => `${indent.repeat(deep)}"  ${key}": ${renderObjectValue(oldValue)}`,
  },
  {
    name: 'changed',
    check: arg => arg === 'changed',
    process: (key, oldValue, newValue, deep) => [
      [`${indent.repeat(deep)}"- ${key}": ${renderObjectValue(oldValue, deep)}`],
      [`${indent.repeat(deep)}"+ ${key}": ${renderObjectValue(newValue, deep)}`],
    ],
  },
  {
    name: 'deleted',
    check: arg => arg === 'deleted',
    process: (key, oldValue, newValue, deep) => `${indent.repeat(deep)}"- ${key}": ${renderObjectValue(oldValue, deep)}`,
  },
  {
    name: 'added',
    check: arg => arg === 'added',
    process: (key, oldValue, newValue, deep) => `${indent.repeat(deep)}"+ ${key}": ${renderObjectValue(newValue, deep)}`,
  },
];
const getTypeAction = arg => typeActions.find(({ check }) => check(arg));

const diff = (astDiff) => {
  const render = (ast, deep) => ast
    .map((el) => {
      const {
        key, oldValue, newValue, type, children,
      } = el;
      const { process } = getTypeAction(type);
      return children.length > 0
        ? process(key, render, children, deep + 2)
        : process(key, oldValue, newValue, deep);
    })
    .flat()
    .join('\n');
  return `{\n${render(astDiff, 0)}\n}`;
};
export default data => fs.writeFileSync('diff.json', diff(data));
