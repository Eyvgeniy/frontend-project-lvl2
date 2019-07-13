import fs from 'fs';
import path from 'path';
import { has } from 'lodash';

const gendiff = function(before, after) {
  const beforeData = JSON.parse(fs.readFileSync(`${__dirname}/${before}`));
  const afterData = JSON.parse(fs.readFileSync(`${__dirname}/${after}`));
  const result = Object.keys(beforeData).map(el => {
    return has(afterData, el)
      ? ` ${el}: ${beforeData[el]}`
      : `- ${el}: ${beforeData[el]}`;
  });
  return `{\n ${result.join('\n')}\n}`;
};

gendiff('before.json', 'after.json');

export default gendiff;
