"use strict";

module.exports = class connectorCache {

    constructor(){
        // this will need to read from a cached file
        this._cur = 0;
        this._entry = null;
        this._isTrigger = false;
        this._followUp = new Map();
    }

    store(orderData){
        //compile the order
        let order = {

        }

        /**
         * check the order status [just-finish, on trade, replace-current-entry]
         */
    }

    
}