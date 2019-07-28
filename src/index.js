import { has, union, isObject } from "lodash";
import parse from "./parsers";
import render from "./formatters/index";

const buildAst = (first, second) => {
  const keys = union(Object.keys(first), Object.keys(second));
  const ast = keys.map(key => {
    if (has(first, key) && has(second, key) && isObject(first[key]) && isObject(second[key])) {
      return {
        key,
        oldValue: null,
        newValue: null,
        type: "nested",
        children: buildAst(first[key], second[key])
      };
    }
    if (has(first, key) && has(second, key) && first[key] === second[key]) {
      return {
        key,
        oldValue: first[key],
        newValue: null,
        type: "unchanged",
        children: []
      };
    }
    if (has(first, key) && has(second, key) && first[key] !== second[key]) {
      return {
        key,
        oldValue: first[key],
        newValue: second[key],
        type: "changed",
        children: []
      };
    }
    if (has(first, key) && !has(second, key)) {
      return { key, oldValue: first[key], newValue: null, type: "deleted", children: [] };
    }
    return {
      key,
      oldValue: null,
      newValue: second[key],
      type: "added",
      children: []
    };
  });
  return ast;
};

const gendiff = (first, second, format) => {
  const firstFile = parse(first);
  const secondFile = parse(second);
  const ast = buildAst(firstFile, secondFile);
  return render(ast, format);
};

export default gendiff;
