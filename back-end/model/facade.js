"use strict";

const database = require("mysql2/promise");
const bluebird = require('bluebird');

const logger = require("../Util/log");
require('dotenv').config();

/**
 * Facade is act as a translator that take in JSON object and turn it into a valid
 * SQL query
 */
class facade{

    /**
     * establish a connection using value in config
     */
    constructor(){
        this._gate = await database.createConnection(
            {
                host: process.env.HOST,
                user: process.env.USER,
                database: process.env.DB,
                Promise: bluebird
            }
        );
    }

    /**
     * construct a input query to enter all value in json to SQL
     * @param {JSON} insertQuery that has field:value for all of the not null value
     * @param {String } table name of the table
     */
    async insert(insertQuery, table) {
        let query = ``;
        query += `INSERT INTO `;
        
        query += `\`${table}\` (`;
        let val = ` VALUES (`;

        for(var attributeName in insertQuery){
            query += `\`${attributeName}\` ,`;
            val += `${insertQuery[attributeName]} ,`;
        }
        query = query.substring(0,query.length - 1);
        val = val.substring(0,val.length - 1);
        query +=`) ${val});`;
        try{
            await db.execute(query);
        }catch(err){
            logger.writeLog(err, "Database Facade:INSERT");
        }
    }

    /**
     * update an relation the data base using the provided information
     * @param {JSON} updateQuery the value need to be update
     * @param {JSON} keyVal the fieldName:value of all key
     * @param {String} table name of this table in the database
     */
    async update(updateQuery, keyVal, table) {
        let query = ``;

        query += `UPDATE \`${table}\` SET`;

        // add set value
        for(var attribute in updateQuery){
            query += ` \`${attribute}\`=\`${updateQuery[attribute]}\`,`;
        }
        // eliminate the extra comma
        query = query.substring(0, query.length - 1);

        // add selection value
        query += " WHERE";
        for(var attribute in keyVal){
            query +=  ` \`${attribute}\`=\`${keyVal[attribute]}\`,`;
        }
        // eliminate the extra comma
        query = query.substring(0, query.length - 1);

        try{
            await db.execute(query);
        } catch (err){
            logger.writeLog(err, "Database Facade:UPDATE");
        }
    }

    /**
     * delete an entry
     * @param {JSON} deleteQuery the json that has all the key:value
     * @param {String} table name of the table
     * @returns 
     */
    async delete(deleteQuery, table) {
        let query = ``;
        query += `DELETE * FROM \`${table}\` WHERE `;
        for(var attributeName in deleteQuery){
            query += `\`${attributeName}\`=${searchQuery[attributeName]} `;
        }
        //console.log(db);
        let res;
        try{
            res = await db.execute(query);
            return res[0];
        }catch(err){
            logger.writeLog(err, "Database Facade:INSERT");
        }
        
    }
}

module.exports = new facade();