import ini from 'ini';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const typeFile = [
  {
    type: 'yaml',
    check: arg => arg === '.yaml',
    process: file =>
      yaml.safeLoad(fs.readFileSync(`${__dirname}/${file}`, 'utf8'))
  },
  {
    type: 'json',
    check: arg => arg === '.json',
    process: file => JSON.parse(fs.readFileSync(`${__dirname}/${file}`, 'utf8'))
  },
  {
    type: 'ini',
    check: arg => arg === '.ini',
    process: file => ini.parse(fs.readFileSync(`${__dirname}/${file}`, 'utf-8'))
  }
];
export default file => {
  const ext = path.extname(file);
  const { process } = typeFile.find(({ check }) => check(ext));
  return process(file);
};
