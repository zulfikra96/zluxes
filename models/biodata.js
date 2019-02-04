"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class BiodataModel extends Database {


    async getBiodata(user_id)
    {
        let data = await this.Select('*').From('biodata')
            .Where({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);               
            })
        return data
    }

    async insertBiodata(column,value)
    {
        let data = await this.Insert().Into('biodata')
            .Column(column)
            .Value(value)
            .SetAsync((err) => {
                console.log(err);          
            })
        return data
    }

    async updateBiodata(column,value,user_id)
    {
        let data = await this.Update('biodata')
            .SetColumn({column:`${column}`,value:`'${value}'`})
            .Where({column:'user_id',value:user_id})
            .SetAsync().catch((err) => {
                console.log(err);
            })
        return data
    }
}

module.exports = { BiodataModel }


