const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios'); // Add axios for making HTTP requests
require("selenium-webdriver");
require("chromedriver");

const app = express();
const Port = 3000;
const Trend = require("./models/trend");
const connectionToDb = require("./config/db");
app.use(express.static('public'));
const dotenv=require('dotenv')
// Replace with your ScraperAPI key
const SCRAPERAPI_KEY = process.env.KEY

// Set up ScraperAPI proxy
function setUpScraperAPIProxy() {
    const proxy = `http://proxy.scraperapi.com?api_key=${SCRAPERAPI_KEY}`;
    const options = new chrome.Options();
    options.addArguments(`--proxy-server=${proxy}`);
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    return options;
}

// Function to fetch current IP address through ScraperAPI proxy
async function getCurrentIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json', {
            proxy: {
                host: 'proxy.scraperapi.com',
                port: 80,
                auth: {
                    username: SCRAPERAPI_KEY,
                    password: '' // Leave empty if no password is required
                }
            }
        });
        return response.data||'IP Not Found';
    } catch (error) {
        console.error('Error fetching IP address:', error.message);
        return 'IP Fetch Error';
    }
}

// Web scraping function
async function WebScrapingLocalTest() {
    let driver;
    try {
        // Configure driver with ScraperAPI proxy
        const options = setUpScraperAPIProxy();
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({ implicit: 10000 });
        await driver.get("https://trends24.in/india/");

        // Wait until elements are loaded
        await driver.wait(until.elementsLocated(By.css(".trend-link")), 10000);

        const response = await driver.findElements(By.css(".trend-link"));
        const trends = [];

        // Scrape first 5 trends
        for (let i = 0; i < 5; i++) {
            const text = await response[i].getText();
            trends.push(text);
            console.log(text);
        }

        // Get current IP address
        const ipAddress = await getCurrentIP();

        // Generate unique ID and time
        const uniqueId = uuidv4();
        const endTime = moment().format('DD-MM-YYYY HH:mm:ss');

        // Save the trends to MongoDB
        const trendData = new Trend({
            uniqueId,
            trend1: trends[0] || 'N/A',
            trend2: trends[1] || 'N/A',
            trend3: trends[2] || 'N/A',
            trend4: trends[3] || 'N/A',
            trend5: trends[4] || 'N/A',
            endTime,
            ipAddress,
        });

        await trendData.save();
        return trendData;

    } catch (error) {
        console.error('Error during scraping:', error);
        throw new Error(error);
    } finally {
        if (driver) await driver.quit();
    }
}

// Endpoint to trigger the scraping
app.get('/run-script', async (req, res) => {
    try {
        const result = await WebScrapingLocalTest();
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.status(500).json({ success: false, message: 'No data was scraped' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
