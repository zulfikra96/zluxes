"use strict"
const { Database } = require('../core/database.js')


class HasilModel extends Database {


    async getMahasiswaHasil(tugas_id,user_id)
    {
        let sql = `
            SELECT 
                tugas_soal.tugas_soal_id, 
                tugas_soal.tugas_soal_id, 
                jawaban_mahasiswa.soal_jawaban_id AS jawaban_mahasiswa ,
                is_benar, type,grade,
                tugas_soal.soal_jawaban_id AS jawaban_benar 
            FROM jawaban_mahasiswa  
            LEFT JOIN tugas_soal ON jawaban_mahasiswa.tugas_soal_id = tugas_soal.tugas_soal_id 
            WHERE jawaban_mahasiswa.user_id = ${user_id} AND tugas_soal.tugas_id = ${tugas_id}
        `
        let data = await this.SqlAsync(sql)
            .catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getKemampuanMahasiswa(user_id,kemampuan_id)
    {
        let data = await this.Select(['*'])
            .From('kemampuan_mahasiswa')
            .Where({column:'user_id',value:user_id})
            .AndWhere({column:'kemampuan_id',value:kemampuan_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async updateKemampuan(data)
    {
        data = await this.Update('kemampuan_mahasiswa')
            .SetColumn({column:'poin',value:data.poin})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'kemampuan_id',value:data.kemampuan_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getKemampuanKelas(kelas_id)
    {
        let data = await this.Select(['*'])
            .From('kemampuan_kelas')
            .Where({column:'kelas_id',value:kelas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getGamificationByUserId(user_id)
    {
        let data = await this.Select(['*']).From('kemampuan_mahasiswa')
            .InnerJoin('kemampuan').On({table:'kemampuan_mahasiswa',column:'kemampuan_id',value:'kemampuan.kemampuan_id'})
            .Where({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getPenilaianByKelasId(kelas_id)
    {
        let data = await this.Select(['*'])
            .From('penilaian_kelas')
            .Where({column:'kelas_id', value:kelas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }


    async getAbsensi(user_id,kelas_id)
    {
        let data = await this.Select(['*'])
            .From('absensi')
            .Where({column:'kelas_id',value:kelas_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async updateNilaiSikap(user_id,kelas_id,nilai)
    {
        let data = await this.Update('nilai_sikap')
            .SetColumn({column:'nilai',value:nilai})
            .Where({column:'user_id',value:user_id})
            .AndWhere({column:kelas_id,value:kelas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        console.log(data);
        
        return data
    }

    async getPenilaianSikap(user_id,kelas_id)
    {
        let data = await this.Select(['*'])
            .From('nilai_sikap')
            .Where({column:'user_id',value:user_id})
            .AndWhere({column:'kelas_id',value:kelas_id})
            .GetAsync((err) => {
                console.log(err);
                
            })
        return data
    }

    async insertPenilaianSikap(user_id,kelas_id,nilai)
    {
        let data = await this.Insert().Into('nilai_sikap')
            .Column(['user_id','kelas_id','nilai'])
            .Value([user_id,kelas_id,nilai])
            .SetAsync().catch((err) => {
                console.log(err);
                
            })

        return data
    }

   
}

module.exports = { HasilModel }


