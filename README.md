# Broken Link Web Crawler

Crawl your site for broken internal links.

This broken link web crawler will search a site for broken links and generate a convenient CSV report of all the broken internal links and the pages where they are found.

This Broken Link Web Crawler runs on [Node.js](https://nodejs.org/en/about) and uses [axios](https://github.com/axios/axios) and [jsdom](https://github.com/jsdom/jsdom).

## Run Crawl

```
$ npm start <url_to_crawl>
```

`<url_to_crawl>` should be in the format of https://www.example.com

**NB:** The scheme must be included in the url, i.e. **http://** or **https://**

## Limitations

This web crawler only crawls internal links, so all external links will **NOT** be crawled and tested. This means that if the site contains any broken external links they will not be shown in the report.

For the purposes of this web crawler, internal links are any links with the same [hostname](https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname) as the one provided in `<url_to_crawl>`.
