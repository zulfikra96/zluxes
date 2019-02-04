"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class UsersModel extends Database {

    async getUserByNomorInduk(nomor_induk)
    {
        let data = await this.Select(['nomor_induk','roles','user_id'])
            .From('users')
            .Where({column:'nomor_induk',value:`'${nomor_induk}'`})
            .GetAsync().catch((err) => {
                console.log(err);
            })
            
            return data
    }

    async getUserByNomorIndukAll(nomor_induk)
    {
        let data = await this.Select(['*'])
            .From('users')
            .Where({column:'nomor_induk',value:`'${nomor_induk}'`})
            .GetAsync().catch((err) => {
                console.log(err);
            })
            
            return data
    }

    async updatePassword(new_password, nomor_induk)
    {
        let data = await this.Update('users')
            .SetColumn({column:'password',value:`'${new_password}'`})
            .Where({column:'nomor_induk',value:`'${nomor_induk}'`})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async getFullProfile(user_id)
    {
        let data = await this.SqlAsync(`SELECT nomor_induk, nama_lengkap, roles FROM users
            LEFT JOIN biodata ON users.user_id = biodata.user_id WHERE users.user_id = ${user_id}
        `).catch((err) => {
            console.log(err);
            
        })
        
        return data
    }


    async addVerifikasiDosen(nomor_induk,type)
    {
        let data = await this.Insert().Into(`${type}`)
            .Column(['nomor_induk','created_at'])
            .Value([nomor_induk,'NOW()'])
            .SetAsync().catch((err) => {
                console.log(err);
                
            })   
        return data        
    }

    async checkVerifikasiDosen(nomor_induk,type)
    {
        let data = await this.Select(['nomor_induk'])
            .From(`${type}`)
            .Where({column:'nomor_induk',value:nomor_induk})
            .GetAsync().catch((err) => {
                console.log(err);
                
            })

        if(data.rowCount == 1)
        {
            return true
        }

        return false
    }

    async getDataVerifikasi(type)
    {
        let data = await this.Select(['*'])
            .From(type)
            .OrderBy('nomor_induk')
            .Asc()
            .Limit(10)
            .GetAsync((err) => {
                console.log(err);
                
            })
        return data
    }

    async getDataUsers(role)
    {
        let data = await this.Select(['*'])
            .From('users')
            .LeftJoin('biodata').On({table:'users',column:'user_id',value:'biodata.user_id'})
            .Where({column:'roles',value:`'${role}'`})
            .Limit(20)
            .GetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async deletePekerjaan(data)
    {
        data = await this.DeleteFrom('pekerjaan')
            .Where({column:'user_id',value:data.user_id})
            .AndWhere({column:'pekerjaan_id',value:data.pekerjaan_id})
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }


    async getCountUsers(data)
    {
        data = await this.SqlAsync(`
            SELECT COUNT(*) AS total
                FROM users
            WHERE roles = '${data.role}'

        `).catch((err) => {
            console.log(err);
            
        })

        return data
    }

    async getCountKelas()
    {
        let data = await this.SqlAsync(`
            SELECT COUNT(*) AS total FROM kelas
        `).catch((err) => {
            console.log(err);
            
        })

        return data
    }

    async deleteUsersByUsername(username)
    {
        let data = await this.DeleteFrom('users')
            .Where({column:'nomor_induk',value:`'${username}'`})
            .SetAsync().catch((err) => {
                console.log(err);
                
            }) 
        return data
    }

    async getCountByMonth()
    {
        let data = await this.SqlAsync(`
            SELECT date_trunc('month',created_at) AS month, COUNT(*) AS pendaftar 
            FROM users
            WHERE created_at > now() - interval 1 years
        `)
    }
    
}

module.exports = { UsersModel }


