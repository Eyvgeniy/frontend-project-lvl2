import { isObject } from "lodash";

const renderObjectValue = value => (isObject(value) ? "[complex value]" : `${value}`);

const typeActions = {
  nested: (render, children, acc) => render(children, acc),
  unchanged: (key, oldValue, newValue, acc) => `Property '${acc}${key}' was not changed`,
  changed: (key, oldValue, newValue, acc) =>
    `Property '${acc}${key}' was updated. From '${renderObjectValue(
      oldValue
    )}' to '${renderObjectValue(newValue)}'`,
  deleted: (key, oldValue, newValue, acc) => `Property '${acc}${key}' was removed`,
  added: (key, oldValue, newValue, acc) =>
    `Property '${acc}${key}' was added with value: '${renderObjectValue(newValue)}'`
};
const render = ast => {
  const iter = (astDiff, acc) =>
    astDiff
      .map(node => {
        const { key, oldValue, newValue, children, type } = node;
        const path = `${acc}${key}.`;
        const process = typeActions[type];
        return children.length > 0
          ? process(iter, children, path)
          : process(key, oldValue, newValue, acc);
      })
      .join("\n");

  return iter(ast, "");
};

export default render;
