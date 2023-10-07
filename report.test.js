const { sortPages } = require('./report.js');
const { test, expect } = require('@jest/globals');

test('sortPages 2 pages', () => {
  const input = {
    'https://www.google.com/path': 1,
    'https://www.google.com': 3,
  };
  const actual = sortPages(input);
  const expected = [
    ['https://www.google.com', 3],
    ['https://www.google.com/path', 1],
  ];
  expect(actual).toEqual(expected);
});

test('sortPages', () => {
  const input = {
    'https://www.google.com/path1': 1,
    'https://www.google.com/path2': 3,
    'https://www.google.com/path3': 12,
    'https://www.google.com/path4': 31,
    'https://www.google.com/path5': 17,
    'https://www.google.com': 2,
  };
  const actual = sortPages(input);
  const expected = [
    ['https://www.google.com/path4', 31],
    ['https://www.google.com/path5', 17],
    ['https://www.google.com/path3', 12],
    ['https://www.google.com/path2', 3],
    ['https://www.google.com', 2],
    ['https://www.google.com/path1', 1],
  ];
  expect(actual).toEqual(expected);
});
