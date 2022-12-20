const {User} = require('../models/models') 
const ApiError = require("../error/ApiError")

class UserController {
    async create(req, res, next) {
        try{
            const {name, points} = req.body        
            const user = await User.create({name, points})
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.massage))
        }
        
    }

    async getAll(req, res) {
       const users = await User.findAll()
       return res.json(users)
    }
}

module.exports = new UserController()