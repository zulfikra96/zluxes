var argv = require('yargs').argv
var fs   = require('fs')

function database(name)
{
    return `
    const { database } = require('../core/database.js')
    const  argv = require('yargs').argv
    switch(argv.migration)
    {
        case "create":
            database.CreateTable('${name}')
                    .Fields('${name}_id')
                        .PrimaryKey()
                        .NotNull()
                    .Timestamp()
                    .Execute()
            break;
        case "drop":
            database.DropTable('${name}')
                    .Execute()
            break;
    }
    `
}


switch(argv.make){
    case "table" :
        fs.writeFile(`${__dirname}/database/${argv.name}.js`,database(argv.name),(err) => {
            if(err) {
                console.log(err);
                return
            }
            console.log(`Success create blueprint table ${argv.name}`);  
        })
        break;
}