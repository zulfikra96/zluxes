"use strict"
const { Middleware } = require('../core/middleware')
const md = new Middleware(['user_id','role','token','fullname','email'])
const express = require('express')
const app = express.Router()

/**
 * url "localhost:3000/api/login"
 */
app.post("/login",(req,res) => {
    users.login(req,res)
})

module.exports = app