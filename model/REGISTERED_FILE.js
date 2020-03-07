var db = require('../dbconnection'); //reference of dbconnection.js

//******************************** ************/
//      this is model for location database   //
//*********************************************/
var Registered_file = {
    // select everything from database and return to the server
    get: function (table, callback) {
        return db.query("SELECT * FROM " + table, callback);
    },
    // this function select table row from database based on give row Id 
    getById: function (id, table, callback) {
        return db.query("SELECT * FROM " + table + " WHERE Id=?", [id], callback);
    },
    //this function insert data comes from server to database
    insert: function (values, table, callback) {
        return db.query("INSERT INTO " + table + " SET ?", [values], callback);
    },
    //this query delete data from database which accept row id and table name from request
    delete: function (id, table, callback) {
        return db.query("DELETE FROM " + table + " WHERE Id=?", [id], callback);
    },
    //this query update data on database which accept row id
    update: function (id, table, values, callback) {
        return db.query("UPDATE " + table + " SET ? WHERE Id=?", [values, id], callback);
    }
};
module.exports = Registered_file;