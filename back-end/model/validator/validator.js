"use strict";
require("../validator/strategy/holder");
require("./runningTrade");

class Validator{

    constructor(strategyHolder, typeDict){
        this._strategyHolder = strategyHolder;
        this._typeDict = typeDict;
        this._runningTrade = new runningTrade();
    }

    backupHook(){
        this._runningTrade.backupHook();
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
}