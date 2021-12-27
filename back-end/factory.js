"use strict";
var RunningTrade = require("./runningTrade");
var Holder = require("./strategy/holder");
var Validator = require("./model/validator/validator");

// create the validator
var runningTrade = new RunningTrade();
var holder = new Holder();
var validator = new Validator(holder, {}, runningTrade);

