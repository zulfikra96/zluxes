"use strict"
const Cryptr = require('cryptr')
const fs = require('fs')
const { Middleware } = require('../core/middleware')
const crypt         = new Cryptr('1243saT') 
const { database } = require('../core/database')
const activity_model = require('../models/activity').ActivityModel
const moment = require('moment')
class Controller {
    constructor() {
    }
    encryp(plainText)
    {
        let chiperText = crypt.encrypt(plainText)
        return chiperText.toString()
    }
    decrypt(chipperText)
    {
        let plainText = crypt.decrypt(chipperText)
        return plainText.toString()
    }
    print(args)
    {
        return console.log(args)
    }
    error(res,message)
    {
        return res.status(402).json({
            message:message,
            success:false
        })
    }
    success(res,message)
    {
        return res.json({
            message:message,
            success:true
        })
    }
    validation(obj,validations)
    {
        let promises;
        let errornum = 0;
        let errormsg = new Object()
        for (const key in obj) {
            if(validations[key])
            {
                errormsg[key] = []   
                if(typeof validations[key].max_length == 'number')
                {
                    if(obj[key].length > validations[key].max_length ) errornum += 1, errormsg[key].push(`Max ${validations[key].max_length} Character`)
                }

                // console.log(typeof validations[key].type)
                if(typeof validations[key].type != 'number' || typeof validations[key].type != 'string')
                {
                    if(typeof obj[key] != validations[key].type ) errornum += 1, errormsg[key].push(`Tipe input harus ${validations[key].type}`)
                }
            }
        }

        return new Promise(function(resolve,reject){
            if(errornum){
                return reject(errormsg)
            }

            resolve("success")
        })
    }
    concateStringWhiteSpace(string,character)
    {
        string = string.split(' ')
        let name = ''

        for (let i = 0; i < string.length; i++) {
            string[i] = string[i].replace(/<(?:.|\s)*?>/g, "")
            if(i != string.length - 1)
            {
                name += string[i] + '-'
            }else{
                name += string[i]
            }
        }   

        name

        return name
        
    }
    removeCharAndConcateStringForSql(string,char)
    {
        let where = ''
        string = string.split(char) 
            for (let i = 0; i < string.length; i++) {
                if(string.length - 1 == i)
                {
                    if(string.indexOf('LIKE') != -1)
                    {
                        where += `'%${string[i]}%' `
                    }else{
                        if(string[i] == 'false' || string[i] == 'true'){
                            where += string[i].toUpperCase()
                        }else if(string[i] == 'null' )
                        {
                            where += string[i].toUpperCase()
                        }
                        else{
                            where += `'${string[i]}' `
                        }
                    }
                }else{
                    where += string[i] + ' '
                }
            }
        string = where
        return string
    }
    async addActivity(data)
    {
        let add = await activity_model.addActivity(data).catch((err) => console.log(err))
    }
    async tableNumber(table)
    {
        table = await database.Select(['COUNT(*) AS table_count']).From(table).GetAsync().catch((err) => console.log(err))
        table = parseInt(table.rows[0]["table_count"])
        let count = table + 1 
        return count
    }
    async tableNumber1Zero(table, addchar)
    {
        table = await database.Select(['COUNT(*) AS table_count']).From(table).GetAsync().catch((err) => console.log(err))
        table = parseInt(table.rows[0]["table_count"])
        let count = table + 1 
        if(addchar != undefined){
            addchar += moment().format("MMDDYY")
            addchar += count
        }
        return addchar
    }
    async tableNumber3Zero(table, addchar)
    {
        table = await database.Select(['COUNT(*) AS table_count']).From(table).GetAsync().catch((err) => console.log(err))
        table = parseInt(table.rows[0]["table_count"])
        let count = table + 1 
        if(count < 10) {count = '00' + count}
        else if(count < 100) {count = '0' + count}
        if(addchar != undefined){
            if(addchar == true) addchar = ''
            addchar += moment().format("MMDDYY")
            addchar += count
        }
        if(addchar == undefined) addchar = count
        return addchar
    }
    getInitialName(args)
    {
        let init= ''
        args = args.split(' ')
        for (let i = 0; i < args.length; i++) {
            if(args[i] != '')
            {
                init += args[i][0]
            }
        }
        return init
    }
    checkCountOfInitial(args)
    {
        args = args.split(' ')    
        return args.length
    }
    benchTime()
    {
        console.log("program end time %s",moment().format("hh:mm:ss SSS"))
    }
    async checkColumn(args = { select:Array ,whereSQL:String, table:String, where:{column:String, value:String}})
    {
        let data = await database.Select(args.select).From(args.table)
        if(args.select == undefined) args.select = ['*']
        if(args.whereSQL != undefined)
        {
            data = await data 
            .SqlWhere(args.whereSQL)
        }
        else{
            data = await data
            .Where(args.where)
            
        }
        data = await data.GetAsync().catch((err) => console.log(err))
        if(data.rowCount > 0) return true
        return false
    }
    getDataValidate(data,callback = Function)
    {
        let params = data
        if(params.limit == 'null') params.limit = 30 
        if(params.offset == 'null') params.offset = 0
        if(params.select == 'null') params.select = ['*']
        else if(params.select != 'null' && params.select.indexOf(',') != -1)
        {
           params.select = params.select.split(',') 
        }
        if(params.where == 'null') params.where = null
        else{
            params.where = this.removeCharAndConcateStringForSql(params.where,'&')
        }
        return callback(params)
    }
    changeTimeToReadable(data,obj_name,format)
    {    
        if(typeof data != 'object') return console.error("first parameter must be array or object")
        for (let i = 0; i < data.length; i++) {
            if(data[i][obj_name] == null)
            {
                data[i][obj_name] = null
            }else{
                data[i][obj_name] = moment(data[i][obj_name]).format(format)
            }
        }
        return data
    }
}

module.exports.Controller = Controller