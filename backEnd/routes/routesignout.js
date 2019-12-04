var express = require('express');
var router = express.Router();
var controller = require('../apiController/signoutController');
controller(router);

module.exports = router;