"use strict"
const express   = require('express')
const app       = express.Router()
const fs        = require('fs')

/**
 * execute web on here
 */
app.get("/register",function(req,res){
    res.render("register.html")
})

app.post("/registrasi",function(req,res){
    let data = req.body
    console.log(data)
    res.send();
});


module.exports = app