const fs = require('fs');

function generateCSV(pages, filename = 'link_report.csv') {
  const pagesArray = Object.entries(pages);

  let csvData = `"URL","Occurrence of URL","Response Code"\r\n${pagesArray
    .map((page) => {
      const url = page[0];
      const count = page[1].count;
      const respCode = page[1].response;
      return `${url},${count},${respCode}`;
    })
    .join('\r\n')}`;

  downloadCSVBlob(csvData, filename);
}

function downloadCSVBlob(data, filename = 'link_report.csv') {
  fs.writeFileSync(filename, data, 'utf-8');
  console.log(`CSV file written to ${filename}`);
}

module.exports = {
  generateCSV,
};
