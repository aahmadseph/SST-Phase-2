const fs = require('fs');
const path = require('path');

function generateHtmlTable(inpData) {
    function getInpColor(inp) {
        if (typeof inp !== 'number' || isNaN(inp)) {
            return '';
        }

        if (inp > 400) {
            return 'value-high';
        } else if (inp >= 200) {
            return 'value-medium';
        } else {
            return 'value-good';
        }
    }

    // Function to convert data to HTML table
    function convertToHTMLTable(data) {
        const headerValues = Object.keys(data[0]);
        let table = '<table><tr>';
        table += `<th>${headerValues[0]}</th>`;
        table += `<th>${headerValues[1]}</th>`;
        table += '</tr>';
        // Add table rows
        data.forEach(row => {
            const rowValues = Object.values(row);
            table += '<tr>';
            table += `<td>${rowValues[0]}</td>`;
            table += `<td class="${getInpColor(rowValues[1])}">${rowValues[1]}</td>`;
            table += '</tr>';
        });
        table += '</table>';

        return table;
    }

    // Group data by PageName
    const groupedData = inpData.reduce((acc, item) => {
        const pageName = item.PageName;

        if (!acc[pageName]) {
            acc[pageName] = [];
        }

        acc[pageName].push(item);

        return acc;
    }, {});

    // Generate HTML for each group
    let htmlContent = '';

    for (const [pageName, pageData] of Object.entries(groupedData)) {
        htmlContent += `<h2>${pageName}</h2>`;
        htmlContent += convertToHTMLTable(pageData);
    }

    // Read CSS styles
    const styles = fs.readFileSync(path.resolve('src/outputStyles.css'));

    // HTML template with placeholder for table
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>INP Data</title>
  <style>${styles}</style>
</head>
<body>
  <h1>INP data</h1>
  ${htmlContent}
  <hr />
  <footer>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </footer>
</body>
</html>
`;

    const buildDir = path.resolve('dist/cjs');

    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }

    // Write HTML content to file
    const pathToResults = `${buildDir}/results.html`;
    fs.writeFileSync(pathToResults, htmlTemplate);

    // eslint-disable-next-line no-console
    console.log(`Results written to ${pathToResults}`);
}

module.exports = generateHtmlTable;
