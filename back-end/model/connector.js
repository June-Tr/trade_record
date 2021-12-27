"use strict";
const database = require("mysql2/promise");
const bluebird = require("bluebird");
require('dotenv').config();

const logger = require("../../utility/log");
var Validator = require("./model/validator/validator");

var runningTrade = new RunningTrade();
var holder = new Holder();
var validator = new Validator(require("./strategy/holder"), {}, require("./runningTrade"));
var sqlGate = require("./facade");
var cache = require("./cache");

// helper function
function sendData(testResult, flag, data){
    // check if there are any major error in the data
    let res = true;
    let returnVal = null;

    if(testResult!= true){
        returnVal = testResult;
        for(var error of testResult){
            if(error.flag == 0){
                res = false;
                break;
            }
        }
    }

    // if appropriate send data to the sql
    if(res){
        let relation = cache.process(data, flag);
        sqlGate.insert(relation);
    }
    return returnVal;
}

let connector = {
    //Handling order information
    processOrder: (orderData) => {
        // case where this is the entry order
        // form a test
        let testEntity = {
            price: orderData.price,
            stopLost: orderData.stop,
            takeProfit: orderData.target,
            pipsPrice: orderData.pips
        }

        // if this is an entry order but fail to retrieve the two pre-set order(SL and TP)
        if(!cache.isOnTrade()){
            if(orderData.stop == null || orderData.target == null){
                // an invalid disrupted scenario occur
                logger.writeLog("Attempt to enter a trade without stop-lost and take-profit", "Connector order");
                return {message: "Attempt to enter a trade without stop-lost and take-profit",
                        flag: 0}
            }
        }
        
        let testResult = validator.verify(testEntity);
        return sendData(testResult, 0, orderData);
    },

    triggerOrder: async (orderData) => {
        if(!cache.isOnTrade()){
            logger.writeLog("Trigger an entry order: price ->" + orderData.price, "connector order");

            let initOrder = cache.trigger();
            for(var order of initOrder){
                
            }
        }
    }
}