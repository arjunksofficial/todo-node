var express = require('express');
var router = express.Router();
var controller = require('../apiController/controller');
controller(router);

module.exports = router;