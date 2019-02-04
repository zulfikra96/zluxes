"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class NotifikasiModel extends Database {

    async getNotifikasiByUserId(user_id)
    {
        let data = await this.Select(['*'])
            .From('notifikasi')
            .Where({column:'user_id',value:user_id})
            .OrderBy('created_at')
            .Desc()
            .Limit(30)
            .GetAsync().catch((err) => {
                console.log(err);
            })

        return data
    }

    async addNotifikasi(data)
    {
        data = await this.Insert().Into('notifikasi')
            .Column(['user_id','deskripsi','link','created_at','is_read'])
            .Value([data.user_id,`'${data.deskripsi}'`,`'${data.link}'`,'NOW()','false'])
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async setReadNotifikasi(user_id)
    {
        let data = await this.Update('notifikasi')
            .SetColumn({column:'is_read',value:'true'})
            .Where({column:'user_id',value:user_id})
            .Returning()
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }
}

module.exports = { NotifikasiModel }


