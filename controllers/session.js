"use-strict"
const { Controller } = require("./controller");
class Session extends Controller{
    constructor()
    {
        super()
    }
    profile(req,res,session)
    {
        delete session["token"]
        session["profile_photo"] = "/api/karyawan/profile/photo"
        return res.json(session)
    }
}
exports.Session = new Session();