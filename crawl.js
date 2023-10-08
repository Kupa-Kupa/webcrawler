/*
  https://github.com/jsdom/jsdom
  https://github.com/axios/axios
*/

/*
  pages object should probably have the following structure if 404:
  pages[normalisedCurrentURL] = { count: 1, response: resp.status, referrer: url };
*/

const { JSDOM } = require('jsdom');
const axios = require('axios');

async function crawlPage(baseURL, currentURL, referrerURL, pages) {
  const baseURLObject = new URL(baseURL);
  const currentURLObject = new URL(currentURL);
  // console.log(`${baseURL} => ${currentURL}`);

  if (baseURLObject.hostname !== currentURLObject.hostname) {
    return pages;
  }

  // these links should probably not be ignored, but flagged to fix
  if (currentURL === '') {
    return pages;
  }

  const normalisedCurrentURL = normaliseURL(currentURL);

  if (pages[normalisedCurrentURL] !== undefined) {
    pages[normalisedCurrentURL].count++;

    // if new referrer url, add it to list of referrers
    if (!pages[normalisedCurrentURL].referrer.includes(referrerURL)) {
      pages[normalisedCurrentURL].referrer.push(referrerURL);
    }

    return pages;
  }

  console.log(`actively crawling ${currentURL}`);

  try {
    // don't want to throw an error on any response codes
    // https://github.com/axios/axios#handling-errors
    const resp = await axios.get(currentURL, {
      validateStatus: function (status) {
        return true;
      },
    });

    pages[normalisedCurrentURL] = {
      count: 1,
      response: resp.status,
      referrer: [referrerURL],
    };

    if (resp.status >= 400) {
      console.log(
        `error in fetch with status code: ${resp.status}, on page ${currentURL}`
      );
      return pages;
    }

    const contentType = resp.headers['content-type'];
    // console.log('content type:', contentType);

    if (!contentType.includes('text/html')) {
      console.log(
        `non HTML response, content type: ${contentType}, on page ${currentURL}`
      );
      return pages;
    }

    // get html body from response
    const htmlBody = resp.data;
    // console.log(htmlBody);

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, currentURL, pages);
    }

    return pages;
  } catch (error) {
    console.error(`error in fetch: ${error.message}, on page ${currentURL}`);

    // pages[normalisedCurrentURL] = { count: 1, response: resp.status };

    return pages;
  }
}

// Helper functions
function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);

  // Don't want any links without a href attribute
  const linkNodeList = dom.window.document.querySelectorAll('a[href]');

  const urls = Array.from(linkNodeList).map((link) => {
    if (link.href.slice(0, 1) === '/') {
      return `${baseURL}${link.href}`;
    } else if (link.href.slice(0, 3) === 'www') {
      // axios throwing error if no scheme provided
      return `https://${link.href}`;
    } else if (
      link.href === '' ||
      link.href === null ||
      link.href === undefined
    ) {
      // if no href is provided there will be an invalid url error in request
      return '';
    } else {
      return link.href;
    }
  });

  return urls;
}

function normaliseURL(urlString) {
  const urlObj = new URL(urlString);

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
