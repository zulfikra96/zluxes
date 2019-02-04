"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class PendidikanModel extends Database {


    async getPendidikan(user_id)
    {
        let data = await this.Select('*').From('pendidikan')
            .Where({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);               
            })
        return data
    }

    async insertPendidikan(column,value)
    {
        let data = await this.Insert().Into('pendidikan')
            .Column(column)
            .Value(value)
            .SetAsync((err) => {
                console.log(err);          
            })
        return data
    }

    async updatePendidikan(column,value,user_id)
    {
        let data = await this.Update('pendidikan')
            .SetColumn({column:`${column}`,value:`'${value}'`})
            .Where({column:'user_id',value:user_id})
            .SetAsync().catch((err) => {
                console.log(err);
            })
        return data
    }
}

module.exports = { PendidikanModel }


