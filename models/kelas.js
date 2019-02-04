"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class KelasModel extends Database {



    async getClass(userid)
    {
        let kelas = await this.Select(['mahasiswa_kelas_id','user_id','kelas_id'])
                              .From('mahasiswa_kelas')
                              .Where({column:'user_id',value:userid})
                              .OrderBy('kelas_id')
                              .Desc()
                              .Limit(10)
                              .GetAsync()
        return kelas
    }

    async getDosenKelas(user_id)
    {
        let kelas = await this.Select(['kode_kelas','nama_kelas','nama_ruangan','jam','hari','kelas_id'])
                    .From('kelas')
                    .InnerJoin('ruangan').On({table:'kelas',column:'ruangan_id',value:'ruangan.ruangan_id'})
                    .Where({column:'kelas.user_id',value:user_id})
                    .AndWhere({column:'is_arsip',value:'FALSE'})
                    .OrderBy('kelas_id')
                    .Desc()
                    .Limit(10)
                    .GetAsync()
                    .catch((err) => {
                        console.log(err);
                        
                    })
        return kelas

    }

    async leaveKelas(kode_kelas,user_id)
    {
        let kelas = await this.Select(['kelas_id']).From('kelas')
                                .Where({column:'kode_kelas',value:`'${kode_kelas}'`})
                                .GetAsync()
        kelas = kelas.rows[0].kelas_id
        let update_kelas = await this.Update('mahasiswa_kelas')
                                        .SetColumn({column:'is_leave',value:'TRUE'})
                                        .Where({column:'kelas_id',value:kelas})
                                        .AndWhere({column:'user_id',value:user_id})
                                        .SetAsync()
        return update_kelas
    }

    async getDetailFullKelas(kode_kelas)
    {
        let data = await  this.Select(['nama_lengkap','nama_kelas','nama_ruangan','kode_kelas','semester','hari','kelas_id','jam','kelas.ruangan_id','maksimal_mahasiswa'])
                        .From('kelas')
                        .LeftJoin('biodata').On({table:'kelas',column:'user_id',value:'biodata.user_id'})
                        .InnerJoin('ruangan').On({table:'kelas',column:'ruangan_id',value:'ruangan.ruangan_id'})
                        .Where({column:'kode_kelas',value:`'${kode_kelas}'`})
                        .GetAsync()
        if(data.rows[0] != undefined)
        {
            let jam = data.rows[0]['jam'].split(":")
            data.rows[0]['jam'] = jam[0]
            data.rows[0]['menit'] = jam[1]
        }
        
        return data
    }
    async getDetailFullKelasByKelasId(kelas_id)
    {
        let data = await  this.Select(['nama_lengkap','nama_kelas','nama_ruangan','kode_kelas','semester','hari','kelas_id','jam','kelas.ruangan_id','maksimal_mahasiswa'])
                        .From('kelas')
                        .LeftJoin('biodata').On({table:'kelas',column:'user_id',value:'biodata.user_id'})
                        .InnerJoin('ruangan').On({table:'kelas',column:'ruangan_id',value:'ruangan.ruangan_id'})
                        .Where({column:'kelas_id',value:`'${kelas_id}'`})
                        .GetAsync()
        if(data.rows[0] != undefined)
        {
            let jam = data.rows[0]['jam'].split(":")
            data.rows[0]['jam'] = jam[0]
            data.rows[0]['menit'] = jam[1]
        }
        
        return data
    }

    async getDetailFullKelasWithUserId(kode_kelas,user_id)
    {
        let data = await  this.Select(['nama_kelas','nama_ruangan','kode_kelas','semester','hari','kelas_id','jam','kelas.ruangan_id','maksimal_mahasiswa'])
                        .From('kelas')
                        .InnerJoin('ruangan').On({table:'kelas',column:'ruangan_id',value:'ruangan.ruangan_id'})
                        .Where({column:'kode_kelas',value:`'${kode_kelas}'`})
                        .AndWhere({column:'kelas.user_id',value:`'${user_id}'`})
                        .GetAsync()
        let jam = data.rows[0]['jam'].split(":")
        data.rows[0]['jam'] = jam[0]
        data.rows[0]['menit'] = jam[1]
        return data
    }

    async insertKontrakPerkuliahan(kelas_id)
    {
        console.log(kelas_id);
        
        await this.Insert().Into('kontrak_perkuliahan').Column(['kelas_id','manfaat_perkuliahan','tujuan_perkuliahan','deskripsi_perkuliahan','created_at'])
                        .Value([kelas_id,"''","''","''",'NOW()'])
                        .Set((err,result)=>{
                            if(err) console.log(err);
                            
                        })
    }

    async getDetailKontrakPerkuliahan(kelas_id)
    {
       
            let data = await this.Select(['manfaat_perkuliahan','deskripsi_perkuliahan','tujuan_perkuliahan','referensi_perkuliahan'])
                                .From('kontrak_perkuliahan')
                                .Where({column:'kelas_id',value:kelas_id})
                                .GetAsync().catch((err) => {
                                    console.log(err);
                                })

            if(data.rows[0] == undefined)
            {
                this.insertKontrakPerkuliahan(kelas_id).catch((err) => {
                    console.log(err); 
                })

                data = await this.Select(['manfaat_perkuliahan','deskripsi_perkuliahan','tujuan_perkuliahan'])
                                .From('kontrak_perkuliahan')
                                .Where({column:'kelas_id',value:kelas_id})
                                .GetAsync().catch((err) => {
                                    console.log(err);
                                })
            }

            
        
        
        return data
        
    }

    async getkelasMahasiswa(user_id){
        let data = await this.Select(['nama_kelas','kode_kelas','semester','jam','hari','nama_ruangan','kelas.kelas_id'])
            .From('mahasiswa_kelas')
            .InnerJoin('kelas').On({table:'mahasiswa_kelas',column:'kelas_id',value:'kelas.kelas_id'})
            .InnerJoin('ruangan').On({table:'kelas',column:'ruangan_id',value:'ruangan.ruangan_id'})
            .Where({column:'mahasiswa_kelas.user_id',value:user_id})
            .AndWhere({column:'is_arsip',value:'FALSE'})
            .AndWhere({column:'is_leave',value:'FALSE'})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getKelasByHariAndUserId(hari,user_id)
    {
        let data = await this.Select(['nama_kelas','kode_kelas','semester','jam','hari','nama_ruangan'])
            .From('mahasiswa_kelas')
            .InnerJoin('kelas').On({table:'mahasiswa_kelas',column:'kelas_id',value:'kelas.kelas_id'})
            .InnerJoin('ruangan').On({table:'kelas',column:'ruangan_id',value:'ruangan.ruangan_id'})
            .Where({column:'mahasiswa_kelas.user_id',value:user_id})
            .AndWhere({column:'is_arsip',value:'FALSE'})
            .AndWhere({column:'hari',value:hari})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getMahasiswaOnline(kelas_id)
    {
        let data = await this.Select(['nomor_induk','nama_lengkap','mahasiswa_online.user_id'])
            .From('mahasiswa_online')
            .LeftJoin('biodata').On({table:'mahasiswa_online',column:'user_id',value:'biodata.user_id'})
            .InnerJoin('users').On({table:'mahasiswa_online',column:'user_id',value:'users.user_id'})
            .Where({column:'kelas_id',value:kelas_id})
            .AndWhere({column:'is_online',value:"'true'"})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async setMahasiswaOffline(user_id)
    {
        let data = await this.Update('mahasiswa_online')
            .SetColumn({column:'is_online',value:'false'})
            .Where({column:'user_id',value:user_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async setMahasiswaOnline(user_id,kode_kelas)
    {
        let data = await this.Select('user_id').From('mahasiswa_online')
            .Where({column:'user_id',value:user_id})
            .AndWhere({column:'kelas_id',value:kode_kelas})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        
        if(data.rows == 0)
        {
            data = await this.Insert().Into('mahasiswa_online')
                .Column(['user_id','kelas_id','is_online','created_at'])
                .Value([user_id,kode_kelas,'true','NOW()'])
                .SetAsync().catch((err) => {
                    console.log(err);
                    
                })
            return data
        }

         data = await this.Update('mahasiswa_online')
            .SetColumn({column:'is_online',value:'true'})
            .Where({column:'user_id',value:user_id})
            .AndWhere({column:'kelas_id',value:kode_kelas})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getMahasiswaByKelasId(kelas_id)
    {
        let data = await this.Select(['users.user_id','nomor_induk','nama_lengkap'])
            .From('mahasiswa_kelas')
            .InnerJoin('users').On({table:'mahasiswa_kelas',column:'user_id',value:'users.user_id'})
            .LeftJoin('biodata').On({table:'users',column:'user_id',value:'biodata.user_id'})
            .Where({column:'kelas_id',value:kelas_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getArsipKelas(user_id)
    {
        let data = await this.Select(['nama_kelas','kode_kelas','nama_ruangan','semester'])
            .From('kelas')
            .LeftJoin('ruangan').On({table:'kelas',column:'ruangan_id',value:'ruangan.ruangan_id'})
            .Where({column:'is_arsip',value:'true'})
            .AndWhere({column:'kelas.user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async deleteKelasByKodeKelasAndUserId(kode_kelas,user_id)
    {
        let data = await this.DeleteFrom('kelas')
            .Where({column:'kode_kelas',value:`'${kode_kelas}'`})
            .AndWhere({column:'user_id',value:user_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async searchArsipKelas(user_id,data)
    {
        data = await this
            .SqlAsync(`
                SELECT nama_kelas , kode_kelas , nama_ruangan , semester
                FROM kelas
                LEFT JOIN ruangan ON kelas.ruangan_id = ruangan.ruangan_id
                WHERE 
                    kelas.user_id = ${user_id} AND nama_kelas ILIKE '%${data}%'  AND is_arsip = true
                OR
                    kelas.user_id = ${user_id} AND kode_kelas ILIKE '%${data}%'  AND is_arsip = true
                LIMIT 10
            `).catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async deleteMateri(data)
    {
        data = await this.DeleteFrom('materi_tugas')
            .Where({column:'kelas_id',value:data.kelas_id})
            .AndWhere({column:'materi_tugas_id',value:data.materi_tugas_id})
            .AndWhere({column:'pertemuan_id',value:data.pertemuan_id})
            .AndWhere({column:'user_id',value:data.user_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getActivityMahasiswa(data)
    {
        data = await this.SqlAsync(`
            SELECT * FROM log_kelas WHERE created_at > NOW() - INTERVAL '1 day' 
                AND
            user_id = ${data.user_id} AND kelas_id = ${data.kelas_id} 
            ORDER BY log_kelas_id DESC
            LIMIT 30 
        `).catch((err) => {
            console.log(err);
            
        })
    return data
    }

    // add ruangan
    async addRuangan(data)
    {
        // console.log(data);
        
        data = await this.Insert().Into('ruangan')
            .Column(['user_id','nama_ruangan','gedung','kapasitas'])
            .Value([data.user_id,`'${data.nama_ruangan}'`,`'${data.nama_gedung}'`,data.kapasitas])
            .SetAsync().catch((err) => {
                console.log(err);
            })
        return data
    }

    async getRuangan(offset)
    {
        let data = await this.SqlAsync(`
            SELECT ruangan_id,nama_ruangan, gedung, kapasitas, created_at
            FROM ruangan
            ORDER BY ruangan_id DESC 
            LIMIT 20 OFFSET ${offset}
        `).catch((err) => {
            console.log(err);
            
        })
        return data
    }


    async deleteRuangan(data)
    {
        data = await this.DeleteFrom('ruangan')
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'ruangan_id',value:data.ruangan_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }


    async searchRuangan(data)
    {
        data = await this.SqlAsync(`
            SELECT nama_ruangan,ruangan_id,gedung, created_at, kapasitas
            FROM ruangan
            WHERE nama_ruangan ILIKE '%${data.search}%'
            ORDER BY ruangan_id DESC 
            LIMIT 10
        `).catch((err) => {
            console.log(err);
            
        })

        return data
    }

}

module.exports = { KelasModel }


