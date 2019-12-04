"use strict";

const express = require('express');
const app = express();
var route = require('./routes/route');
var pageroute = require('./routes/routepage');
var securepageroute = require('./routes/routesecurepage');

app.use('/webpages',pageroute);
app.use('/webpagessecure',securepageroute);
app.use('/',route);

app.listen(8000);