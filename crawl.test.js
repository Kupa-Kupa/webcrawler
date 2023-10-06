const { normaliseURL, getURLsFromHTML } = require('./crawl.js');
const { test, expect } = require('@jest/globals');

test('normaliseURL strip protocol', () => {
  const input = 'https://www.google.com/path';
  const actual = normaliseURL(input);
  const expected = 'www.google.com/path';
  expect(actual).toEqual(expected);
});

test('normaliseURL strip trailing /', () => {
  const input = 'https://www.google.com/path/';
  const actual = normaliseURL(input);
  const expected = 'www.google.com/path';
  expect(actual).toEqual(expected);
});

test('normaliseURL capitals within hostname', () => {
  // note that url paths are case sensitive
  const input = 'https://wWW.goOGle.com/path/';
  const actual = normaliseURL(input);
  const expected = 'www.google.com/path';
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML absolute URLs', () => {
  const inputHTMLBody = `
<html>
    <body>
        <a href="https://www.google.com/path">Google</a>
    </body>
</html>  
`;
  const inputBaseURL = 'https://www.google.com';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ['https://www.google.com/path'];
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML relative urls', () => {
  const inputHTMLBody = `
<html>
    <body>
        <a href="/path">relative</a>
    </body>
</html>  
`;
  const inputBaseURL = 'https://www.google.com';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ['https://www.google.com/path'];
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML relative and absolute urls', () => {
  const inputHTMLBody = `
<html>
    <body>
        <a href="https://www.google.com/path1">Google</a>
        <a href="/path2">relative</a>
    </body>
</html>  
`;
  const inputBaseURL = 'https://www.google.com';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    'https://www.google.com/path1',
    'https://www.google.com/path2',
  ];
  expect(actual).toEqual(expected);
});
