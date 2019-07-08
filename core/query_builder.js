const mysql = require('mysql')
const fs    = require('fs')

const config        = fs.readFileSync(__dirname + "/../.env")
const connection    = JSON.parse(config.toString());
let DB = mysql.createConnection(
    
);
console.log(connection)
class QueryBuilder {



    static chooseEngine()
    {

    }

}