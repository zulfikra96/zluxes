
    const { database } = require('../core/database.js')
    const  argv = require('yargs').argv
    switch(argv.migration)
    {
        case "create":
            database.CreateTable('karyawan')
                    .Fields('karyawan_id')
                        .PrimaryKey()
                        .NotNull()
                    .Timestamp()
                    .Execute()
            break;
        case "drop":
            database.DropTable('karyawan')
                    .Execute()
            break;
    }
    