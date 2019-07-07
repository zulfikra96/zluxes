"use strict"
const express   = require('express')
const app       = express.Router()
const fs        = require('fs')

/**
 * execute web on here
 */
app.get("/",function(req,res){
    res.render("index.html")
})



module.exports = app