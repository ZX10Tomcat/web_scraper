'use strict';

// Constants
const express = require('express');
const rp = require('request-promise');
const url = 'https://www.fia.com/events/fia-formula-one-world-championship/season-2018/session-classifications-19'

const cheerio = require('cheerio');

const PORT = 3000;
const HOST = '0.0.0.0';

const MongoClient= require('mongodb').MongoClient;
//const config = require('./db');
const mongoUrl = 'mongodb://mongo:27017';
let dbresults;
MongoClient.connect(mongoUrl,
  { useNewUrlParser: true})
 .catch(err => {
   console.error(err.stack);
   process.exit(1)
 })
 .then (async client => {
  try {
   dbresults = await client.db('node-webscraper').collection('results');
  } 
  catch (err) {
   console.error(err.stack);
   process.exit(1)
  }
 })
 
// App
const app = express();
app.use(express.static(__dirname + '/webscraper-ui/dist/webscraper-ui/')); 

app.get('/', (req, res) => { 
  res.sendFile(__dirname + '/webscraper-ui/dist/webscraper-ui/index.html');
});
app.get('/api', (req, res) => {

  //res.send("ok");
  rp(req.query['url'])
    .then(function(html) {
      
      const $ = cheerio.load(html); 
      const results = [];
      let season = $('.season-title').text().trim();
      let race = $('.info').find($('h1')).text().trim();
      //Get  all tables
      let data = $('.external-xml-data').find($('.table')).children();
      data.each(function(i){        
        const session = [];  
        
        //Get results from table
        let table = $(this).find($('.competitor'));
        getTable(table, $, session);
        
        results[i] = {season : season, race : race, header : $(this).find('thead').text().trim(),
                      results : session};
      }); 
      addToMongo(results);
      res.send(results);
    }) 
    .catch(function(err){
      res.send(err);
    })

  //res.send('Hello world docker+\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

function getTable(table, $, session) {
  table.each(function (i) {
    let result = {};

    //Get result from row
    let row = $(this).find('td');
    getRow(row, $, result);
    session[i] = result;
  });
}

function getRow(row, $, result) {
  row.each(function () {
    let column = $(this).attr('class');
    result[column] = $(this).text();
  });
}

async function addToMongo (results) {
  try {
    const bulkOperation = dbresults.initializeUnorderedBulkOp();
    for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
      const result = results[resultIndex];
      bulkOperation.find({header: result.header }).upsert().updateOne(result);
      //await dbresults.update({header: result.header}, result, {upsert: true});
    }
    await bulkOperation.execute();
    return true;
  }
  catch (err) {
    console.error(err.stack);
    process.exit(1)
   }   
}
