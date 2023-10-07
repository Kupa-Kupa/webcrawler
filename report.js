function printReport(pages) {
  console.log('---------------');
  console.log('REPORT');
  console.log('---------------');

  const sortedPages = sortPages(pages);
  for (const page of sortedPages) {
    const url = page[0];
    const hits = page[1];
    console.log(`Found ${hits} links to page: ${url}`);
  }
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);

  pagesArray.sort((a, b) => {
    aCount = a[1];
    bCount = b[1];
    return bCount - aCount;
  });

  return pagesArray;
}

module.exports = {
  sortPages,
  printReport,
};
