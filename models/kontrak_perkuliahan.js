"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class KontrakPerkuliahanModel extends Database {

    async updateKotrakPerkuliahan(data)
    {
        
        data = await this.Update('kontrak_perkuliahan')
            .SetColumn({column:'manfaat_perkuliahan',value:`'${data[0]}'`})
            .AndSetColumn({column:'deskripsi_perkuliahan',value:`'${data[1]}'`})
            .AndSetColumn({column:'tujuan_perkuliahan',value:`'${data[2]}'`})
            .AndSetColumn({column:'referensi_perkuliahan',value:`'${data[3]}'`})
            .Where({column:'kelas_id',value:data[4]})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
    }

}

module.exports = { KontrakPerkuliahanModel }


