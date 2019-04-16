
const { database } = require('../core/database.js')
const  argv = require('yargs').argv
switch(argv.migration)
{
    case "create":
        database
        .CreateTable('users_manajemen','role')
                .Fields('role_id')
                    .VarcharPrimaryKey(2)
                    .NotNull()
                .Fields('nama_role')
                    .String(12)
                    .NotNull()
                .Log()
                .Execute()
        break;
    case "drop":
        database.DropTable('users_manajemen','role')
                .Execute()
        break;
    case "force-drop":
        database.DropTableCascade('users_manajemen','role')
        .Execute()
        break;
}
    