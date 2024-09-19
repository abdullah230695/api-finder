const fs = require('fs');
generateReport = (routes, outputPath) => {
    const report = JSON.stringify(routes, null, 2);

    return new Promise((resolve, reject) => {
        fs.writeFile(outputPath, report, (err) => {
            if (err) {
                console.error('Error generating report:', err);
                return reject(err);
            }
            console.log('Report generated successfully');
            resolve();
        });
    });
}

module.exports = {
    generateReport
}