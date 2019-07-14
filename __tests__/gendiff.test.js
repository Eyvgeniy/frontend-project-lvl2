import gendiff from '../src';

const result = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;

test('check diff json', () => {
  expect(gendiff('before.json', 'after.json')).toBe(result);
});

test('check diff yaml', () => {
  expect(gendiff('before.yaml', 'after.yaml')).toBe(result);
});

test('check diff ini', () => {
  expect(gendiff('before.ini', 'after.ini')).toBe(result);
});
