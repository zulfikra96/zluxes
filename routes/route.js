const fs = require('fs')
const { Middleware } = require('../core/middleware')

const route = (app,recaptcha,md) => {
    app.get('/login',(req,res) => {
        res.send("hello world")
    })
}


module.exports = { route }