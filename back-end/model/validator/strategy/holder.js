"use strict";
const logger = require("../../../../utility/log");


class Holder {

    constructor(controller){
        this._strategy = [];
        this._controller = controller;
    }

    /**
     * link the strategy to this holder. It allow an option for bi-directional link
     * @param {Object:strategy} strategy 
     * @param {boolean} NeedInformation flag to indicate that the strategy will need to get extra information
     * @returns 
     */
    register(strategy, NeedInformation){
        if(!strategy["validate"]){
            logger.writeLog("Attempt to register an strategy that is invalid, missing method!!!", "<holder>");
            return;
        }

        // register this handle so that the strategy can request data
        if(NeedInformation == true){
            if(!strategy["request"] || !strategy["link"]){
                logger.writeLog("Attempt to register an strategy that is invalid, missing method!!!", "<holder>");
            }else{
                strategy.link(this);
            }

        }
        this._strategy.push(strategy);
    }

    /**
     * Return A json that contain: {
     *  warningLevel: 0->5 {0 is the greatest}
     *  errorMessage: string
     * }
     * @param {Json} order the information that will be verify
     */
    verify(order){
        returnInfo = [];

        this._strategy.forEach(element => {
            var res = element.validate(order);
            if(res && res != true){
                returnInfo.push(res)
            }
        });
        if(returnInfo.length == 0){
            returnInfo = true;
        }
        return returnInfo
    }

    /**
     * request additional information
     * @param {Json} information additional information that will be pass to front end via controller, information will contain the strategy who request the information
     */
    request(information){
        this._controller(information);
    }
}