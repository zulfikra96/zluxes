"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class KemampuanModel extends Database {

    async getKemampuan(kelas_id)
    {
        let data = await this.Select(['kelas_id','nama','persentasi'])
                .From('kemampuan_kelas')
                .InnerJoin('kemampuan').On({table:'kemampuan_kelas',column:'kemampuan_id',value:'kemampuan.kemampuan_id'})
                .Where({column:'kelas_id',value:kelas_id})
                .GetAsync()
        return data
    }
    

    async getKemampuanKelas(kelas_id)
    {
        let kemampuan_data
        let kemampuan_kelas = await this.getKemampuan(kelas_id)

        if(kemampuan_kelas.rows[0] == undefined)
        {
             let data = new Promise((res,rej) => {
             let _this = this
                this.Select(['*']).From('kemampuan').Get( async (err,result) => {
                    for (let i = 0; i < result.rows.length; i++) {
                        this.Insert().Into('kemampuan_kelas')
                                    .Column(['kemampuan_id','persentasi','kelas_id','created_at'])
                                    .Value([result.rows[i].kemampuan_id,50,kelas_id,'NOW()'])
                                    .Set()   
                    }
                    let is_get_data = true;
                    while(is_get_data)
                    {
                        kemampuan_kelas = await _this.getKemampuan(kelas_id)
                        console.log("kemampuan kelas");
                        console.log(kemampuan_kelas);
                        if(kemampuan_kelas.rowCount == 2)
                        {
                            is_get_data = false
                        }
                    }
                    
                    
                    
                    return res(kemampuan_kelas)  
                    
                })
            })   
                        
            return data
        }        
        return kemampuan_kelas;
    }


}

module.exports = { KemampuanModel }


