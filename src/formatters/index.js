import tree from "./tree";
import plain from "./plain";
import file from "./json";

const formats = {
  tree,
  plain,
  file
};

export default (ast, format) => {
  const render = formats[format];
  return render(ast);
};
