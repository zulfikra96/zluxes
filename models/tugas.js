"use strict"
const { Database } = require('../core/database.js')


class TugasModel extends Database {


    async addTugas(column,value)
    {
        // console.log(column);
        // console.log(value);
        let data = await this.DB.query(`INSERT INTO tugas (${column}) VALUES(${value}) RETURNING * `).catch((err) => {
            console.log(err);
            
        })

        return data
    }

    async addTugasMahasiswa(data)
    {
        data = await this.Insert().Into('tugas_mahasiswa')
            .Column(['user_id','pertemuan_id','tugas_id','keterangan','deadline_time','created_at'])
            .Value([data.user_id,data.pertemuan_id,data.tugas_id,"' '",`'${data.deadline_time}'`,'NOW()'])
            .SetAsync().catch((err) => {
                console.log(err);
                
            })

        return data
    }

    async updateTugasMahasiswa(data)
    {
        data = await this.Update('tugas_mahasiswa')
            .SetColumn({column:'nilai',value:data.nilai})
            .AndSetColumn({column:'keterangan',value:`'${data.keterangan}'`})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async closedTugasMahasiswa(data)
    {
        data = await this.Update('tugas_mahasiswa')
            .SetColumn({column:'is_closed',value:'true'})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async closedTugas(data)
    {
        data = await this.Update('tugas')
            .SetColumn({column:'is_closed',value:'true'})
            .Where({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'pertemuan_id',value:data.pertemuan_id})
            .AndWhere({column:'pertemuan_id',value:data.pertemuan_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return
    }

    async getTugasDetailByTugasId(tugas_id,user_id)
    {
        let data = await this.Select(['*']).From('tugas')
            .Where({column:'tugas_id',value:tugas_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getTugasDetail(tugas_id,pertemuan_id,user_id)
    {
        let data = await this.Select(['*']).From('tugas')
            .Where({column:'tugas_id',value:tugas_id})
            .AndWhere({column:'pertemuan_id',value:pertemuan_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getTugasByTugasId(tugas_id,pertemuan_id)
    {
        let data = await this.Select(['*']).From('tugas')
            .Where({column:'tugas_id',value:tugas_id})
            .AndWhere({column:'pertemuan_id',value:pertemuan_id})
            .GetAsync().catch((err) => {
                console.log();
                
            })
        return data
    }

    async getTugasSoalByTugasSoalId(tugas_soal_id)
    {
        let data = await this.Select(['*'])
            .From('tugas_soal')
            .Where({column:'tugas_soal_id',value:tugas_soal_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getTugasByTugasIdOnly(tugas_id)
    {
        let data = await this.Select(['*']).From('tugas')
            .Where({column:'tugas_id',value:tugas_id})
            .GetAsync().catch((err) => {
                console.log();
                
            })
        return data
    }

    async getTugas(tugas_id,pertemuan_id)
    {
        let data = await this.Select(['*']).From('tugas')
            .Where({column:'tugas_id',value:tugas_id})
            .AndWhere({column:'pertemuan_id',value:pertemuan_id})
            .GetAsync().catch((err) => {
                console.log();
                
            })
        return data
    }

    async updateTugasInformasi(data)
    {
        data = await this.Update('tugas')
            .SetColumn({column:'deskripsi',value:`'${data.deskripsi}'`})
            .AndSetColumn({column:'waktu_pengerjaan',value:data.waktu_pengerjaan})
            .AndSetColumn({column:'is_closed',value:data.is_closed})
            .AndSetColumn({column:'tanggal_tutup',value:`'${data.tanggal_tutup}'`})
            .Where({column:'pertemuan_id',value:data.pertemuan_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .SetAsync().catch((err) => {
                console.log(err);               
            })
        return data
    }

    async updateTugasInfoDeadlineTime(data)
    {
        data = await this.Update('tugas_mahasiswa')
            .SetColumn({column:'deadline_time',value:`'${data.deadline_time}'`})
            .Where({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'user_id',value:data.user_id})
            .GetAsync().catch((err) => {
                console.log(err);               
            })

        return data
    }

    async addSoal(data)
    {
        console.log("trigger");

        data = await this.Insert().Into('tugas_soal')
            .Column(['type','tugas_id','created_at','user_id'])
            .Value([`'${data.type}'`,`'${data.tugas_id}'`,`NOW()`,`'${data.user_id}'`])
            .Returning()
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
            
    }

    async getSoal(data)
    {
        data = await this.Select(['*']).From('tugas_soal')
            .Where({column:'tugas_id',value:data.tugas_id})
            .OrderBy('tugas_soal_id')
            .Asc()
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getSoalMahasiswa(data)
    {
        data = await this.Select(['is_submit','is_nilai','is_benar','tugas_soal.tugas_id','tugas_soal.user_id','soal','tugas_soal.path','type','jawaban_mahasiswa.soal_jawaban_id','grade','tugas_soal.tugas_soal_id','jawaban'])
            .From('tugas_mahasiswa')
            .InnerJoin('tugas_soal').On({table:'tugas_mahasiswa',column:'tugas_id',value:'tugas_soal.tugas_id'})
            .LeftJoin('jawaban_mahasiswa').On({table:'tugas_soal',column:'tugas_soal_id',value:'jawaban_mahasiswa.tugas_soal_id'})
            .Where({column:'tugas_soal.tugas_id',value:data.tugas_id})
            .AndWhere({column:'tugas_mahasiswa.user_id',value:data.user_id})
            .OrderBy('tugas_soal.tugas_soal_id')
            .Asc()
            .GetAsync().catch((err) => {
                console.log(err);
            })
        return data
    }

    async setNilaiJawabanMahasiswa(data)
    {
        data = await this.Update('jawaban_mahasiswa')
            .SetColumn({column:'is_benar',value:`'${data.is_benar}'`})
            .AndSetColumn({column:'is_nilai',value:`'true'`})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_soal_id',value:data.tugas_soal_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async setGradeJawabanMahasiswa(data)
    {
        data = await this.Update('jawaban_mahasiswa')
            .SetColumn({column:'grade',value:data.grade})
            .AndSetColumn({column:'is_nilai',value:`'true'`})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_soal_id',value:data.tugas_soal_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async updateSoal(data)
    {
        data = await this.Update('tugas_soal')
            .SetColumn({column:'soal',value:`'${data.soal}'`})
            .AndSetColumn({column:'soal_jawaban_id',value:data.soal_jawaban_id})
            .AndSetColumn({column:'path',value:`'${data.path}'`})
            .Where({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_soal_id',value:data.tugas_soal_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getDetailSoal(data)
    {
        data = await this.Select(['*'])
            .From('tugas_soal')
            .Where({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'tugas_soal_id',value:data.soal_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getJawabanList(tugas_soal_id)
    {
        let data = await this.Select(['*'])
            .From('soal_jawaban')
            .Where({column:'tugas_soal_id',value:tugas_soal_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async addJawaban(data)
    {
        data = await this.Insert().Into('soal_jawaban')
            .Column(['jawaban','user_id','tugas_soal_id','created_at'])
            .Value([`'${data.jawaban}'`,data["user_id"],data["soal_id"],'NOW()'])
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getListTugas(data)
    {
        data = await this.Select(['*'])
            .From('tugas')
            .Where({column:'kelas_id',value:data.kelas_id})
            .AndWhere({column:'pertemuan_id',value:data.pertemuan_id})
            .OrderBy('tugas_id').Desc()
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }


    async getTugasMahasiswa(data)
    {
        data = await this.SqlAsync(`select deskripsi,tugas.pertemuan_id, tugas.tugas_id, tugas.kelas_id, tugas_mahasiswa.nilai, waktu_pengerjaan, tugas.is_closed from tugas left join tugas_mahasiswa on tugas.tugas_id = tugas_mahasiswa.tugas_id AND  tugas_mahasiswa.user_id = ${data.user_id} WHERE tugas.pertemuan_id = ${data.pertemuan_id} AND tugas.kelas_id = ${data.kelas_id} ORDER BY tugas.tugas_id DESC`)
            .catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getListTugasMahasiswa(kelas_id)
    {
        let data = await this.SqlAsync(`SELECT tugas.deskripsi,pertemuan.pertemuan_id, kode_kelas, pertemuan.kelas_id,tugas_id FROM pertemuan  INNER JOIN tugas ON pertemuan.pertemuan_id = tugas.pertemuan_id INNER JOIN kelas ON pertemuan.kelas_id = kelas.kelas_id WHERE pertemuan.kelas_id = ${kelas_id} AND is_closed = FALSE`)
            .catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getListTugasMahasiswaTugasId(tugas_id)
    {
        let data = await this.Select(['nomor_induk','nama_lengkap','tugas_mahasiswa.user_id','nilai','keterangan'])
            .From('tugas_mahasiswa')
            .LeftJoin('biodata').On({table:'tugas_mahasiswa',column:'user_id',value:'biodata.user_id'})
            .InnerJoin('users').On({table:'tugas_mahasiswa',column:'user_id',value:'users.user_id'})
            .Where({column:'tugas_id',value:tugas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getTugasmahasiswaTugasId(tugas_id,user_id)
    {
        let data = await this.Select('*').From('tugas_mahasiswa')
            .Where({column:'tugas_id',value:tugas_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    

    async createTugasMahasiswa(data)
    {
        data = await this.Insert().Into('tugas_mahasiswa')
            .Column(['user_id','tugas_id','pertemuan_id','is_closed','created_at'])
            .Value([data.user_id,data.tugas_id,data.pertemuan_id,'FALSE','NOW()'])
            .Returning()
            .SetAsync().catch((err) => {
                console.log(err);
                
            })

        return data
    }

    async addJawabanMahasiswa(data)
    {
        let column = ['tugas_id','user_id','tugas_soal_id','jawaban','is_submit','created_at']
        let value = [data.tugas_id,data.user_id,data.tugas_soal_id,`'${data.jawaban}'`,'true','NOW()']

        if(data.soal_jawaban_id != null)
        {
            column.push('soal_jawaban_id')
            value.push(data.soal_jawaban_id)
        }
        if(data.path != null)
        {
            column.push('path')
            value.push(`'${data.path}'`)
        }
        data = await this.Insert().Into('jawaban_mahasiswa')
            .Column(column)
            .Value(value)
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async updateJawabanMahasiswa(data)
    {
        data = await this.Update('jawaban_mahasiswa')
            .SetColumn({column:'soal_jawaban_id',value:data.soal_jawaban_id})
            .AndSetColumn({column:'is_submit',value:`'true'`})
            .AndSetColumn({column:'jawaban',value:`'${data.jawaban}'`})
            .AndSetColumn({column:'path',value:`'${data.path}'`})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'tugas_soal_id',value:data.tugas_soal_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getJawabanMahasiswa(data)
    {
        data = await this.Select(['*']).From('jawaban_mahasiswa')
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_soal_id',value:data.tugas_soal_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getListJawabanMahasiswa(user_id,tugas_id)
    {
        let data = await this.Select(['*']).From('jawaban_mahasiswa')
            .Where({column:'user_id',value:user_id})
            .AndWhere({column:'tugas_id',value:tugas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getKelasByTugasId(tugas_id)
    {
        let data = await this.Select(['*'])
            .From('tugas')
            .Where({column:'tugas_id',value:tugas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getTugasByKelasId(kelas_id)
    {
        let data = await this.Select(['tugas_id','user_id'])
            .From('tugas')
            .Where({column:'kelas_id',value:`'${kelas_id}'`})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getTugasInfoMahasiswa(tugas_id,user_id,pertemuan_id)
    {
        let data = await this.Select(['*'])
            .From('tugas_mahasiswa')
            .Where({column:'tugas_id',value:tugas_id})
            .AndWhere({column:'pertemuan_id',value:pertemuan_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async deleteJawaban(data)
    {
        data = await this.DeleteFrom('soal_jawaban')
            .Where({column:'tugas_soal_id',value:data["tugas_soal_id"]})
            .AndWhere({column:'user_id',value:data["user_id"]})
            .AndWhere({column:'soal_jawaban_id',value:data["soal_jawaban_id"]})
            .SetAsync().catch((err) => {
                console.log(err);               
            })
        return data
    }

    async deleteTugas(data)
    {
        data = await this.DeleteFrom('tugas')
            .Where({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'user_id',value:data.user_id})
            .AndWhere({column:'kelas_id',value:data.kelas_id})
            .AndWhere({column:'pertemuan_id',value:data.pertemuan_id})
            .SetAsync(() => {
                console.log(err);               
            })
        return data
    }


    async getMateriTugas(data)
    {
        data = await this.Select(['deskripsi','path'])
            .From('materi_tugas')
            .Where({column:'kelas_id',value:data.kelas_id})
            .AndWhere({column:'materi_tugas_id',value:data.materi_tugas_id})
            .AndWhere({column:'pertemuan_id',value:data.pertemuan_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }


    async deleteSoal(data){
        data = await this.DeleteFrom('tugas_soal')
            .Where({column:'tugas_soal_id',value:data.soal_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'user_id',value:data.user_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async setIsNilaiSoal(data)
    {
        data = await this.Update('jawaban_mahasiswa')
            .SetColumn({column:'is_nilai',value:'true'})
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'tugas_id',value:data.tugas_id})
            .AndWhere({column:'tugas_soal_id',value:data.tugas_soal_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }
   
}

module.exports = { TugasModel }


