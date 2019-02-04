
class viewsLogin {

    main()
    {
        return views(/*html*/ `
            
            <div class="container" >
                <div class="columns">
                <style>
                    .background{
                        background-image:
                        linear-gradient(
                            rgba(4, 0, 255, 0.45), 
                            rgba(255, 0, 55, 0.45)
                        ),
                            url('http://www.untag-sby.ac.id/foto_berita/80untag123.jpg');
                        background-size:cover;
                        background-color:red;
                    }
                </style>
                    <div class="column background col-6" style="background-color:#5b59ff; height:100vh;padding-top:230px; padding-left:80px;">
                        <h1 style=" color:#fff;"> <strong>E-Learning</strong> <br> Universitas 17 Agustus Surabaya</h1>
                        <div class="divider"></div>
                        <h5 style="color:#fff">Belajar lebih mudah dan interaktif</h5>
                    </div>
                    <div class="column col-6  " style="padding-left:120px;padding-right:120px; padding-top:100px;background-color:#fff;height:100vh">
                        <div class="columns">
                            <div class="column col-2 col-mx-auto ">
                                <img src="/assets/images/logos/logo-untag.png" class="img-responsive">
                            </div>
                            <div class="column col-12">
                            <br>
                                
                            </div>
                        </div>
                        <!--Form Register-->
                        <form action="javascript:void(0)" id="form" method="POST" onsubmit="eventListener('',function(){
                            let view = new viewsLogin()
                            view.loginPost(event)
                        })">
                            <div class="container">
                                <div class="columns">
                                    <div class="column col-12">
                                        <div class="form-group">
                                            <label for="" class="form-label">Nomor Induk</label>
                                            <input type="text" class="form-input" maxlength="100" placeholder="Nomor induk" id="nomor_induk">
                                        </div>
                                        <div class="form-group">
                                            <label for="" class="form-label">Password</label>
                                            <input type="password" class="form-input" placeholder="Password" id="password" maxlength="40" required>
                                        </div>
                                        <div class="form-group">
                                            <span style="color:red;text-align:center;" id="error"></span>
                                        </div>
                                        <span id="error-message" style="color:red;"></span>
                                        <br>
                                        <a href="/register">Register</a>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="columns">
                                <div class="column col-12 " style="text-align:center;">
                                    <button type="submit" class=" btn-block btn btn-primary" >Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `)
    }

    async loginPost(event)
    {
        let json = formToJson('form')
     
          axios({
            url:`${static_data.domain}/login`,
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            data:json
        }).then(function(response){
            // console.log(response);
            
            
            document.getElementById('error-message').innerHTML = response.data.message
            if(response.status == 400)
            {
                document.getElementById(response.data.input).style.border = "solid red 1px";
                return
            }

            localStorage.setItem('users',JSON.stringify({
                user_id:response.data.user_id,
                token:response.data.token
            }))

            fetch(`${static_data.domain}/session`,{
                method:'GET',
                credentials:'same-origin',
                headers: new Headers({
                    _token:_token()
                })
            })
           .then(async function(response){
                let res =  await response.json()
                // console.log(data.data.roles);
               if(res.status == 400)
               {
                   router.remove('/login')
               }
               localStorage.setItem('session',JSON.stringify(res))
               console.log("session is " + localStorage.getItem('session'));
               
               if(localStorage.getItem('session') != null)
                {
                    logAktifitasUsers("melakukan login pada aplikasi")
                     if(res.session.roles == 'dosen')
                     {
                         return router.navigateTo('/home')
                     }else if(res.session.roles == 'mahasiswa'){
                         return router.navigateTo('/home')
 
                     }else if(res.session.roles == 'admin'){
                         
                         return router.navigateTo('/admin')
                     }
                }
               
               
               
           })
           .catch(function(err){
                console.log(err);               
           })
             
        })

        
        
        
        
        
    }
}


