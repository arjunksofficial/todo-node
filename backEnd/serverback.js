"use strict";

var cors = require('cors');
var express = require('express');
var app = express();
var taskroute = require('./routes/routetask');
var tasksignin = require('./routes/routesignin');
var tasksignout = require('./routes/routesignout');

app.use(cors());
app.use('/task',taskroute);
app.use('/signin',tasksignin);
app.use('/signout',tasksignout);

app.listen(9000);