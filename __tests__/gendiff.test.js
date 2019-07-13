import gendiff from '../src';

const result = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
+ verbose: true
- follow: false
}`;

test('check diff', () => {
  expect(gendiff('before.json', 'after.json')).toBe(result);
});
