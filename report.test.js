const { sortPages } = require('./report.js');
const { test, expect } = require('@jest/globals');

test('sortPages 2 pages', () => {
  const input = {
    'https://www.google.com/path': { count: 1, response: 200 },
    'https://www.google.com': { count: 3, response: 200 },
  };
  const actual = sortPages(input);
  const expected = [
    ['https://www.google.com', { count: 3, response: 200 }],
    ['https://www.google.com/path', { count: 1, response: 200 }],
  ];
  expect(actual).toEqual(expected);
});

test('sortPages', () => {
  const input = {
    'https://www.google.com/path1': { count: 1, response: 200 },
    'https://www.google.com/path2': { count: 3, response: 200 },
    'https://www.google.com/path3': { count: 12, response: 200 },
    'https://www.google.com/path4': { count: 31, response: 200 },
    'https://www.google.com/path5': { count: 17, response: 200 },
    'https://www.google.com': { count: 2, response: 200 },
  };
  const actual = sortPages(input);
  const expected = [
    ['https://www.google.com/path4', { count: 31, response: 200 }],
    ['https://www.google.com/path5', { count: 17, response: 200 }],
    ['https://www.google.com/path3', { count: 12, response: 200 }],
    ['https://www.google.com/path2', { count: 3, response: 200 }],
    ['https://www.google.com', { count: 2, response: 200 }],
    ['https://www.google.com/path1', { count: 1, response: 200 }],
  ];
  expect(actual).toEqual(expected);
});
