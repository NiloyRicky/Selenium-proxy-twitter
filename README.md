📚 Project README: Selenium Web Scraper with Express and MongoDB


---

🚀 Project Overview

This project is a web scraping application built with Node.js, Express, Selenium WebDriver, and MongoDB. The scraper fetches trending topics from a specified website using Selenium and proxies managed by ScraperAPI. The extracted data is then stored in a MongoDB database, along with metadata like a unique ID, timestamp, and IP address.


---

📦 Tech Stack

Backend: Node.js, Express.js

Web Scraper: Selenium WebDriver (Chrome)

Proxy Service: ScraperAPI

Database: MongoDB

UUID: Unique ID generation

Moment.js: Date & time formatting



---

🛠️ Installation Guide

1. Clone the Repository

git clone https://github.com/your-username/your-repo.git
cd your-repo

2. Install Dependencies

npm install

Dependencies include:

express

mongoose

selenium-webdriver

chromedriver

uuid

moment


3. Set Up MongoDB

Create a MongoDB database.

Update your MongoDB connection string in config/db.js:


const mongoose = require('mongoose');
const connectionToDb = async () => {
    await mongoose.connect('your-mongodb-connection-string');
    console.log('MongoDB connected');
};
module.exports = connectionToDb;

4. Set Up ScraperAPI

Get your ScraperAPI key from ScraperAPI.

Replace the placeholder key in your main file:


const SCRAPERAPI_KEY = 'your-scraperapi-key';

5. Run the Application

node index.js

Visit: http://localhost:3000



---

📄 Project Structure

├── public/           # Static files (index.html, CSS, JS)
├── models/           # MongoDB models
│   └── trend.js      # Schema for storing scraped trends
├── config/           # Configuration files
│   └── db.js         # MongoDB connection configuration
├── index.js          # Main server and scraping logic
├── package.json      # Project dependencies
└── README.md         # Documentation


---

🌐 API Endpoints

1. Run Web Scraper

URL: GET /run-script

Description: Runs the web scraper and stores the top 5 trends in the database.

Response:


{
  "success": true,
  "data": {
    "uniqueId": "uuid",
    "trend1": "Trend 1",
    "trend2": "Trend 2",
    "trend3": "Trend 3",
    "trend4": "Trend 4",
    "trend5": "Trend 5",
    "endTime": "DD-MM-YYYY HH:mm:ss",
    "ipAddress": "123.456.78.90"
  }
}


---

🔑 Key Features

✅ Real-time Web Scraping: Fetches live trending topics.

✅ Proxy Integration: Ensures rotating IP addresses using ScraperAPI.

✅ MongoDB Integration: Stores trends along with metadata.

✅ Dynamic Rendering: Accessible via API routes.

✅ Error Handling: Robust error management during scraping and database operations.
