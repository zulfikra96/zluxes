"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class PenilaianModel extends Database {


    async getPenilaianKelasByKelasIdAndUserId(user_id,kelas_id)
    {
        let data = await this.Select(['*'])
            .From('penilaian_kelas')
            .Where({column:'kelas_id',value:kelas_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getPenilaian(kelas_id)
    {
        let data = await this.Select(['*'])
            .From('penilaian_kelas')
            .Where({column:'kelas_id',value:kelas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async insertPenilaianKelas(data)
    {
        data = await this.Insert().Into('penilaian_kelas')
            .Column(['absensi','sikap','tugas','user_id','kelas_id','created_at'])
            .Value([data.absensi,data.sikap,data.tugas,data.user_id,data.kelas_id,'NOW()'])
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async updatePenilaianKelas(data)
    {
        data = await this.Update('penilaian_kelas')
            .SetColumn({column:'absensi',value:data.absensi})
            .AndSetColumn({column:'tugas',value:data.tugas})
            .AndSetColumn({column:'sikap',value:data.sikap})
            .Where({column:'kelas_id',value:data.kelas_id})
            .AndWhere({column:'user_id',value:data.user_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }
}

module.exports = { PenilaianModel }


