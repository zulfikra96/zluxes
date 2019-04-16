
const fs = require('fs')
const { Middleware } = require('../core/middleware')
const md = new Middleware(['user_id','nama_role AS role','token','nama','email'])
const route = (app,recaptcha) => {
    app.get("/test",(req,res) => {
        res.send("hello world")
    })
}
module.exports = { route }