

// init router
var router = new Router({
    mode: 'history',
    page404: function (path) {
        return router.navigateTo('/notfound')
    }
});

// login
router.add('/login/{id}', function () {
    login.main()
        .controller()
});
// router js
router.add('', function () {
    home.dosen()
});

router.add('/notfound', function () {
    let home = new viewsNotFound()
    home.home()
});

router.add('/home', function () {
    console.log("session is");
    
    console.log(session());
    
    if(session() != null && session().roles == 'mahasiswa')
    {
        if(localStorage.getItem('kelas') != null)
        {
            let kode_kelas = localStorage.getItem('kelas') 
            offlineKelas(kode_kelas)
        }
    }
    verifyToken(router,function(){
        
        let home = new viewsHome()
        if(session().roles == 'dosen')
        {
            return home.dosen().dosenController();
        }else if(session().roles == 'mahasiswa')
        {
            return home.mahasiswa().mahasiswaController()
            
        }
    },['dosen','mahasiswa'])
});

router.add('/kelas/{name}', function (name) {
    var id = name    
    if(session() != null & session().roles == 'mahasiswa')
    {
        localStorage.setItem('kelas',name)

    }
    verifyToken(router,function(){ 
        let kelas = new Kelas()
        kelas.views().
            controller(name)
    },['mahasiswa','dosen'])
});

router.add('/kelas/{name}/pertemuan-ke={pertemuan}&pertemuan-id={id}', function (name,pertemuan,id) {
    // var id = name  
    verifyToken(router,function(){ 
        let kelas = new Kelas()
        kelas.views().
            controller(name,pertemuan,id)
    },['mahasiswa','dosen'])
});

router.add('/tugas/{name}/pertemuan-ke={pertemuan}&pertemuan-id={id}&tugas={tugasid}',function(name,pertemuan,id,tugasid){
    verifyToken(router,function(){         
        tugas.main().
            controller(name,pertemuan,id,tugasid)
    },['mahasiswa','dosen'])
})

router.add('/tugas/{name}/pertemuan-ke={pertemuan}&pertemuan-id={id}&tugas={tugasid}/soal-no={soalno}&soal={soalid}',function(name,pertemuan,id,tugasid,soalno,soalid){
    verifyToken(router,function(){         
        tugas.main().
            controller(name,pertemuan,id,tugasid,soalno,soalid)
    },['mahasiswa','dosen'])
})

router.add("/tugas/{name}/pertemuan-id={id}/tugas-id={tugasid}",(name,id,tugasid) => {
    verifyToken(router,function(){         
        tugas_mahasiswa.main().
            controller(name,id,tugasid)
    },['mahasiswa'])
})

router.add("/tugas/{name}/pertemuan-id={id}/tugas-id={tugasid}/tugas",(name,id,tugasid) => {
    verifyToken(router,function(){         
        detail_tugas_mahasiswa.main().
            controller(name,id,tugasid)
    },['mahasiswa'])
})

router.add("/tugas/{name}/pertemuan-id={id}/tugas-id={tugasid}/tugas/{mahasiswa}",(name,id,tugasid,mahasiswa) => {
    verifyToken(router,function(){         
        penilaian.main().
            controller(name,id,tugasid,mahasiswa)
    },['dosen'])
})

router.add("/materi/{name}/pertemuan-id={id}",(name,id) => {
    verifyToken(router,function(){         
        materi.main().
            controller(name,id)
    },['mahasiswa','dosen'])
})

router.add("/streaming",(name,id) => {
    verifyToken(router,function(){         
        streaming.main().
            controller(name,id)
    },['mahasiswa','dosen'])
})


router.add('/about', function (name) {
    let about = new viewsAbout()
    about.main()
});

router.add('/profile', function (name) {
    profile.main().controller()
});

router.add('/login',function(name){
    verifySetToken(router,function(){
        let login = new viewsLogin()
        login.main()
    })

})

router.add('/register', function (name) {
    let register = new viewsRegister()
    register.main()
});

router.add('/#/home',function(name){
    document.getElementById('App').innerText = ''
    console.log("hello world");
})

// admin
router.add('/admin',function(name){
    admin.main()
        .controller()
})

router.add('/admin/dosen',function(name){
    admin.main()
        .controller('dosen')
})

router.add('/admin/mahasiswa',function(name){
    admin.main()
        .controller('mahasiswa')
})

router.add('/admin/dashboard',function(name){
    admin.main()
        .controller('dashboard')
})

router.add('/admin/aktivitas',function(name){
    admin.main()
        .controller('aktivitas')
})

router.add('/admin/ruangan',function(name){
    admin.main()
        .controller('ruangan')
})

router.add('/download/{kodekelas}',function(kodekelas){
    verifyToken(router,function(){         
        download.main().
            controller(kodekelas)
    },['dosen'])
})

router.addUriListener();
router.check()