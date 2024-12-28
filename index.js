const express = require('express');
const mongoose=require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { Builder, By,Capabilities,Key,until } = require('selenium-webdriver');
 require("selenium-webdriver");
 require("chromedriver");
 const fs=require("fs");
const app = express();
const Port = 3000;
const Trend=require("./models/trend");
const connectionToDb=require("./config/db");
//connectionToDb();
app.use(express.static('public'));


//web scrapping function

async function WebScrapingLocalTest() {
    let driver= await new Builder().forBrowser('chrome').build();
    try {
        
     await driver.manage().setTimeouts({implicit:10000});
      await driver.get("https://trends24.in/india/");
     
      const response=await driver.findElements(By.css(".trend-link"));
      const trends=[];
      for(let i=0;i<5;i++){
        trends.push(await response[i].getText());
        console.log(await response[i].getText())
      }
      

// Generate unique ID, time, and get IP address
const uniqueId = uuidv4();
const endTime = moment().format('DD-MM-YYYY  HH:mm:ss');
const ipAddress = 'Not Available'; // No proxy IP available, mark as N/A

// Save results to MongoDB
const trendData = new Trend({
  uniqueId,
  trend1: trends[0],
  trend2: trends[1],
  trend3: trends[2],
  trend4: trends[3],
  trend5: trends[4],
  endTime,
  ipAddress,
});

await trendData.save();

return trendData;








    
    } catch (error) {
      throw new Error(error);
    } finally {
      await driver.quit();
    }
   }
   //WebScrapingLocalTest();
   app.get('/run-script',async (req,res)=>{
    const result= await WebScrapingLocalTest();
    if(result){//webScrapping se kuch return(trendData) hua tbhi if() condition laga ha
      res.json({success:true,
        data:result
      });
    }
    else{
      res.status(500).json({
        sucess:false,
        message:'script fsiled'
      })
    }
   });
   app.listen(Port,()=>{
    console.log("port is running at 3000");
   })