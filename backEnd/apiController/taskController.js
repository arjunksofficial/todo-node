"use strict";
var mysqlservices= require('../mysql/services');
var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();
var jwt=require('jsonwebtoken');
var fs=require('fs');


module.exports = function(app){
    app.use('/',function (req,res,next) {
        var token= req.headers.authorization;
        if (req.headers.authorization) {
            var cert = fs.readFileSync(__dirname + '/../keys/public.key'); // Get public key
            jwt.verify(token,cert,{algorithms: ['RS256']},function (err,payload) {
                if (err) {
                    res.writeHead(200,{'Content-Type': 'application/json'});
                    var json = {message: "Expired or invalid token"};
                    res.end(JSON.stringify(json));
                }
                next();
                // If token alg != RS256,  err == invalid signature
            });
        } else {
            res.writeHead(200,{'Content-Type':'application/json'});
            var json={message : "No authorization token"};
            res.end(JSON.stringify(json));
        }
    });
    
    app.get('/',function(req,res){
        res.writeHead(200,{'Content-Type':'application/json'});
        mysqlservices.getTasks(function (err,tasksjson){
            if (err) {
                throw err;
            }
            res.write(tasksjson);
            res.end();
        });
    });
    
    app.get('/:id',function(req,res){
        res.writeHead(200,{'Content-Type':'application/json'});
        mysqlservices.getTaskById(req.params.id,function (err,tasksjson){
            if (err) {
                throw err;
            }
            res.write(tasksjson);
            res.end();
        });
    });
    
    app.post('/',jsonParser,function(req,res){
        res.writeHead(201,{'Content-Type':'application/json'});
        var obj={};
        obj.name=req.body.name;
        obj.description=req.body.description;
        obj.assignee=req.body.assignee;
        obj.priority=req.body.priority;
        obj.date=new Date().toISOString().
            slice(0,19).
            replace('T',' ');
    
        mysqlservices.insertTask(obj,function(err,id){
            if (err) {
                throw err;
            }
            mysqlservices.getTaskById(id+1,function (err,taskjson){
                if (err) {
                    throw err;
                }
                res.write(taskjson);
                res.end();
            });
        });
    });
    
    
    app.patch('/',jsonParser,function(req,res){
        res.writeHead(201,{'Content-Type':'application/json'});
        var obj={};
        obj.id=req.body.id;
        obj.name=req.body.name;
        obj.description=req.body.description;
        obj.assignee=req.body.assignee;
        obj.status=req.body.status;
        obj.priority=req.body.priority;
    
        mysqlservices.updateTask(obj,function(err,id){
            if (err) {
                throw err;
            }
            mysqlservices.getTaskById(id,function (err,taskjson){
                if (err) {
                    throw err;
                }
                res.write(taskjson);
                res.end();
            });
        });
    });
}
