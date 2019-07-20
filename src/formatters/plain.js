import { isObject } from 'lodash';

const renderObjectValue = value =>
  isObject(value) ? '[complex value]' : `${value}`;

const typeActions = [
  {
    name: 'nested',
    check: arg => arg === 'nested',
    process: (render, children, acc) => render(children, acc)
  },
  {
    name: 'unchanged',
    check: arg => arg === 'unchanged',
    process: (key, oldValue, newValue, acc) =>
      `Property '${acc}${key}' was not changed`
  },
  {
    name: 'changed',
    check: arg => arg === 'changed',
    process: (key, oldValue, newValue, acc) =>
      `Property '${acc}${key}' was updated. From '${renderObjectValue(
        oldValue
      )}' to '${renderObjectValue(newValue)}'`
  },
  {
    name: 'deleted',
    check: arg => arg === 'deleted',
    process: (key, oldValue, newValue, acc) =>
      `Property '${acc}${key}' was removed`
  },
  {
    name: 'added',
    check: arg => arg === 'added',
    process: (key, oldValue, newValue, acc) =>
      `Property '${acc}${key}' was added with value: '${renderObjectValue(
        newValue
      )}'`
  }
];

const getTypeAction = arg => typeActions.find(({ check }) => check(arg));

const render = ast => {
  const iter = (astDiff, acc) =>
    astDiff
      .map(node => {
        const { key, oldValue, newValue, children, type } = node;
        const path = `${acc}${key}.`;
        const { process } = getTypeAction(type);
        return children.length > 0
          ? process(iter, children, path)
          : process(key, oldValue, newValue, acc);
      })
      .join('\n');

  return iter(ast, '');
};

export default render;
