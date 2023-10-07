function printReport(pages) {
  console.log('---------------');
  console.log('REPORT');
  console.log('---------------');

  const sortedPages = sortPages(pages);
  for (const page of sortedPages) {
    const url = page[0];
    const pageObject = page[1];
    console.log(
      `Found ${pageObject.count} links (response ${pageObject.response}) to page: ${url}`
    );
  }
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);

  pagesArray.sort((a, b) => {
    aCount = a[1].count;
    bCount = b[1].count;
    return bCount - aCount;
  });

  return pagesArray;
}

module.exports = {
  sortPages,
  printReport,
};
