"use strict"

const Cryptr = require('cryptr')
const fs = require('fs')
const { Middleware } = require('../core/middleware')
const crypt         = new Cryptr('1243saT') 

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

}

module.exports.Controller = Controller