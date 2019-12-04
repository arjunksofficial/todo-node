"use strict";
var express = require('express');
var router = express.Router();
var controller = require('../apiController/signinController');
controller(router);

module.exports = router;