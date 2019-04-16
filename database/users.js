const { database } = require('../core/database')
const  argv = require('yargs').argv
switch(argv.migration)
{
    case "create":
         database.CreateSchema('users_manajemen')
         .CreateTable('users_manajemen','users')
                .Fields('user_id')
                    .VarcharPrimaryKey(9)
                    .NotNull()
                .Fields('role_id')
                    .String(9)
                    .NotNull()
                .ForeignKeys('role_id')
                    .ReferencesColumn('users_manajemen.role','role_id')
                    .OnUpdateCascade()
                .Fields('password')
                    .String('80')
                    .Null()
                .Fields('token')
                    .Text()
                    .Null()
                .Log()
                .Execute()               
        break;
    case "drop":
        database.DropTable('users_manajemen','users')
                .Execute()  
        break;
}

return
