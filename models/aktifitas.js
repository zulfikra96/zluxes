"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class AktifitasModel extends Database {


    async addAktifitas(data)
    {
         data = await this.Insert()
            .Into('log_kelas')
            .Column(['kelas_id','user_id','aktifitas','created_at'])
            .Value([data.kelas_id,data.user_id,`'${data.aktifitas}'`,'NOW()'])
            .SetAsync().catch((err) => {
                console.log(err);      
            })
        return data
    }

    async addAktivitasUsers(data)
    {
        data = await this.Insert()
            .Into('log_aktivitas')
            .Column(['user_id','aktifitas'])
            .Value([data.user_id,`'${data.aktifitas}'`])
            .SetAsync().catch((err) => {
                console.log(err);      
            })
        return data
    }

    async getAktivitas(offset)
    {
        let data = await this.SqlAsync(`
            SELECT nomor_induk, nama_lengkap, roles, aktifitas, log_aktivitas.created_at
            FROM log_aktivitas
            INNER JOIN users ON log_aktivitas.user_id = users.user_id
            LEFT JOIN biodata ON users.user_id = biodata.user_id
            ORDER BY log_aktivitas_id 
            LIMIT 30 OFFSET ${offset}
        `).catch((err) => {
            console.log(err);
            
        })
        return data
    }

}

module.exports = { AktifitasModel }


