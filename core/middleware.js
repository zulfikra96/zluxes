const Cryptr = require('cryptr')
const fs  = require('fs')
const { database } = require('./database')


const cert = fs.readFileSync(`${__dirname}/../.privatekey`).toString()


class Middleware extends Cryptr {

    constructor(table_verify)
    {
        super(cert)
        this.table_verify = table_verify
    }

    tokenSocketVerify(data,callback,role)
    {
        if(data.token == undefined)
        {
            return
        }
        let token = data.token
        database.Select(this.table_verify)
                .From('users')
                .Where({column:'token',value:`'${token}'`})
                .Get(function(err,result){
                    if(err) console.log(err);
                    if(result.rows[0] != undefined){
                        let error = 0
                        for (let i = 0; i < role.length; i++) {
                            if(role[i] != undefined && role[i] != result.rows[0].roles)
                            {
                                error++
                            }
                            
                        }
                        
                        if(error == role.length)
                        {
                            
                            return 'token salah'
                        }
                        
                        if(callback) 
                        {
                            delete result.rows[0].token
                            callback({session:result.rows[0]})
                            return
                        }
                        
                       
                        
                        return
                    }
                    return
                })

    }

    tokenVerify(req,res,callback,role)
    {
        let _token = req.headers._token
        if(!_token)
        {
            res.status(400)
                .json({
                    Authorization:'undifined',
                    success:false,
                    status:400
                })
                return
        }      

        if(!Array.isArray(role))
        {
            role = [`${role}`]
        }
        
        database.Select(this.table_verify)
                .From('users')
                .LeftJoin('biodata').On({table:'users',column:'user_id',value:'biodata.user_id'})
                .Where({column:'token',value:`'${_token}'`})
                .Get(function(err,result){
                    if(err) console.log(err);
                    if(result.rows[0] != undefined){
                        let error = 0
                        for (let i = 0; i < role.length; i++) {
                            if(role[i] != undefined && role[i] != result.rows[0].roles)
                            {
                                error++
                            }
                            
                        }
                        
                        if(error == role.length)
                        {
                            res.status(400)
                                .json({
                                    Authorization:'undifined'
                                })
                            return
                        }
                        
                        if(callback) 
                        {
                            delete result.rows[0].token
                            callback({session:result.rows[0]})
                            return
                        }
                        
                        res.end()
                        
                        return
                    }

                    res.status(400)
                        .json({
                            Authorization:'undifined'
                        })
                        return
                })

    }

    encryptHash(args)
    {
        let enc = this.encrypt(args)

        return enc
    }

    decryptHash(args)
    {
        let enc = this.decrypt(args)
        return enc
    }

    createToken(json)
    {
        json = this.jsonEncodeToString(json)
        let encryptString = this.encryptHash(json)

        return encryptString
    }

    verifyToken(string)
    {
        string = this.decryptHash(string) 
        string = this.stringDecodeToJson(string)

        return string
    }

    

    jsonEncodeToString(args)
    {
        let encode = ''

        for (const key in args) {

            if(typeof args[key] === 'string')
            {
                if(args[key].indexOf(' ') > -1)
                {
                    args[key] = args[key].replace(/ /g,'%')
                }
            }
            
        encode += key +'='+args[key]+'&'
        }
        encode = encode.slice(0,-1)    
        return encode
    }

    stringDecodeToJson(args)
    {
        let decode = args.split('&')
        let changChar = []
        let changeToObj = {}

        for (let i = 0; i < decode.length; i++) {
            changChar[i] = decode[i].replace("=",":")     
        }

        for (let o = 0; o < changChar.length; o++) {
            changeToObj[changChar[o].split(':')[0]] = changChar[o].split(':')[1]
            
        }

        for (const key in changeToObj) {
            console.log();

            if(typeof changeToObj[key] == 'string')
            {
                changeToObj[key] = changeToObj[key].replace(/%/g,' ')
            }

            if(!isNaN(changeToObj[key]))
            {
                changeToObj[key] = parseFloat(changeToObj[key])
            }

            if(changeToObj[key] == 'true')
            {
                changeToObj[key] = true
            }else if(changeToObj[key] == 'false'){
                changeToObj[key] = false
            }
            
        }

        return changeToObj
        
    }

}






module.exports = { Middleware  }
