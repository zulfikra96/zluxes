const static_data = {
    domain:'http://localhost:3000/api',
    token:(localStorage.getItem('users') != null) ? JSON.parse(localStorage.getItem('users')).token:''
}

const BULAN = [
    "Januari","Februari","Maret", "April",
    "Mei","Juni","Juli","Agustus","September","Oktober",
    "November","Desember"
]

var socket = new io() 


function openCloseModal(args)
{

    if($(`#${args}`).hasClass('active'))
    {
       return $(`#${args}`).removeClass('active')
    }
    $(`#${args}`).addClass('active')
    
}

function session()
{
    let ses = JSON.parse(localStorage.getItem('session'))
    return ses
}

function _token()
{
    let ses = JSON.parse(localStorage.getItem('users'))
    return ses.token
}

function navbar(args)
{
    
        return /*html*/ `
        <style>
            .dropdown .menu{
                left: -120px;
            }
            .list-menu{
                width:100%;
            }
            .list-menu:hover{
                background-color:red;
            }
        </style>

        <header class="navbar box-shadow">
            <div class="container grid-mdl">
                <header class="">
                <section class="navbar-section">
                </section>
               
                <section class="navbar-section">
                    <div class="dropdown">
                        <a href="javascript:void(0)" class="dropdown-toggle" tabindex="0"><i class="fas fa-bell fa-1x" style="margin-left:12px;"></i></a>
                        
                        <ul class="menu" style="z-index:999; left: -120px;">
                            <li class="menu-item"><a href="home">Home</a></li>
                            <li class="menu-item"><a href="">Profile</a></li>
                            <li class="devider"></li>
                            ${args}
                            <li class="menu-item"><a href="#" onclick="eventListener(false,function(args){
                                let home = new viewsHome()
                                home.logout()
                            })">Logout</a></li>
                        </ul>
                    </div>
                    <div class="dropdown">
                        <a href="javascript:void(0)" class="dropdown-toggle" tabindex="0"><i class="fas fa-user-circle fa-2x" style="margin-left:12px;"></i></a>
                        
                        <ul class="menu" style="z-index:999; left: -120px;">
                            <li class="menu-item"><a href="home">Home</a></li>
                            <li class="menu-item"><a href="">Profile</a></li>
                            <li class="devider"></li>
                            ${args}
                            <li class="menu-item"><a href="#" onclick="eventListener(false,function(args){
                                let home = new viewsHome()
                                home.logout()
                            })">Logout</a></li>
                        </ul>
                    </div>
                </section>     
                </header>
            </div>
        </header>
        
        `
}

// countdown
function countDown(date,callback)
{
    var countDownDate = new Date(date).getTime();

// Update the count down every 1 second
var now = new Date().getTime();
          
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
          
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
        // Output the result in an element with id="demo"
        var time =  hours + ":" + minutes + ":" + seconds ;
        if (distance <= 0) {
          (callback != undefined) ? callback(true):''
            return
        }
        (callback != undefined) ? callback(false):''
        
        


return time

}


function views(view)
{
    
    document.getElementById('App').innerHTML = view
}

function render(view)
{
    
    document.getElementById('App').innerHTML = view
}

function viewsWithParams(args,callback)
{
    if(callback)
    {
        document.getElementById('App').innerHTML = callback(args)
    }
}

function getNilai(nilai)
{
   
    if(nilai > 85)
    {
        return 'A'
    }
    else if( nilai > 80 )
    {
        
        return 'A-'
    }
    else if(nilai > 75)
    {
        return 'B+'
    }
    else if( nilai > 70 )
    {
        return 'B'
    }
    else if( nilai > 65 )
    {
        return 'B-'
    }
    else if( nilai > 60 )
    {
        return 'C+'
    }
    else if( nilai > 55)
    {
        return 'C'
    }
    else if( nilai > 50)
    {
        return 'C-'
    }
    else if( nilai > 40)
    {
        return 'D'
    }
    else if( nilai >= 0)
    {
        return 'E'
    }

    
}

function imageLoad(img,dom)
{
    
        function response(e) {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            document.querySelector(dom).src = imageUrl;
            }
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", static_data.domain + img);
        xhr.responseType = "blob";
        xhr.onload = response;
        xhr.send();
    
}


function requireModule(args, callback)
{
    let script = document.createElement('script')
    script.setAttribute('type','text/javascript')
    script.setAttribute('src',args)
    // script.setAttribute('async','')

    document.head.appendChild(script)

    if(callback) callback()
}

function requireModuleInnerBody(args, callback)
{
    let script = document.createElement('script')
    script.setAttribute('type','text/javascript')
    script.setAttribute('src',args)
    // script.setAttribute('async','')
    let body = document.getElementsByTagName('body')[0]
    body.appendChild(script)

}

function closeModal(event)
{
    console.log(event);
    
}

function verifySetToken(router,callback)
{
    console.log(localStorage.getItem('users') != null);
    
    if(localStorage.getItem('users') != null)
    {
         router.remove('/login')
         return views(`
            <h1>Page not found</h1>
         `);
    }
    if(callback) return callback()

}

function _token()
{
    let _token = localStorage.getItem('users')
    if(!_token)
    {
        router.navigateTo('/notfound')
    }
    _token = JSON.parse(_token)
    if(_token) _token = _token.token
    
    return _token
}

function openClose(args)
{
    if($(`#${args}`).hasClass('active'))
    {
       return $(`#${args}`).removeClass('active')
    }
    $(`#${args}`).addClass('active')
}
function verifyToken(router,callback,roles)
{
    let _token = localStorage.getItem('users')
    if(_token == null)
    {
        router.navigateTo('/notfound')
        
    }
    if(roles == undefined)
    {
        // router.navigateTo('/notfound')
        return console.error("roles does not exists");

    }
    _token = JSON.parse(_token)
    if(_token) _token = _token.token
    
    if(roles != undefined && !Array.isArray(roles))
    {
        roles = [`${roles}`]
    }
    
    axios({
        url:`${static_data.domain}/session`,
        method:'GET',
        headers:{ 
            "_token":_token
        }
    }).then(function(data){
        
        let error = 0
        for (let i = 0; i < roles.length; i++) {
            if(roles[i] != data.data.session.roles)  error += 1
        }
        if(error == roles.length)
        {
            return router.navigateTo('/notfound')
        }

        localStorage.setItem('session',JSON.stringify(data.data.session))
        if(callback) return callback(data)
    })
    .catch(function(err){
        console.log("error found " + err);
        return router.navigateTo('/notfound')
    })
}

function session()
{
    let ses = localStorage.getItem('session')
    ses = JSON.parse(ses)
    return ses
}


function jam(args)
{
    // console.log("data in jam " + args);
    
    let time = args.split(':')
    time = time[0]+'.'+time[1]
    console.log(args);
    
    
    return time
}

function hari(args)
{
    let day = [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu'
    ]

    return day[args]
}


function eventListener(args,callback)
{
    if(callback) callback(args)
}


function formToJson(id)
{
    let form = document.getElementById(id)
    let data = {}

    for(let i = 0 ; i < form.length; i++)
    {
        if(form[i].getAttribute('id') != null)
        {
            data[`${form[i].getAttribute('id')}`] = form[i].value
        }        
    }

    return data
}


function logAktifitasMahasiswa(kode_kelas,aktifitas)
{
    let data = {
        token:_token(),
        aktifitas:aktifitas,
        kode_kelas:kode_kelas
    }
    socket.emit(`/aktifitas`,data)
}

function logAktifitasUsers(aktifitas)
{
    let data = {
        token:_token(),
        aktifitas:aktifitas,
    }
    socket.emit(`/aktivitas/pengguna`,data)
}





