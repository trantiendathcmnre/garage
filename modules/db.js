var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'db_garage'
  });

  // var MyAppModel = mysqlModel.createConnection({
  //   host     : 'khoanamysql.mysql.database.azure.com',
  //   port:3306,
  //   user     : 'khoanamysql@khoanamysql',
  //   password : 'Vothoaimai@',
  //   database : 'da',
  //   ssl:false
  // });
module.exports=MyAppModel;
