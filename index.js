'use strict';

const http=require('http'); //for http server
const fs=require('fs');
const path=require('path');  //for the filepath
const url=require('url');  //for route, the pathname

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

const config =require(path.join(__dirname,'config.json'));
const homePath=path.join(__dirname,'home.html');
//const faviconPath=path.join(__dirname,'face.png');
//const stylePath=path.join(__dirname,'styles.css');
const programmers = path.join(__dirname, 'programmers.json');



const server=http.createServer((req,res)=> {  //serverin luonti
  let route=url.parse(req.url).pathname;

  if(route==='/') {
    fs.readFile(homePath, 'utf8', (err, data) => {
      if(err) {
        res.statusCode = 404;
        res.end(err.message);
      }
      else {
        res.writeHead(200, {
          'content-type':'text/html',
          'content-length':data.length
        }
        );
        res.end(data);
      }
    });
  }

  else if(route.startsWith('/images')) {
    fs.readFile(path.join(__dirname, route), (err, data) => {
      if(err) {
        res.statusCode = 404;
        res.end(err.message);
      }
      else {
        res.writeHead(200, {
          'content-type':'image/png'
        }
        );
        res.end(data, 'binary');
      }
    });
  }

  else {
    let responseJson = '';
    if(route==='/all') {
      responseJson=Object.keys(programmers);
    }
    if(Object.keys(programmers).includes(route.substr(1))) {
      responseJson=programmers[route.substr(1)];
    }

    res.writeHead(200, {
      'content-type':'application/json'
    });
    res.end(JSON.stringify(responseJson));
  }
});



server.listen(port, host, () => {
  /*eslint-disable no-console */
  console.log(`Server ${host} is running at the port ${port}`);
});
