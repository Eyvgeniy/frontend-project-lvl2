import fs from 'fs';
import path from 'path';
import parse from './parsers';
import render from './formatters/index';
import buildAst from './gendiff';


export default (filePath1, filePath2, format) => {
  const data1 = fs.readFileSync(`${filePath1}`, 'utf8');
  const data2 = fs.readFileSync(`${filePath2}`, 'utf8');
  const ext1 = path.extname(filePath1);
  const ext2 = path.extname(filePath2);
  const parsedData1 = parse(data1, ext1);
  const parsedData2 = parse(data2, ext2);
  const ast = buildAst(parsedData1, parsedData2);
  return render(ast, format);
};

