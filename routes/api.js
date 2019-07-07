"use strict"
const { Middleware } = require('../core/middleware')
const users = require('../controllers/user_managemen').UserManajemen
const md = new Middleware(['user_id','role','token','fullname','email'])
const express = require('express')
const app = express.Router()

// login
app.post("/login",(req,res) => {
    users.login(req,res)
})
// add user
app.post("/users",(req,res) => {
    md.tokenVerify(req,res,(session) => {
        users.addUser(req,res,session)
    },['superadmin'])
})
// list user
app.get("/users/offset=:offset/limit=:limit/orderby=:orderby",(req,res)=>{
    md.tokenVerify(req,res,(session) => {
        users.listUser(req,res,session)
    },['superadmin'])
})

module.exports = app