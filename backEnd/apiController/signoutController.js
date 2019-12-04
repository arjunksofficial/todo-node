"use strict";

var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();


module.exports = function(app){
    app.get('/',jsonParser,function (req,res) {
        res.writeHead(200,{'Content-Type':'application/json'});
        var obj={status : "logged out"};
        res.write(JSON.stringify(obj));
        res.end();
    });
}
