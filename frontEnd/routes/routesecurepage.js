var express = require('express');
var router = express.Router();
var controller = require('../apiController/securepagecontroller');
controller(router);

module.exports = router;