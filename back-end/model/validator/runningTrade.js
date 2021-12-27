"use strict";

const logger = require("../../../utility/log");
const fs = require("fs");

class runningTrade{

    constructor(){
        fs.readFile(
            "./back-end/model/validator/data.txt", 'utf8', (err, data) => {
                if(err){
                    console.log(err);
                    logger.writeLog("Fail to find the data file to initiate the running Trade!!!", "<running trade initiation>");
                    return;
                }

                var backUp = JSON.parse(data)
                
                this._currentAccSize = backUp.currentAccSize;
                this._entryTime = backUp.entryTime;
                this._init = backUp.init;
            }
        )
    }

    /**
     * check if the order time is correct
     * @param {long} time time that order is place
     * @returns boolean indicate if the enter time is appropriate
     */
    timeCheck(time){
        if(!time || time> Date.now() || time <= this._entryTime){
            logger.writeLog("Time enter is wrong", "<runningTrade check>");
            return {
                message: "Time enter is wrong",
                flag: 0
            };
        }
        
        return true;
    }


    /**
     * 
     * @param {} price 
     * @returns 
     */
    priceCheck(price){
        if(!price) {
            logger.writeLog("Missing price!", "<runningTrade check>");
            return{
                message:"Missing price!",
                flag: 0
            }
        }
        // set the new stop
        currentStop = price;

        if(price < currentStop){            
            logger.writeLog("Move the stop-lost lower", "<runningTrade check>");
            return {
                message:"Move the stop-lost lower",
                flag: 1
            }
        }
        return true;
    }
    
    complete(price){
        this._currentAccSize = (price - this._init.entry) *this._init.pipsPrice;
        this._init = null;
    }



    /**
     * 
     * @param {JSON} order { price:..., pipsPrice:...,stopLost: ..., takeProfit: ...}
     * @returns array of all the error message
     */
    verify(order){
        // if this is a new entry
        if(!this._init){
            if(order.price && order.pipsPrice && order.stopLost && order.takeProfit){
                if(order.pipsPrice * Math.abs(order.price - order.stopLost) > 1.5 * this._risk * this._currentAccSize){
                    logger("Attempt to place entry order with too much risk", "runningTrade check");
                    return [{
                        message: "The stop lost too large",
                        error: 1
                    }]
                }
                this._init = {};
                this._init.entry = order.price;
                this._init.currentStop = order.stopLost;
                this._init.currentTakeProfit = order.takeProfit;
            }else {
                logger("invalid data", "runningTrade check");
                    return [{
                        message: "Invalid entry",
                        error: 0
                    }]
            }
            this._entryTime = Date.now();
            return true
        }


        // if this is following up order.
        var res = [];
        var resPriceCheck = this.priceCheck(order.price);
        var resTimeCheck = this.timeCheck(order.placement);
        if(resPriceCheck != true){
            res.push(resPriceCheck);
        }
        if(resTimeCheck != true){
            res.push(resTimeCheck)
        }
    }

    shutdownHook(){
        try{
            var backUp = {
                currentAccSize: this._currentAccSize,
                entryTime: this._entryTime,
                init: this._init
            }
            fs.writeFileSync("./back-end/model/validator/data.txt", 
                JSON.stringify(backUp)
            )
        }catch(err){
            logger.writeLog("Fail to back up data!!!", "<runingTrade>");
        }
    }
}

module.exports = new runningTrade();