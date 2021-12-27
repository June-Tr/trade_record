"use strict";

class connectorCache {

    constructor(){
        // this will need to read from a cached file
        this._cur = 0;
        this._entry = null;
        this._isTrigger = false;
        this._followUp = new Map();
        this._init = {stop:null, target:null};
    }
    
    /**
     * 
     * @param {JSON} orderData the data of a input order, enter by user in the front end
     * @returns formatted JSON that will be sent to the sql connector
     */
    store(orderData){
        //compile the order
        let order = {
            price: orderData.price,
            size: orderData.size,
            time_placement: orderData.placement,
            local_id: this._cur,
            at_time: orderData.structure
        }

        /**
         * check the order status [just-finish, on trade, replace-current-entry]
         */
        // if this is first order
        if(this._entry == null){
            this._entry = order;
            this._isTrigger = false;
            this._followUp = new Map();
        }

        // if this will be replace the non-trigger order.
        if(this._isTrigger == false){
            this._entry = order;
            this._followUp = new Map();
        }

        // if this order is following an entry order
        if(this._isTrigger){
            order.entry_id = this._entry.local_id;
            this._followUp.set(order.price, order);
        }
        this._cur += 1;
        return order;
    }

    trigger(){
        let res = [];
        for(var price of this._init){
            let order = {
                price: price,
                size: this._entry.size,
                time_placement: this._entry.placement,
                local_id: this._cur,
                at_time: this._entry.structure
            }

            res.push(order);
            this._followUp.set(price, order);
        }
        return res;
    }

    isOnTrade(){
        return(this._entry != null && this._isTrigger == false);
    }

    /**
     * 
     * @param {string} price the price of the exist order
     * @returns the cached order detail
     */
    existTrade(price){
        this._entry = null;
        this._isTrigger = null;
        
        let res = this._followUp.get(price);
        this._followUp = null;

        return res;
    }
    
}

module.exports = new connectorCache();