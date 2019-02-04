const { KelasModel} = require('./models/kelas'); const kelas = new KelasModel()
const { UsersModel } = require('./models/users');const users = new UsersModel()
const { AktifitasModel } = require('./models/aktifitas');const aktifitas = new AktifitasModel()
const { Middleware } = require('./core/middleware')
socket = (socket,io) =>
{

    let md = new Middleware()
    socket.on('mahasiswa-online',async function(kode_kelas){
        // console.log(kode_kelas);
        let kls = await kelas.getDetailFullKelas(kode_kelas).catch((err) => {
            console.log(err);     
        })
        let mahasiswa_online = await kelas.getMahasiswaOnline(kls.rows[0].kelas_id).catch((err) => {
            console.log(err);
            
        })

        io.emit(kode_kelas,mahasiswa_online.rows)
        
    })

    // check offline
    socket.on('offline-kelas', async function(nomor_induk,kode_kelas){
        console.log(nomor_induk);
        let user = await users.getUserByNomorInduk(nomor_induk).catch((err) => {
            console.log(err);
            
        })
        // console.log(user);
        
        user = user.rows[0]
        let kls = await kelas.setMahasiswaOffline(user.user_id).catch((err) => {
            console.log(err);
            
        })
        let kelas_full = await kelas.getDetailFullKelas(kode_kelas).catch((err) => {
            console.log(err);     
        })

        let mahasiswa_online = await kelas.getMahasiswaOnline(kelas_full.rows[0].kelas_id).catch((err) => {
            console.log(err);
            
        })
        console.log("trigger");
        
        io.emit(kode_kelas,mahasiswa_online.rows)
        
    })
    // set mahasiswa online
    socket.on('set-mahasiswa-online',async (data) => {
        // console.log("nomor induk " + nomor_induk);
        let kelas_full = await kelas.getDetailFullKelas(data.kode_kelas).catch((err) => {
            console.log(err);     
        })

        let user = await users.getUserByNomorInduk(data.nomor_induk).catch((err) => {
            console.log(err);
            
        })

        let kls = await kelas.setMahasiswaOnline(user.rows[0].user_id,kelas_full.rows[0].kelas_id)
        
        let mahasiswa_online = await kelas.getMahasiswaOnline(kelas_full.rows[0].kelas_id).catch((err) => {
            console.log(err);
            
        })
        console.log("trigger");
        
        io.emit(data.kode_kelas,mahasiswa_online.rows)

    })

    socket.on('/aktifitas',(data) => {
        md.tokenSocketVerify(data,async function(res){
            let kls = await kelas.getDetailFullKelas(data.kode_kelas).catch((err) => {
                console.log(err);
                return
            })
            if(kls.rowCount == 0)
            {
                return
            }
            data["user_id"] = res.session["user_id"]
            data["kelas_id"] = kls.rows[0].kelas_id

            let log_kelas = await aktifitas.addAktifitas(data).catch((err) => {
                console.log(err);
            })

        },['mahasiswa'])      
    })

    // aktivitas users
    socket.on('/aktivitas/pengguna',(data) => {
        md.tokenSocketVerify(data,async function(res){
            data["user_id"] = res.session["user_id"]
            let log_kelas = await aktifitas.addAktivitasUsers(data).catch((err) => {
                console.log(err);
            })
        },['mahasiswa'])      
      
    })

}


module.exports.socket = socket