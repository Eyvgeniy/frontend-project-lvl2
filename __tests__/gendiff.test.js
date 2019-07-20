import fs from 'fs';
import gendiff from '../src';

const path = `${__dirname}/__fixtures__`;
const result = fs.readFileSync(`${path}/result`, 'utf-8');
const resultNested = fs.readFileSync(`${path}/resultnested`, 'utf-8');
const plain = fs.readFileSync(`${path}/plain`, 'utf-8');
const plainnested = fs.readFileSync(`${path}/plainnested`, 'utf-8');

test.each([
  ['json', result, `${path}/json/before.json`, `${path}/json/after.json`],
  ['plain', plain, `${path}/json/before.json`, `${path}/json/after.json`],
  ['json', result, `${path}/yaml/before.yaml`, `${path}/yaml/after.yaml`],
  ['plain', plain, `${path}/yaml/before.yaml`, `${path}/yaml/after.yaml`],
  ['json', result, `${path}/ini/before.ini`, `${path}/ini/after.ini`],
  ['plain', plain, `${path}/ini/before.ini`, `${path}/ini/after.ini`],
  ['json', resultNested, `${path}/json/beforenested.json`, `${path}/json/afternested.json`],
  ['json', resultNested, `${path}/yaml/beforenested.yaml`, `${path}/yaml/afternested.yaml`],
  ['json', resultNested, `${path}/ini/beforenested.ini`, `${path}/ini/afternested.ini`],
  ['plain', plainnested, `${path}/json/beforenested.json`, `${path}/json/afternested.json`],
  ['plain', plainnested, `${path}/yaml/beforenested.yaml`, `${path}/yaml/afternested.yaml`],
  ['plain', plainnested, `${path}/ini/beforenested.ini`, `${path}/ini/afternested.ini`],
])('check diff, type of output: %p', (format, expected, a, b) => {
  expect(gendiff(a, b, format)).toBe(expected);
});
