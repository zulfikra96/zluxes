"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')
const { Controller } = require('../controllers/controllers')
class KelasModel extends Database {

    async createKelas(column,value)
    {
        let kelas =   await this.Insert().Into('kelas')
                        .Column(column)
                        .Value(value)
                        .SetAsync()
        return kelas
    }

   

}

module.exports = { KelasModel }


