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

  const baseUrl = process.argv[2];
  const baseURLObject = new URL(baseUrl);

  //   process.argv.forEach((arg) => console.log(arg));

  console.log(`starting crawl of ${baseUrl}`);
  const pages = await crawlPage(baseUrl, baseUrl, {});

  //   for (const page of Object.entries(pages)) {
  //     console.log(page);
  //   }

  printReport(pages);
  generateCSV(pages, `${baseURLObject.hostname}_link_report.csv`);
}

main();
