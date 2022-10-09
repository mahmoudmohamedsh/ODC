const dotenv = require("dotenv");
dotenv.config();
const userModel = require('../models/user')
module.exports = (req, res, next) => {

    userid = req.userId;
    userModel.findById(userid).then(user => {

        if (!user) {
            const error = new Error('not allow to do this');
            error.statusCode = 500;
            throw error;
        }

        
        if (!(user._id.toString()  === process.env.ADMIN_ID)) {
            const error = new Error('not allow to do this');
            error.statusCode = 500;
            throw error;
        }
        
        if (!(user.email === process.env.ADMIN_EMAIL)) {
            const error = new Error('not allow to do this');
            error.statusCode = 500;
            throw error;
        }
        next()

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    })

}