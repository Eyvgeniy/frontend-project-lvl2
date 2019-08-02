import renderTree from './tree';
import renderPlain from './plain';
import renderJSON from './json';

const formats = {
  tree: renderTree,
  plain: renderPlain,
  json: renderJSON,
};

export default (ast, format) => {
  const render = formats[format];
  return render(ast);
};
