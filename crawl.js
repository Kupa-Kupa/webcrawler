/*
https://github.com/jsdom/jsdom
*/

const { JSDOM } = require('jsdom');
const https = require('https');

// https
//   .get(
//     'https://www.google.com',
//     { headers: { 'User-Agent': 'user' } },
//     function (res) {
//       console.log('status code:', res.statusCode);
//     }
//   )
//   .on('error', function (err) {
//     console.error(err);
//   });

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);

  const linkNodeList = dom.window.document.querySelectorAll('a');

  const urls = Array.from(linkNodeList).map((link) => {
    if (link.href.slice(0, 1) === '/') {
      return `${baseURL}${link.href}`;
    } else {
      return link.href;
    }
  });

  return urls;
}

function normaliseURL(urlString) {
  const urlObj = new URL(urlString);
  console.log(urlObj);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normaliseURL,
  getURLsFromHTML,
};
