"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class AbsensiModel extends Database {


    async getAbsensiByKelasId(kelas_id)
    {
        let array = `   SELECT kelas_id, absensi.user_id, pertemuan_ke, keterangan, nomor_induk FROM absensi INNER JOIN users ON absensi.user_id = users.user_id
                WHERE kelas_id = ${kelas_id} ORDER BY nomor_induk ASC , pertemuan_ke
            `
        let data = await this.SqlAsync(array).catch((err) => {
            console.log(err);
            
        })

            
        return data
    }

    async getAbsensiMahasiswaByKelasId(kelas_id)
    {
        let data = await this.SqlAsync(`SELECT users.user_id,nama_lengkap,nomor_induk FROM users INNER JOIN mahasiswa_kelas ON users.user_id = mahasiswa_kelas.user_id LEFT JOIN absensi ON users.user_id = absensi.user_id LEFT JOIN biodata ON users.user_id = biodata.user_id  WHERE mahasiswa_kelas.kelas_id = ${kelas_id} GROUP BY users.user_id , nama_lengkap, nomor_induk ORDER BY nomor_induk ASC `).catch((err) => {
            console.log(err);
            
        })

        return data
    }

    async checkAbsensiFull(data)
    {
        data = await this.Select('*').From('absensi')
            .Where({column:'kelas_id',value:data.kelas_id})
            .AndWhere({column:'user_id',value:data.user_id})
            .AndWhere({column:'pertemuan_ke',value:data.pertemuan_ke})
            .GetAsync().catch((err) => {
                console.log(errr);
                
            })
        return data
    }



    async insertAbsensi(column,value)
    {
        let data = await this.Insert().Into('absensi')
            .Column(column)
            .Value(value)
            .SetAsync().catch((err) => {
                console.log(err);  
            })
        return data
    }


    async countSiswaInAbsensi(kelas_id)
    {
        let data = await this.SqlAsync(`SELECT user_id FROM absensi WHERE kelas_id = ${kelas_id} GROUP BY user_id`).catch((err) => {
            console.log(err);
            
        })

        return data
    }

    async countSiswaKelas(kelas_id)
    {
        let data = await this.SqlAsync(`SELECT user_id FROM mahasiswa_kelas WHERE kelas_id = ${kelas_id} GROUP BY user_id`).catch((err) => {
            console.log(err);
        })

        return data
    }

    async updateAbsensi(data)
    {
        data = await this.Update('absensi')
            .SetColumn({column:'keterangan',value:`'${data.keterangan}'`})
            .AndSetColumn({column:'created_at',value:'NOW()'})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'pertemuan_ke',value:data.pertemuan_ke})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })

        return data
    }
}

module.exports = { AbsensiModel }


