"use strict";

var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();
var jwt=require('jsonwebtoken');
var fs=require('fs');


module.exports = function(app){
    app.post('/',jsonParser,function(req,res){
        if (req.body.username !== "arjun") {
            res.status(401).json({message: 'Authentication failed. Invalid user.'});
    
        } else if (req.body.username === "arjun" && req.body.password !== "qburst") {
            res.status(401).json({message: 'Authentication failed. Wrong password.'});
    
        } else if (req.body.username==="arjun" && req.body.password==="qburst") {
            res.writeHead(201,{'Content-Type':'application/json'});
            var cert = fs.readFileSync(__dirname+'/../keys/private.key');
            var tokenvalue = jwt.sign({foo: 'bar'},cert,{algorithm: 'RS256'},{expiresIn: '1h'});
            var obj={token: tokenvalue};
            res.write(JSON.stringify(obj));
        }
        res.end();
    });
}