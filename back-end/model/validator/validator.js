"use strict";
require("../validator/strategy/holder");
var RunningTrade = require("./runningTrade");
var Holder = require("./strategy/holder");

module.exports = class Validator {

    constructor(strategyHolder, typeDict, RunningTrade){
        
        this._strategyHolder = strategyHolder;
        this._typeDict = typeDict;
        this._runningTrade = RunningTrade;
        this._runningTrade = new RunningTrade();
    }

    shutdownHook(){
        this._runningTrade.shutdownHook();
    }

    verify(order){
        var res = [];
        var resRunningTrade = this._runningTrade.verify(order);
        var resStrategy = this._strategyHolder.verify(order);
        if(resRunningTrade != true){
            res.concat(resRunningTrade);
        } 
        if(resStrategy != true){
            res.concat(resStrategy);
        }

        if(res.length == 0){
            res = true;
        }

        return res;
    }
};
