import fs from 'fs'
import gendiff from '../src';

const path = `${__dirname}/__fixtures__`;
const result = fs.readFileSync(`${path}/result`, 'utf-8');
const resultPlain = fs.readFileSync(`${path}/resultPlain`, 'utf-8');
// console.log(result);
// const result = `{
//   host: hexlet.io
// - timeout: 50
// + timeout: 20
// - proxy: 123.234.53.22
// - follow: false
// + verbose: true
// }`;

const result1 = `{
  common: {
      setting1: Value 1
    - setting2: 200
    - setting3: true
    + setting3: {
          key: value
      }
      setting6: {
          key: value
        + ops: vops
      }
    + follow: false
    + setting4: blah blah
    + setting5: {
          key5: value5
      }
  }
  group1: {
    - baz: bas
    + baz: bars
      foo: bar
    - nest: {
          key: value
      }
    + nest: str
  }
- group2: {
      abc: 12345
  }
+ group3: {
      fee: 100500
  }
}`;



// test('check diff json', () => {
//   expect(gendiff(`${path}/json/before.json`, `${path}/json/after.json`, 'tree')).toBe(result);
// });

// test('check diff yaml', () => {
//   expect(gendiff(`${path}/yaml/before.yaml`, `${path}/yaml/after.yaml`, 'tree')).toBe(result);
// });

// test('check diff ini', () => {
//   expect(gendiff(`${path}/ini/before.ini`, `${path}/ini/after.ini`, 'tree')).toBe(result);
// });

test.each([['json', result, `${path}/json/before.json`, `${path}/json/after.json`],
['plain', resultPlain, `${path}/json/before.json`, `${path}/json/after.json`],
['json', result, `${path}/yaml/before.yaml`, `${path}/yaml/after.yaml`],
['plain', resultPlain, `${path}/yaml/before.yaml`, `${path}/yaml/after.yaml`],
['json', result, `${path}/ini/before.ini`, `${path}/ini/after.ini`],
['plain', resultPlain, `${path}/ini/before.ini`, `${path}/ini/after.ini`],
])(
  'check diff, type of output: %p',
  (format, expected, a, b) => {
    expect(gendiff(a, b, format)).toBe(expected);
  },
);
