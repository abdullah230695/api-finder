const puppeteer = require('puppeteer');

const scanApi = async (domain='') => {
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Array to store detected API calls
    let apiCalls = [];

    try {
        // Intercept network requests
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const url = request.url();
    
            // Filter for API requests (typically JSON, but you can adjust the conditions)
            if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
                apiCalls.push(url);  // Collect API URLs
            }
    
            request.continue(); // Let the request proceed
        });
    
        // Visit the website
        await page.goto(domain, { waitUntil: 'networkidle0' });
    
        // Close the browser
        await browser.close();
    } catch (error) {
        console.log(`ERROR WHILE FETCHING PAGE: ${domain}`, error.message || error);
    }

    return apiCalls;
};

module.exports = scanApi;
