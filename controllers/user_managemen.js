const { Controller } = require('./controller')
const { Middleware } = require('../core/middleware')
const fs = require('fs')
const u_model = require('../models/users').UserModel
class UserManajemen extends Controller{
    constructor()
    {
        super()
        this.users = u_model
        this.md = new Middleware(null)
    }
    async login(req,res)
    {
        let data = req.body
        let _this = this
        let password
        let users = await this.users.getUser({select:['user_id','email','password','role'],where:{column:'email',value:`'${data.email}'`}})
            .catch((err) => {
                console.log(err);
                return _this.error(res,"maaf ada sesuatu yang salah")
            })
        if(users.rowCount == 0)
        {
            return this.error(res,"maaf email anda salah")
        }
        users = users.rows[0]
        console.log(users);
        try {
            password = this.decrypt(users.password)  
        } catch (error) {
            return this.error(res,"maaf ada sesuatu yang salah")
        }
        if(password != data["password"])
        {
            return this.error(res,"maaf password anda salah")
        }
        delete users["password"]
        let token = this.md.createToken(users)
        let update_token = await this.users.updateUser({set:`token = '${token}'`,where:{column:'user_id',value:`'${users["user_id"]}'`}})
            .catch((err) => {
                console.log(err);          
                return res.status(402).json({
                    message:'maaf ada sesuatu yang salah',
                    success:false
                })           
            })
        if(update_token.rowCount > 0)
        {
            return res.json({
                token:token
            })
        }
        return this.error(res,"maaf ada sesuatu yang salah")      
    }
    async addKaryawan(req,res,session)
    {
        let data = req.body 
        let insert_karyawan 
        let _this = this
            data["user_insert"] = session.nama
            data["password"] = this.encryp(data["password"])
        if(session.role != 'superusers')
        {
            return res.status(402).json({
                authorization:'undefined'
            })
        }
        insert_karyawan = await this.users.addKaryawan(data).catch((err) => {
            // console.log(err.code);
            if(err.code ==  '23505')
            {
                return _this.error(res,"maaf email tidak boleh sama dengan email yang lain")
            }
            return _this.error(res,"maaf ada sesuatu yang salah")
        })
        if(insert_karyawan.rowCount > 0)
        {
            return this.success(res,"berhasil menambahkan karyawan")
        }
        return this.error(res,"maaf ada sesuatu yang salah")  
    }
    async getKaryawan(req,res,session)
    {
        let params = req.params
        let karyawan
        if(params.limit == 'null') params.limit = 30 
        if(params.offset == 'null') params.offset = 0
        if(params.select == 'null') params.select = ['*']
        else if(params.select != 'null' && params.select.indexOf(',') != -1)
        {
           params.select = params.select.split(',') 
        }
        if(params.where == 'null') params.where = null
        else{
            params.where = this.removeCharAndConcateStringForSql(params.where,'&')
        }
        try {
            karyawan = await this.users.getKaryawan(params).catch((err) => {
                console.log(err);
                return res.status(402)({
                    message:'maaf ada sesuatu yang salah',
                    success:false
                })
            })
        } catch (error) {
            return res.status(402).json({
                message:'maaf ada sesuatu yang salah',
                success:false
            })
        }
        return res.json(karyawan.rows)    
    }
    async getProfilePhoto(req,res,session)
    {
        if(!fs.existsSync(`${__dirname}/../storage/${session.role}`))
        {
            fs.mkdirSync(`${__dirname}/../storage/${session.role}`)
        }

        if(!fs.existsSync(`${__dirname}/../storage/${session.role}/${session.user_id}`))
        {
            fs.mkdirSync(`${__dirname}/../storage/${session.role}/${session.user_id}`)
        }

        if(!fs.existsSync(`${__dirname}/../storage/${session.role}/${session.user_id}/profile`))
        {
            fs.mkdirSync(`${__dirname}/../storage/${session.role}/${session.user_id}/profile`)
        }
        
        if(!fs.existsSync(`${__dirname}/../storage/${session.role}/${session.user_id}/profile/photo`))
        {
            fs.mkdirSync(`${__dirname}/../storage/${session.role}/${session.user_id}/profile/photo`)
        }
        if(!fs.existsSync(`${__dirname}/../storage/${session.role}/${session.user_id}/profile/photo/user.jpg`))
        {
            let img = fs.readFileSync(`${__dirname}/../storage/default/user.png`)
            res.writeHead(200,{
                "Content-Type":"image/png"
            })
            return res.end(img,'binary')
        }
    }
}


exports.UserManajemen = new UserManajemen()