var express = require('express');
var router = express.Router();
var controller = require('../apiController/pagecontroller');
controller(router);

module.exports = router;