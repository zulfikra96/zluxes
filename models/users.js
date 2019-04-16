"use strict"
const { Database } = require('../core/database.js')
const rand = require('randomstring')

class UsersModel extends Database {

    async getUser(args = { select:[],where:{column:'',value:''} })
    {
        args = await this.Select(args.select)
            .From('users_manajemen.users')
            .InnerJoin('hrd.karyawan').On({table:'users_manajemen.users',column:'user_id',value:'hrd.karyawan.karyawan_id'})
            .InnerJoin('users_manajemen.role').On({table:'users_manajemen.users',column:'role_id',value:'users.role_id'})
            .Where(args.where)
            .GetAsync().catch((err) => {
                console.log(err);
            })
        return args
    }

    async updateUser(args = { set:'',where:'' })
    {
        let data = await this.Update('users_manajemen.users')
            .SetColumnAll(args.set)
            .Where(args.where)
            .SetAsync().catch((err) => {
                console.log(err);
                
            })
        return data
    }

    async addKaryawan(data)
    {
        let date    = new Date()
        let insert_karyawan
        let year    = date.getFullYear()
        let month   = date.getMonth() + 1
            month   = (month >= 10) ?  month : '0' + month;
            date    = year.toString()+month.toString()
        // console.log(date);
        
        let get_count = await this.SqlAsync(`
            SELECT COUNT(*) AS total_user, LEFT(user_id,6) as user_id FROM users_manajemen.users WHERE LEFT(user_id,6) = '${date}' GROUP BY user_id
        `)
        let total_user = get_count.rowCount + 1
        if(total_user < 10)
        {
            total_user = '00' + total_user
        }else if(total_user < 100)
        {
            total_user = '0' + total_user
        }
        // console.log(total_user);
        let user_id = date+total_user
        console.log(user_id);
        let insert_user = await this.Insert().Into('users_manajemen.users')
            .Columns({
                user_id:user_id,
                role_id:data["role_id"],
                password:data.password,
                user_insert:data["user_insert"],
                user_update:data["user_insert"],
            })
            .Returning()
            .SetAsync()
            
            insert_karyawan = await this.Insert().Into('hrd.karyawan')
            .Columns({
                karyawan_id:user_id,
                nama:data.nama,
                email:data.email,
                alamat:data.alamat,
                desa_id:(data.desa_id == null || data.desa_id == '') ? '' : data.desa_id,
                user_insert:data["user_insert"],
                user_update:data["user_insert"],
            }).SetAsync()
        

        return insert_karyawan
                
    }

    async getKaryawan(data)
    {
        let sql = `
            SELECT ${data.select} FROM users_manajemen.users 
            INNER JOIN hrd.karyawan ON users.user_id = karyawan.karyawan_id
            ${(data.where != null) ? `WHERE ${data.where}` : ''} 
            LIMIT ${data.limit}
            OFFSET ${data.offset}`
        data = await this.SqlAsync(sql).catch((err) => {
            console.log(err);
        }) 
        for (let i = 0; i < data.rows.length; i++) {
            delete data.rows[i].password   
            delete data.rows[i].token   
        }
        return data
    }  
}

module.exports.UserModel = new UsersModel()


