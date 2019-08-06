import { isObject } from 'lodash';

const renderObjectValue = value => (isObject(value) ? '[complex value]' : `${value}`);

const typeActions = {
  nested: (node, acc, render) => {
    const { key, children } = node;
    const path = `${acc}${key}.`;
    return render(children, path);
  },
  unchanged: (node, acc) => {
    const { key } = node;
    return `Property '${acc}${key}' was not changed`;
  },
  changed: (node, acc) => {
    const { key, oldValue, newValue } = node;
    return `Property '${acc}${key}' was updated. From '${renderObjectValue(oldValue)}' to '${renderObjectValue(newValue)}'`;
  },
  deleted: (node, acc) => {
    const { key } = node;
    return `Property '${acc}${key}' was removed`;
  },
  added: (node, acc) => {
    const { key, newValue } = node;
    return `Property '${acc}${key}' was added with value: '${renderObjectValue(newValue)}'`;
  },
};

const render = (ast) => {
  const iter = (astDiff, acc) => astDiff
    .map((node) => {
      const { type } = node;
      const process = typeActions[type];
      return process(node, acc, iter);
    })
    .join('\n');

  return iter(ast, '');
};

export default render;
