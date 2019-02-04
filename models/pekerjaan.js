"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class PekerjaanModel extends Database {

    async addPekerjaan(column,value)
    {
        let data = await this.Insert().Into('pekerjaan')
            .Column(column)
            .Value(value)
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getPekerjaan(user_id)
    {
        let data = await this.Select('*').From('pekerjaan')
            .Where({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }
}

module.exports = { PekerjaanModel }


