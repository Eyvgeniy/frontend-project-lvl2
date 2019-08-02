import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const exts = ['json', 'yaml', 'ini'];
const formats = ['tree', 'plain'];

const nested = exts.map(ext => formats.map(format => ['nested', ext, format])).flat();
const flat = exts.map(ext => formats.map(format => ['flat', ext, format])).flat();

const getPath = (fileName, ext) => path.join(__dirname, '__fixtures__', ext, `${fileName}.${ext}`);

test.each([...flat, ...nested])(
  'check diff, complexity: %p, ext: %p, format: %p',
  (type, ext, format) => {
    const firstFilePath = getPath(`before${type}`, ext);
    const secondFilePath = getPath(`after${type}`, ext);
    const resultPath = path.join('__fixtures__', `${format}${type}`);
    const expected = fs.readFileSync(`${__dirname}/${resultPath}`, 'utf-8');

    expect(gendiff(firstFilePath, secondFilePath, format)).toBe(expected);
  },
);
