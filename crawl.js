/*
https://github.com/jsdom/jsdom
*/

const { JSDOM } = require('jsdom');
// const https = require('https');

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

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObject = new URL(baseURL);
  const currentURLObject = new URL(currentURL);
  if (baseURLObject.hostname !== currentURLObject.hostname) {
    return pages;
  }

  const normalisedCurrentURL = normaliseURL(currentURL);
  if (pages[normalisedCurrentURL] > 0) {
    pages[normalisedCurrentURL]++;
    return pages;
  }

  pages[normalisedCurrentURL] = 1;

  console.log(`actively crawling ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status >= 400) {
      console.log(
        `error in fetch with status code: ${resp.status}, on page ${currentURL}`
      );
      return pages;
    }

    const contentType = resp.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(
        `non HTML response, content type: ${contentType}, on page ${currentURL}`
      );
      return pages;
    }

    const htmlBody = await resp.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }

    return pages;

    // console.log(`${currentURL} - Status code:`, resp.status);
    // console.log(await resp.text());
  } catch (error) {
    console.error(`error in fetch: ${error.message}, on page ${currentURL}`);
  }
}

// Helper functions
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
  // console.log(urlObj);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normaliseURL,
  getURLsFromHTML,
  crawlPage,
};
