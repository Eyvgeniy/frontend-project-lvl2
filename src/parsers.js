import ini from 'ini';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const typeFile = {
  '.yaml': filePath => yaml.safeLoad(fs.readFileSync(`${filePath}`, 'utf8')),
  '.json': filePath => JSON.parse(fs.readFileSync(`${filePath}`, 'utf8')),
  '.ini': filePath => ini.parse(fs.readFileSync(`${filePath}`, 'utf-8')),
};
export default (filePath) => {
  const ext = path.extname(filePath);
  const process = typeFile[ext];
  return process(filePath);
};
