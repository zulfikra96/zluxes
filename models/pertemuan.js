"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class PertemuanModel extends Database {


    async getPertemuan(kelas_id,user_id)
    {
        let data = await this.Select('kelas_id').From('pertemuan')
            .Where({column:'kelas_id',value:kelas_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })

        return data
    }

    async addPertemuan(column,value)
    {
        let data = await this.Insert().Into('pertemuan')
            .Column(column)
            .Value(value)
            .SetAsync().catch((err) => {
                console.log(er);
                
            })
        return data
    }

    async getPertemuan(kelas_id,user_id)
    {
        let data = await this.Select('*').From('pertemuan')
            .Where({column:'kelas_id',value:kelas_id})
            .OrderBy('created_at')
            .Asc()
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getDetailPertemuan(pertemuan_id)
    {
        let data = await this.Select(['pertemuan_id','kelas_id','deskripsi'])
            .From('pertemuan')
            .Where({column:'pertemuan_id',value:pertemuan_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }
    async getDetailPertemuanUserId(pertemuan_id,user_id)
    {
        let data = await this.Select(['pertemuan_id','kelas_id'])
            .From('pertemuan')
            .Where({column:'pertemuan_id',value:pertemuan_id})
            .AndWhere({column:'user_id',value:user_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async addMateriTugas(data)
    {
        let column = ['kelas_id','user_id','pertemuan_id','deskripsi','path','type','created_at']
        let value  = [data.kelas_id,data.user_id,data.pertemuan_id,`'${data.deskripsi}'`,`'${data.path}'`,`'${data.type}'`,'NOW()']

        data = await this.Insert().Into('materi_tugas')
            .Column(column)
            .Value(value)
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getMateriTugas(kelas_id,pertemuan_id)
    {
        let data = await this.Select('*').From('materi_tugas')
            .Where({column:'kelas_id',value:kelas_id})
            .AndWhere({column:'pertemuan_id',value:pertemuan_id})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async deletePertemuan(data)
    {
         data = await this.DeleteFrom('pertemuan')
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'kelas_id',value:data.kelas_id})
            .AndWhere({column:'pertemuan_id',value:data.pertemuan_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })

        return data
    }

    async updatePertemuan(data)
    {
        data = await this.Update('pertemuan')
            .SetColumn({column:'deskripsi',value:`'${data["deskripsi"]}'`})
            .Where({column:'user_id',value:data["user_id"]})
            .AndWhere({column:'pertemuan_id',value:data["pertemuan_id"]})
            .AndWhere({column:'kelas_id',value:data["kelas_id"]})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }
}

module.exports = { PertemuanModel }


