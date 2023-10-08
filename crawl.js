/*
  https://github.com/jsdom/jsdom
  https://github.com/axios/axios
*/

const { JSDOM } = require('jsdom');
const axios = require('axios');

async function crawlPage(baseURL, currentURL, referrerURL, pages) {
  const baseURLObject = new URL(baseURL);
  const currentURLObject = new URL(currentURL);

  if (baseURLObject.hostname !== currentURLObject.hostname) {
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
      broken: '',
    };

    if (resp.status >= 400) {
      console.log(
        `ERROR in request with status code: ${resp.status}, on page ${currentURL}`
      );
      return pages;
    }

    const contentType = resp.headers['content-type'];

    if (!contentType.includes('text/html')) {
      console.log(
        `Non HTML response, content type: ${contentType}, on page ${currentURL}`
      );
      return pages;
    }

    // get html body from response
    const htmlBody = resp.data;

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, currentURL, pages);
    }

    return pages;
  } catch (error) {
    if (error.message === 'Invalid URL') {
      const brokenLinks = await getBrokenURLsFromHTML(currentURL);

      pages[normalisedCurrentURL] = {
        count: 1,
        response: error.message,
        referrer: [referrerURL],
        broken: brokenLinks,
      };

      console.log('----------------------------------------');
      console.error(
        `ERROR in request: ${error.message}, on page ${currentURL}`
      );
      console.log(brokenLinks);
      console.log('----------------------------------------');

      return pages;
    }

    console.log('----------------------------------------');
    console.error(`ERROR in request: ${error.message}, on page ${currentURL}`);
    console.log('----------------------------------------');

    pages[normalisedCurrentURL] = {
      count: 1,
      response: error.message,
      referrer: [referrerURL],
      broken: '',
    };

    return pages;
  }
}

// Helper functions
async function getBrokenURLsFromHTML(currentURL) {
  const resp = await axios.get(currentURL, {
    validateStatus: function (status) {
      return true;
    },
  });

  const htmlBody = resp.data;

  const dom = new JSDOM(htmlBody);

  const brokenLinkNodeList =
    dom.window.document.querySelectorAll('a:not([href])');

  const links = Array.from(brokenLinkNodeList).map((link) => {
    return link.outerHTML;
  });

  return links;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);

  // Don't want any links without a href attribute
  // const linkNodeList = dom.window.document.querySelectorAll('a[href]');
  const linkNodeList = dom.window.document.querySelectorAll('a');

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
