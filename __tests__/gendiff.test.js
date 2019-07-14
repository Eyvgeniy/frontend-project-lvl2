import gendiff from '../src';

const result = `{
  host: hexlet.io
- timeout: 50
+ timeout: 20
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;

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
}`

test('check diff json', () => {
  expect(gendiff('before.json', 'after.json')).toBe(result);
});

test('check diff yaml', () => {
  expect(gendiff('before.yaml', 'after.yaml')).toBe(result);
});

test('check diff ini', () => {
  expect(gendiff('before.ini', 'after.ini')).toBe(result);
});

test('check nested diff json', () => {
  expect(gendiff('beforenested.json', 'afternested.json')).toBe(result1);
});