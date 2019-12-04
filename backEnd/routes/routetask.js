"use strict";
var express = require('express');
var router = express.Router();
var controller = require('../apiController/taskController');
controller(router);

module.exports = router;