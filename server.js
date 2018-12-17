'use strict';

const express = require('express');
const rp = require('request-promise');
const url = 'https://www.fia.com/events/fia-formula-one-world-championship/season-2018/session-classifications-19'

const cheerio = require('cheerio');
// Constants
const PORT = 3000;
const HOST = '0.0.0.0';


// App
const app = express();
app.use(express.static(__dirname + '/webscraper-ui/dist/webscraper-ui/')); 

app.get('/', (req, res) => {  
  res.sendFile(__dirname + '/webscraper-ui/dist/webscraper-ui/index.html');
});
app.get('/api', (req, res) => {
  rp(url)
    .then(function(html) {
      
      const $ = cheerio.load(html); 
      const results = [];

      //Get  all tables
      let data = $('.external-xml-data').find($('.table')).children();
      data.each(function(i){        
        const session = [];  
        
        //Get results from table
        let table = $(this).find($('.competitor'));
        getTable(table, $, session);
        
        results[i] = {header : $(this).find('thead').text().trim(),
                      results : session};
      }); 

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

