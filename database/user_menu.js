
const { database } = require('../core/database.js')
const  argv = require('yargs').argv
switch(argv.migration)
{
    case "create":
        database.CreateTable('users_manajemen','user_menu')
                .Fields('users_manajemen','user_menu_id')
                    .PrimaryKey()
                    .NotNull()
                .Fields('user_id')
                    .String(10)
                    .NotNull()
                .Fields('menu_id')
                    .Integer(10)
                    .NotNull()
                .ForeignKeys('user_id')
                    .ReferencesColumn('users_manajemen.users','user_id')
                    .OnUpdateCascade()
                .ForeignKeys('menu_id')
                    .ReferencesColumn('users_manajemen.menu','menu_id')
                    .OnUpdateCascade()
                .Log()
                .Execute()
        break;
    case "drop":
        database.DropTable('users_manajemen','user_menu')
                .Execute()
        break;
        case "force-drop":
    database.DropTableCascade('users_manajemen','user_menu')
        .Execute()
        break;
}
    