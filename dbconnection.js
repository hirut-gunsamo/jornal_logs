var mysql = require('mysql');

// var connection = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '',
// database: 'TG2019'
// });

var connection = mysql.createPool({
  host: '159.203.3.216',
  user: 'root',
  password: 'root_password',
  database: 'tg',
  port: 33061
});
module.exports = connection;