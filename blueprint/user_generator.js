const { Database } = require('../core/database')
const { Controller } = require('../controllers/controller')

class Usergenerator extends Database{

    constructor() {
        super()
        this.controller = new Controller()
    }


    async createSuperUser()
    {
        let users = await this.Insert().Into('users_manajemen.users')
            .Columns({
                user_id:201902001,
                password:this.controller.encryp('cross.network17'),
                role_id:'2',
                user_insert:'system'
            })
            .Returning()
            .SetAsync((err) => {
                console.log(err);
                
            })
        let karyawan = await this.Insert().Into('hrd.karyawan')
            .Columns({
                karyawan_id:201902001,
                email:'admin@cross.net',
                nama:'zulfikra l. abdjul',
                alamat:'semolowaru selatan',
                user_insert:'system',
            }).SetAsync().catch((err) => {
                console.log(err);   
            } )
        

    }

}

let u_generator = new Usergenerator()
u_generator.createSuperUser()