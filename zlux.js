var argv = require('yargs').argv
var fs   = require('fs')
function database(name,schema)
{
    if(schema == null) schema = 'public'
    return `
const { database } = require('../core/database.js')
const  argv = require('yargs').argv
switch(argv.migration)
{
    case "create":
        database
        ${(schema != null) ? `.CreateSchema('${schema}')` : ''}
        .CreateTable('${schema}','${name}')
                .Fields('${name}_id')
                    .PrimaryKey()
                    .NotNull()
                .Log()
                .Execute()
        break;
    case "drop":
        database.DropTable('${schema}','${name}')
                .Execute()
        break;
        case "force-drop":
    database.DropTableCascade('${schema}','${name}')
        .Execute()
        break;
}
    `
}
switch(argv.make){
    case "table" :
        fs.writeFile(`${__dirname}/database/${argv.name}.js`,database(argv.name,(argv.schema != undefined)?argv.schema : null),(err) => {
            if(err) {
                console.log(err);
                return
            }
            console.log(`Success create blueprint table ${argv.name}`);  
        })
        break;
}