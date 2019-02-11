const { Pool } = require('pg')
const fs = require('fs')

let connection = fs.readFileSync(`${__dirname}/../.env`)
connection = JSON.parse(connection.toString())

// Database connection
let DB = new Pool(connection.database)

// Database Class
class Database {

    constructor()
    {
        this.table = ''
        this.fieldArray = new Array()
        this.field = `\t`
        this.foreignKey = ``
        this.dropTable = ``
        this.tableName = ''
        this.isSetDataType = false
        this.isDropTable = false
        this.isCreateTable = false
        this.DB = DB
        
    }
    /* 
    * Query builder untuk select data
    * pada table
    * 
    */

    CreateSchema(args)
    {
        DB.query(`CREATE SCHEMA ${args}`,function(err,result){
            if(err) console.log(err);
            
        })

        return this
    }
    Select(args = [])
    {
        this.field = `SELECT ${args} `
        return this
    }
    
    From(args)
    {
        this.field += `FROM ${args}`
        // console.log(this.field);
        
        return this
    }

    Where(args = {column:'',value:''})
    {
        this.field += ` WHERE ${args.column} = ${args.value}`

        return this
    }

    Columns(obj)
    {
        let column = []
        let value = []

        for (const key in obj) {
            column.push(key)
            if(isNaN(obj[key]))
            {
                value.push(`'${obj[key]}'`)
            }else{
                value.push(obj[key])

            }
        }

        this.field += `(${column}) VALUES(${value})`
        return this

    }

    SqlWhere(args)
    {
        this.field += ` WHERE ${args} `

        return this
    }

    AndWhere(args = {column:'',value:''})
    {
        this.field += ` AND  ${args.column} = ${args.value}`
        return this
    }

    LeftJoin(table)
    {
        this.field += ` LEFT JOIN ${table} `

        return this
    }

    RightJoin(table)
    {
        this.field += ` RIGHT JOIN ${table} `

        return this
    }

    On(args = { table:'', column:'',value:'' })
    {
        this.field += ` ON ${args.table}.${args.column} =  ${args.value}`

        return this
    }



    InnerJoin(table)
    {
        this.field += ` INNER JOIN ${table} `

        return this
    }

    GroupBy(args)
    {
        this.field += ` GROUP BY ${args} `
        return this
    }

    OrderBy(args)
    {
        this.field += ` ORDER BY ${args} `
        return this
    }
    NextOrderBy(args)
    {
        this.field += ` , ${args} `
        return this
    }

    Desc()
    {
        this.field += ` DESC `
        return this
    }

    Asc()
    {
        this.field += ` ASC `
        return this
    }

    Get(callback)
    {
        // console.log(this.field);
        
        DB.query(this.field,function(err,result){
            
             callback(err,result)
        })

        return this
    }

    GetAsync()
    {
        let _this = this
        // console.log(this.field);
        
        var promises = new Promise(function(res,rej){
            DB.query(_this.field,function(err,result){
                if(err){
                    console.log(err);
                //    return rej(err)
                }
                res(result)
           })
        })

        return promises
    }

    DeleteFrom(table)
    {
        this.field = ` DELETE FROM ${table}`
        return this
    }

    Insert()
    {
        this.field = `INSERT `

        return this
    }

    Update(table)
    {
        this.field = `UPDATE ${table} SET`

        return this
    }

    SetColumn(args = {column:'',value:0})
    {
        this.field += ` ${args.column} = ${args.value} `

        return this
    }

    AndSetColumn(args = {column:'',value:0})
    {
        this.field += `, ${args.column} = ${args.value} `

        return this
    }



    Into(args)
    {
        this.field += ` INTO ${args} `
        return this
    }

    Column(args)
    {
        this.field += `(${args})`
        return this
    }

    Value(...args)
    {
        this.field += ` VALUES(${args})`
        return this
    }

    Returning()
    {
        this.field += ` RETURNING * `
        return this
    }




    Set(callback)
    {
        console.log(this.field);
        // return
        

        DB.query(this.field,function(err,result){
            
            if(callback) callback(err,result)
        })

        return this
    }

    SetAsync()
    {
        // console.log(this.field)
        let _this = this
       let db = new Promise(function(res,rej){
            DB.query(_this.field,function(err,result){
                if(err){
                    console.log(err);
                    
                    return rej(err)
                }
                res(result)
            })
       }) 

       return db
    }
    
    CreateTable(schema,args)
    {
        let create = ''
        if (schema != undefined || schema != null) {
             create = `CREATE TABLE ${schema}.${args}`
        }else{
             create = `CREATE TABLE ${args}`
        }
        this.isCreateTable = true
        this.tableName = args
        this.table = create
        return this
    }

    DropTable(schema,args)
    {
        if(schema != undefined || schema != null )
        {
            this.dropTable = `DROP TABLE ${schema}.${args}`
            
        }else{
            this.dropTable = `DROP TABLE ${args}`
        }
        this.tableName = args
        this.isDropTable = true
        
        
        return this
    }

    

    Fields(args)
    {
         this.field = `\n \t${args}`

         return this
    }

    /* tipe data untuk varchar
    data type for varchar */

    String(args)
    {
        let type = ` VARCHAR(${args}) `
        this.field += type
        this.isSetDataType = true
        return this
    }

    Text(args)
    {
        let type = ` Text `
        this.field += type
        this.isSetDataType = true
        return this
    }

    DateTime()
    {
        let type = ` TIMESTAMP   `
        this.field += type
        this.isSetDataType = true
        return this
    }

    Date()
    {
        let type = ` DATE   `
        this.field += type
        this.isSetDataType = true
        return this
    }

    SmallInt()
    {
        let type = ` SMALLINT   `
        this.field += type
        this.isSetDataType = true
        return this
    }

    Float()
    {
        let type = ` FLOAT   `
        this.field += type
        this.isSetDataType = true
        return this
    }

    /* tipe data untuk char
    data type for char */

    Char()
    {
        let type = ` CHAR(${args}) `
        this.field += type
        this.isSetDataType = true
        return this
    }

    /* tipe data untuk int
    data type for int */

    Integer(args)
    {
        let type = ` INT `
        this.field += type
        this.isSetDataType = true
        return this
    }

    Time()
    {
        let type = ` TIME `
        this.field += type
        this.isSetDataType = true
        return this
    }

    Boolean()
    {
        let type = ` BOOLEAN `
        this.field += type
        this.isSetDataType = true
        return this
    }

    BigInteger()
    {
        let type = ` BIGINT `
        this.field += type
        this.isSetDataType = true
        return this
    }

    NotNull()
    {
        
        this.field += ` NOT NULL`
        this.fieldArray.push(this.field)
        return this
    }

    Null()
    {
        this.field += ` `
        this.fieldArray.push(this.field)
        return this
    }

    ForeignKeys(key)
    {
        let fg = ` \n \tFOREIGN KEY (${key})`
        this.foreignKey = fg
        this.field = this.foreignKey
        this.key = key
        return this
    }

    PrimaryKey()
    {
        this.field += ` SERIAL PRIMARY KEY  `
     
        return this
    }

    VarcharPrimaryKey(value)
    {
        this.field += ` VARCHAR(${value}) PRIMARY KEY  `
     
        return this
    }
    Unique()
    {
        this.field += ` UNIQUE `
     
        return this
    }

    References(table)
    {
         this.field += ` \n \t \t REFERENCES ${table}(${this.key}) ` 
         return this
    }

    ReferencesColumn(table,column)
    {
        this.field += ` \n \t \t REFERENCES ${table}(${column}) ` 
         return this
    }

    OnDeleteCascade()
    {
        
        this.field += `\n \t \t ON DELETE CASCADE`
        this.fieldArray.push(this.field)
        return this
    }

    OnUpdateCascade()
    {
        this.field += `\n \t \t ON UPDATE CASCADE`
        this.fieldArray.push(this.field)
        return this
    }

    Timestamp()
    {
        this.field = `\n\tcreated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
        this.fieldArray.push(this.field)

        return this
    }


    Log()
    {
        this.field = `\n\tcreated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        user_insert VARCHAR(40), user_update VARCHAR(40) `
        this.fieldArray.push(this.field)
        return this
    }

    Sql(sql,callback)
    {
        DB.query(sql,function(err,result){
            
            if(callback) callback(err,result)
        })
    }

    SqlAsync(sql,callback)
    {
        let promise = new Promise((resolve,reject) => {
            DB.query(sql,function(err,result){
               
                if(err){
                    return reject(err)
                }
                return resolve(result)
            })
        })
        return promise
    }

    Limit(args)
    {
        this.field += ` LIMIT ${args} `
     
        return this
    }

    Execute()
    {
        
        let db = ``
        if(this.table != '')
        {
            db = this.table + `(${this.fieldArray});`
            // console.log(`success create table ${this.tableName}`);
            
        }else if(this.dropTable != ''){
            db = this.dropTable

        }
        // return db
        // console.log(db);
        setTimeout(() => {
            DB.query(db,(err,result) => {
                if(err)
                {
                    (this.isSetDataType) ? "" : console.log("\x1b[31m",`the data type of ${this.tableName} is not define`);
                    
                    console.log("ERROR" + err);
                    return   
                } 
                
                if(this.isCreateTable)
                {
                    console.log(`success create table ${this.tableName}`);
    
                }else{
                    console.log(`success drop table ${this.tableName}`);
                    
                }
    
                // console.log(result);
                
            })
        },1000)
        
    }

}

let database = new Database()

module.exports = { database,Database }
