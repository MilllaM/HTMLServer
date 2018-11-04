'use strict';
//taking modules into use:
const fs=require('fs');
const path=require('path');

function read(filepath, encoding) {  //internal helper function, not exported
  return new Promise((resolve, reject)=> {  //promise can be in 2 states reject/resolve (3rd pending, but not used here)
    fs.readFile(filepath, encoding, (err,data)=> {
      if(err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

const sendFile=function(res,filepath,
  options={
    type:'text/html',
    encoding:'utf8'
  }) {
  read(filepath,options.encoding)
    .then(data => {  //if resolved, cont here
      res.writeHead(200, {
        'content-type':options.type,
        'content-length':data.length
      });
      res.end(data,options.encoding);
    })
    .catch(err => {  //if rejected, cont here
      res.setStatusCode=404;
      res.end(err.message);
    });
};
//const sendJson=function(res, flavor) {...}
const sendJson=(res, flavor) => {
  read(path.join(__dirname,'programmers.json'), 'utf8')
    .then(data=>JSON.parse(data))  //data that comes from the resolve part of the promise, see row 13
    .then(programmers=>{
      if(Object.keys(programmers).includes(flavor)) {  //is the icecream in the object keys
        res.writeHead(200,{'content-type':'application/json'});
        res.end(JSON.stringify(programmers));
      }
    })
    .catch(err=> {
      res.setStatusCode=404;
      res.end(err.message);
    });
};


module.exports={
  sendFile,
  sendJson,

};
