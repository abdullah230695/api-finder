const routeScanner = require('website-route-scanner');
const scanApi = require('./scanApi');
const { generateReport } = require('./utils');

class Scanner {

    constructor(website) {
        this.scannerList = [];
        this.website = website;
    }

    async scanWebsite() {
        console.time('scanWebsite');
        const pageList = await routeScanner(this.website);
        console.log('Website scrap done');

        if (pageList.length === 0) {
            console.log('No website pages found');
            return [{page: this.website, apiList: []}];
        }

        const list = await this.scan(pageList);

        if (list.length > 0) {
            console.log('Found API calls on', list.length, 'pages');            
        } else {
            console.log(`No API calls found on website : ${this.website}`);
        }

        // await generateReport(list, 'api-report.json');

        console.timeEnd('scanWebsite');

        return list.length>0 ? list : [{page: this.website, apiList: []}];
    }

    scan = (list) => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < list.length; i++) {
                const page = 'http://' + list[i];
                console.log('Scanning API lsit for this page :', page);
                const apiLIst = await scanApi(page);
                console.log('Found', apiLIst.length, 'API calls on this page');
                if (apiLIst.length > 0) {
                    this.scannerList.push({
                        page: page,
                        apiList: apiLIst
                    });
                } else {
                    console.log('No API calls found on page:', page);
                }
            }

            resolve(this.scannerList);
        })
    }

}


module.exports = Scanner;

