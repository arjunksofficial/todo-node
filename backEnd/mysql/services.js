"use strict";

const mysql = require('mysql');
const config = require('../config/development.json');

// Printing dbConfiguration form config/production.json
const dbConfig = config.dbConfiguration;

var con = mysql.createConnection({
    database: dbConfig.dbName,
    host: dbConfig.host,
    password: dbConfig.password,
    user: dbConfig.user
});

var sql = `CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    description TEXT , 
    priority INT NOT NULL, 
    assignee VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL)`;
con.query(sql,function (err,result) {
    if (err) {
        throw err;
    }
});


var service = {
    insertTask: function(obj,callback) {
        con.query("SELECT MAX(id) FROM tasks",function (err,result) {
            if (err) {
                throw err;
            }
            const id = result[0]['MAX(id)'];
            con.query('INSERT INTO tasks VALUES(?,?,?,?,?,?,?)',
            [id+1,obj.name,obj.description,obj.priority,obj.assignee,'todo',obj.date],
            function (err,result) {
                if (err) {
                    throw err;
                }
                callback(err,id);
            });
        });
    
    },
    
    getTasks: function(callback) {
        con.query("SELECT * FROM tasks",function (err,result) {
            if (err) {
                throw err;
            }
            result=JSON.stringify(result);
            callback(err,result);
        });
    },
    
    getTaskById: function(id,callback) {
        con.query(`SELECT * FROM tasks WHERE id=?`,
        id,
        function (err,result) {
            if (err) {
                throw err;
            }
            result=JSON.stringify(result[0]);
            callback(err,result);
        });
    },
    
    updateTask: function(obj,callback) {
        var sql = `UPDATE tasks SET name = ? , description = ? , priority = ? , assignee = ? , status = ? WHERE id = ?`;
        con.query(sql,
            [obj.name,obj.description,obj.priority,obj.assignee,obj.status,obj.id],
            function (err,result) {
            if (err) {
                throw err;
            }
            callback(err,obj.id);
        });
    }
}


module.exports = service;
