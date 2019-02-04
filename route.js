const fs = require('fs')
const { cls } = require('./controllers/class')
const { users } = require('./controllers/users')
const home = require('./controllers/mahasiswa/home').Home
const biodata = require('./controllers/biodata').Biodata
const pendidikan = require('./controllers/pendidikan').Pendidikan
const pekerjaan = require('./controllers/pekerjaan').Pekerjaan
const absensi = require('./controllers/absensi').Absensi
const pertemuan = require('./controllers/pertemuan').Pertemuan
const tugas = require('./controllers/tugas').Tugas
const soal = require('./controllers/soal').Soal
const penilaian = require('./controllers/penilaian').Penilaian
const manajemen = require('./controllers/users_management').UsersManagement
const hasil = require('./controllers/hasil').Hasil
const notifikasi = require('./controllers/notifikasi').Notifikasi
const { Database } = require('./core/database')
const { Middleware } = require('./core/middleware')



const route = (app,recaptcha,md) => {

    // search ruangan
    app.post("/api/admin/ruangan/search",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.searchRuangan(req,res,session)
        },['admin'])
    })
    // delete ruangan
    app.delete("/api/admin/ruangan/:ruangan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.deleteRuangan(req,res,session)
        },['admin'])
    })
    // get ruangan
    app.get("/api/admin/ruangan/:offset",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.getRuangan(req,res,session)
        },['admin'])
    })
    // add ruangan
    app.post("/api/admin/ruangan",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.addRuangan(req,res,session)
        },['admin'])
    })
    // delete users
    app.delete("/api/admin/users/:nomor_induk",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.deleteUsersByUsername(req,res,session)
        },['admin'])
    })

    // get aktivitas pengguna
    app.get("/api/admin/aktivitas/:offset",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.getAktivitas(req,res,session)
        },['admin'])
    })

    // get count kelas dashboard
    app.get("/api/admin/dashboard/count/kelas",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.getTotalKelas(req,res,session)
        },['admin'])
    })
    // get count users dashboard
    app.get("/api/admin/dashboard/count/users/:role",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.getTotalUsers(req,res,session)
        },['admin'])
    })
    // delete pekerjaan
    app.delete("/api/profile/pekerjaan/:pekerjaan_id", (req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.deletePekerjaan(req,res,session)
        },['dosen','mahasiswa'])
    })
    // get activity mahasiswa
    app.get("/api/aktivitas/kelas=:kode_kelas/user=:user_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.getActivityMahasiswaToday(req,res,session)
        },['dosen'])
    })
    // delete soal
    app.delete("/api/tugas/tugas=:tugas_id/soal=:soal_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.deleteSoal(req,res,session)
        },['dosen'])
    })
    // done tugas
    app.post('/api/done/:tugas_id',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            hasil.doneTugas(req,res,session)
        },['mahasiswa'])
    })

    // delete materi tugas
    app.delete('/api/kelas/pertemuan/:pertemuan_id/:kode_kelas/:materi_tugas_id',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.deleteMateri(req,res,session)
        },['dosen'])
    })
    // download materi tugas
    app.get('/api/kelas/pertemuan/:pertemuan_id/:kode_kelas/:materi_tugas_id',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.downloadMateri(req,res,session)
        },['dosen','mahasiswa'])
    })

    // search arsip kelas dosen role
    app.post('/api/kelas/arsip/search',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.searchArsipKelas(req,res,session)
        },['dosen'])
    })
    // get arsip kelas
    app.get('/api/kelas/arsip',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.getArsipKelas(req,res,session)
        },['dosen'])
    })

    app.get('/', function(req,res){
        users.main(req,res)
        
    })

    app.all('/api/home',function(req,res){
        md.tokenVerify(req,res)
    })

    // ambil data session for front-end
    app.get('/api/session',function(req,res){
        md.tokenVerify(req,res,function(session){
            res.json(session)
        },['mahasiswa','dosen','admin'])
    })
    // ambil data ruangan
    app.get('/api/ruangan',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.main(req,res,session)
        },'dosen')
    })
    // ambil total data kelas dan mahasiswa
    app.get('/api/total-mahasiswa-kelas',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.getCountKelasMahasiswa(req,res,session)
        },'dosen')
    })
    // ambil data total tugas dan kelas mahasiswa
    app.get('/api/total-tugas-kelas',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.getCountKelasTugas(req,res,session)
        },['mahasiswa'])
    })
    // get list tugas mahasiswa
    app.get('/api/tugas',(req,res) => {
        md.tokenVerify(req,res,function(session){
            tugas.getListTugasMahasiswa(req,res,session)
        },['mahasiswa'])
    })
    app.get('/api/tugas=count',(req,res) => {
        md.tokenVerify(req,res,function(session){
            tugas.getCountTugasMahasiswa(req,res,session)
        },['mahasiswa'])
    })
    // join kelas
    app.post('/api/join-kelas',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.joinKelas(req,res,session)
        },'mahasiswa')
    })
    app.post('/api/add-mahasiswa',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.insertMahasiswaIntoKelas(req,res,session)
        },'dosen')
    })
    // tambah kelas
    app.post('/api/kelas',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.addClass(req,res,session)
        },'dosen')
    })
    // ubah nama kelas
    app.put('/api/kelas',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.updateKelas(req,res,session)
        },'dosen')
    })
    // ubah / update kontrak perkuliahan
    app.put('/api/kontrak-perkuliahan',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.updateKontrakPerkuliahan(req,res,session)
        },'dosen')
    })
    // ambil list kelas
    app.get('/api/kelas-list',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.getListKelas(req,res,session)
        },'dosen')
    })
    app.get('/api/kelas',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.getFullListKelas(req,res,session)
        },'dosen')
    })
    // ambil list kelas mahasiswa
    app.get('/api/kelas-list-mahasiswa',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.getListKelasMahasiswa(req,res,session)
            .catch(function(err){
                console.log(err); 
            })
        },'mahasiswa')
    })
    // ambil kelas detail
    app.get('/api/kelas/:id',function(req,res){
        let _id = req.params.id
        md.tokenVerify(req,res,function(session){
            if(session.session.roles == 'dosen')
            {
                return cls.getDetailKelas(req,res,session,_id)
                
            }
            
            cls.getDetailKelasMahasiswa(req,res,session,_id)

        },['dosen','mahasiswa'])
    })

    app.delete('/api/kelas/:kode_kelas',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.deleteKelas(req,res,session)
        },['dosen'])
    })

    // arsip kelas
    app.post('/api/kelas/arsip',function(req,res){
        md.tokenVerify(req,res,function(session){
            cls.postArsipKelas(req,res,session)
        },'dosen')
    })

    app.post('/api/register',function(req,res){
        recaptcha.verify(req,function(err,data){
            if(err)
            {
                res.json({
                    message:`maaf, anda harus menekan verifikasi captcha`,
                    status:200,
                    success:false
                })
                return
            }
            users.resgisterPost(req,res)

        })
    })

    app.post('/api/login',function(req,res){
        users.loginPost(req,res)
    })

    // Mahaiswa roles
    app.get('/api/kelas',function(req,res){
        md.tokenVerify(req,res,function(session){
            home.getKelas(req,res,session)
        },'mahasiswa')
    })

    app.post('/api/leave',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.leaveKelasMahasiswa(req,res,session)
        },'mahasiswa')
    })

    // dosen only
    app.get('/api/kelas/dosen/:id',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.getDetailFullKelas(req,res,session)
        },['dosen','mahasiswa'])
    })

    


    // alll
    // biodata
    app.put('/api/biodata',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            biodata.update(req,res,session)
        },['dosen','mahasiswa'])
    })

    app.get('/api/biodata',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            biodata.getData(req,res,session)
        },['dosen','mahasiswa'])
    })

    // all
    // pendidikan
    app.put('/api/pendidikan',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            pendidikan.update(req,res,session)
        },['dosen','mahasiswa'])
    })

    app.get('/api/pendidikan',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            pendidikan.getData(req,res,session)
        },['dosen','mahasiswa'])
    })

    // all
    // pekerjaan
    app.post('/api/pekerjaan',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            pekerjaan.addPekerjaan(req,res,session)
        },['dosen','mahasiswa'])
    })
    app.get('/api/pekerjaan',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            pekerjaan.getpekerjaan(req,res,session)
        },['dosen','mahasiswa'])
    })

    //all
    //absensi
    app.get('/api/absensi/:id',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            absensi.getData(req,res,session)
        },['dosen','mahasiswa'])
    })

    app.post('/api/absensi/:id',(req,res)=>{
        md.tokenVerify(req,res,(session) => {
            absensi.addAbsensi(req,res,session)
        },['dosen'])
    })

    // pertemuan
    app.post("/api/pertemuan/:id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.addPertemuan(req,res,session)
        },['dosen'])
    })
    // get list pertemuan
    app.get("/api/pertemuan/:id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.getPertemuan(req,res,session)
        },['dosen','mahasiswa'])
    })
    // get detail pertemuan
    app.get("/api/:kode_kelas/pertemuan/:pertemuan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.getDetailPertemuan(req,res,session)
        },['dosen','mahasiswa'])
    })
    // update pertemuan
    app.put("/api/:kode_kelas/pertemuan/:pertemuan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.updatePertemuan(req,res,session)
        },['dosen'])
    })
    app.get("/api/pertemuan/:id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.getPertemuan(req,res,session)
        },['dosen','mahasiswa'])
    })

    app.delete("/api/pertemuan/:id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.deletePertemuan(req,res,session)
        },['dosen'])
    })

    app.post("/api/pertemuan/:id/materi-tugas",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.addMateriTugas(req,res,session)
        },['dosen'])
    })
    app.get("/api/pertemuan/:id/materi-tugas/:pertemuan",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            pertemuan.getMateriTugas(req,res,session)
        },['dosen','mahasiswa'])
    })

    // buat tugas
    app.post("/api/tugas/:id/:pertemuan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.addTugas(req,res,session)
        },['dosen'])
    })

    // delete tugas
    app.delete("/api/tugas/:kode_kelas/:pertemuan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.deleteTugas(req,res,session)
        },['dosen'])
    })
    // start exam per soal
    app.get("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.getTugasDetail(req,res,session)
        },['dosen','mahasiswa'])
    })
    // image tugas information
    app.get("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/image",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.getTugasDetail(req,res,session)
        },['dosen','mahasiswa'])
    })

    app.get("/api/tugas/kelas=:kode_kelas/pertemuan=:pertemuan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.getTugas(req,res,session)
        },['dosen','mahasiswa'])
    })
    
    app.put("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.editTugasInformasi(req,res,session)
        },['dosen','mahasiswa'])
    })

    // get tugas mahasiswa
    app.get("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/mahasiswa",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.getTugasMahasiswa(req,res,session)
        },['mahasiswa'])
    })

    app.get("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/mahasiswa/soal",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.getSoalMahasiswa(req,res,session)
        },['mahasiswa'])
    })

    app.get("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/mahasiswa/info",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.getTugasInfoMahasiswa(req,res,session)
        },['mahasiswa'])
    })

    //send jawaban mahasiswa  

    app.post("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/mahasiswa/soal",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.sendJawabanMahasiswa(req,res,session)
        },['mahasiswa'])
    })

    app.post("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/start",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.startExam(req,res,session)
        },['mahasiswa'])
    })

    //  penilaian jawaban mahasiswa
    app.get("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/mahasiswa/soal/:user_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.getSoalMahasiswaByUserId(req,res,session)
        },['dosen'])
    })

    app.post("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/mahasiswa/soal/:user_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.setPenilaianMahasiswa(req,res,session)
        },['dosen'])
    })

    app.get("/api/tugas/tugas=:tugas_id/pertemuan=:pertemuan_id/mahasiswa/soal/:user_id/soal=:soal_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.detailJawabanDocument(req,res,session)
        },['dosen'])
    })

    

    // create soal
    app.post("/api/tugas/tugas=:tugas_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            soal.addSoal(req,res,session)
        },['dosen'])
    })

    

    // get list soal
    app.get("/api/tugas/tugas=:tugas_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            soal.getSoal(req,res,session)
        },['dosen','mahasiswa'])
    })
    // update soal
    app.put("/api/tugas/tugas=:tugas_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            soal.updateSoal(req,res,session)
        },['dosen','mahasiswa'])
    })
    // get soal detail
    app.get("/api/tugas/tugas=:tugas_id/soal=:soal_id",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            soal.getDetailSoal(req,res,session)
        },['dosen','mahasiswa'])
    })
    
    app.get("/api/tugas/tugas=:tugas_id/soal=:soal_id/image",(req,res) => {
        soal.getDetailSoalImage(req,res)
    })
    // add jawaban
    app.post("/api/tugas/tugas=:tugas_id/soal=:soal_id/jawaban",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            soal.addJawaban(req,res,session)
        },['dosen'])
    })
    // get jawaban
    app.get("/api/tugas/tugas=:tugas_id/soal=:soal_id/jawaban",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            soal.getJawaban(req,res,session)
        },['dosen','mahasiswa'])
    })

    // delete jawaban
    app.delete("/api/tugas/tugas=:tugas_id/soal=:soal_id/jawaban",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            tugas.deleteJawaban(req,res,session)
        },['dosen'])
    })

    //  setting
    app.put("/api/setting/password",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            users.updatePassword(req,res,session)
        },['dosen','mahasiswa'])
    })

    // penilaian
    // ubah penilaian
    app.put("/api/kelas/:kode_kelas/penilaian",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            penilaian.setPenilaianKelas(req,res,session)
        },['dosen'])
    })

    // get penilaian
    app.get("/api/kelas/:kode_kelas/penilaian",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            penilaian.getPenilaianKelas(req,res,session)
        },['dosen','mahasiswa'])
    })

    // get profil
    app.get("/api/profile",(req,res) => {        
        md.tokenVerify(req,res,(session) => {
            users.getProfile(req,res,session)
        },['dosen','mahasiswa','admin'])
    })

    // list beranda kelas mahasiswa
    app.get("/api/kelas=:roles",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.getKelasBeranda(req,res,session)
        },['mahasiswa'])
    })
    // kelas hari ini
    app.get("/api/kelas=:roles/hariini",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            cls.getkelasHariIni(req,res,session)
        },['mahasiswa'])
    })

    // admin
    app.post("/api/admin/verifikasi",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.uploadVerifikasiData(req,res,session)
        },['admin'])
    })

    app.get("/api/admin/verifikasi/:role",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.getDataVerifikasi(req,res,session)
        },['admin'])
    })

    app.get("/api/admin/users/:role",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            manajemen.getDataUsers(req,res,session)
        },['admin'])
    })

    // get hasil nilai mahasiswa

    app.get("/api/hasil/tugas=:tugas_id/",(req,res) => {
        md.tokenVerify(req,res,(session) => {
            hasil.getListNilaiMahasiswaByTugasMahasiswa(req,res,session)
        },['dosen'])
    })

    // get gamification
    app.get("/api/gamification/:user_id",function(req,res){
        md.tokenVerify(req,res,(session) => {
            hasil.getGamificationMahasiswa(req,res,session)
        },['dosen','mahasiswa'])
    })


    // get nilai akhir
    app.get("/api/nilai/:kode_kelas",function(req,res){
        md.tokenVerify(req,res,(session) => {
            hasil.finalNilaiMahasiswa(req,res,session)
        },['dosen'])
    })

    // penilaian sikap
    app.post("/api/penilaian/sikap/:kode_kelas",function(req,res){
        md.tokenVerify(req,res,(session) => {
            hasil.setPenilaianMahasiswa(req,res,session)
        },['dosen'])
    })

    // profile photo
    app.get('/api/profile/photo/:id',async function(req,res){
        
        let db = new Database()
            db = await db.Select(['users.user_id','path'])
                .From('users')
                .LeftJoin('biodata').On({table:'users',column:'user_id',value:'users.user_id'})
                .Where({column:'users.user_id',value:req.params.id})
                .GetAsync().catch((err) => {
                    console.log(err);
                    return res.status(402).json({
                        message:'maaf ada sesuatu yang salah',
                        success:false
                    })
                })
            
            if(db.rowCount == 0){
                

                fs.readFile(`${__dirname}/storage/default/user.png`,function(err,data){
                    if(err) console.log(err);
                    res.writeHead(200,{
                        'content-type':'image/png'
                    })
                    return res.end(data)
                })
            }
        if(fs.existsSync(db.rows[0].path)){
            fs.readFile(db.rows[0].path,function(err,data){
                if(err) console.log(err);
                res.writeHead(200,{
                    'content-type':'image/png',
                    'content-type':'image/jpeg',
                })
                return res.end(data)
            })
            return
        }

        fs.readFile(`${__dirname}/storage/default/user.png`,function(err,data){
            if(err) console.log(err);
            res.writeHead(200,{
                'content-type':'image/png'
            })
            return res.end(data)
        })

    })

   


    app.get('/api/notifikasi',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            notifikasi.getNotification(req,res,session)
        },['dosen','mahasiswa'])
    })

    app.post('/api/notifikasi',(req,res) => {
        md.tokenVerify(req,res,(session) => {
            notifikasi.setReadNotification(req,res,session)
        },['dosen','mahasiswa'])
    })
}




module.exports = { route }