const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');
const { generateCSV } = require('./generateCSV.js');

async function main() {
  if (process.argv.length < 3) {
    console.log('No website provided...');
    process.exit(1);
  }

  if (process.argv.length > 3) {
    console.log('Too many command line arguments...');
    process.exit(1);
  }

  const baseURL = process.argv[2];
  const baseURLObject = new URL(baseURL);
  const originURL = baseURLObject.origin;

  console.log(`starting crawl of ${baseURL}`);
  const pages = await crawlPage(originURL, baseURL, '', {});

  printReport(pages);
  generateCSV(pages, `${baseURLObject.hostname}_link_report.csv`);
}

main();
